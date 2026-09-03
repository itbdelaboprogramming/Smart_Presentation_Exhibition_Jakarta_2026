import * as THREE from "three";
import { scene, camera, orbitControls } from "../script.js";
import {
	annotations as store,
	saveProgress,
	resetToSeed,
} from "./recyclingPlantAnnotationsStore.js";
import {
	activateRecyclingPlant,
	deactivateRecyclingPlant,
	getMeshMap,
} from "./recyclingPlant.js";
import { initOutline, setOutline, clearAllOutlines } from "./recyclingPlantOutline.js";

const SELECT_COLOR = 0xffa500; 
const GROUP_COLOR = 0x2fbf71; 
const ANCHOR_COLOR = 0xff5a5a;
const DEFAULT_LABEL_LIFT = 1.5;
const MAX_GROUP_ROWS = 250; 

let currentId = store[0] && store[0].id;
let selected = new Set(); // 3D object
let meshByName = null;
let allNodeNames = [];
let lastHit = null;
const tinted = new Map(); // mesh -> applied hex
let anchorMarker = null;
let marqueeEl = null;
let suppressClick = false;
const el = {};

export function init() {
	waitForModel().then((file3D) => {
		meshByName = getMeshMap();
		allNodeNames = [...meshByName.keys()];
		anchorMarker = makeMarker(file3D);
		initOutline();
		buildUI();
		wireRaycaster();
		wireMarquee();
		selectAnnotation(currentId);
		console.info(
			"[tagTool] ready - click parts to tag, Shift+drag to box-select, Shift+Alt+drag to deselect."
		);
	});
}

// -------------------------------- scene helpers --------------------------------

function waitForModel() {
	return new Promise((resolve) => {
		const check = () => {
			const f = scene.getObjectByName("file3D");
			if (f) resolve(f);
			else setTimeout(check, 200);
		};
		check();
	});
}

function makeMarker(file3D) {
	const m = new THREE.Mesh(
		new THREE.SphereGeometry(0.18, 16, 16),
		new THREE.MeshBasicMaterial({ color: ANCHOR_COLOR, depthTest: false })
	);
	m.renderOrder = 999;
	m.visible = false;
	file3D.add(m);
	return m;
}

function getCurrent() {
	return store.find((a) => a.id === currentId);
}

const centerCache = new WeakMap();

function meshCenter(mesh) {
	let c = centerCache.get(mesh);
	if (c) return c;
	c = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
	centerCache.set(mesh, c);
	return c;
}

// -------------------------------- tinting --------------------------------

function disposeMeshClones(mesh) {
	const cur = mesh.material;
	(Array.isArray(cur) ? cur : [cur]).forEach((m) => m && m.dispose && m.dispose());
}

function tint(mesh, hex) {
	if (!mesh) return;
	if (mesh.userData.rptOrigMat === undefined) mesh.userData.rptOrigMat = mesh.material;
	else disposeMeshClones(mesh);
	const orig = mesh.userData.rptOrigMat;
	const cloneOne = (m) => {
		const c = m.clone();
		if (c.emissive) c.emissive.setHex(hex);
		return c;
	};
	mesh.material = Array.isArray(orig) ? orig.map(cloneOne) : cloneOne(orig);
	tinted.set(mesh, hex);
}

function untint(mesh) {
	disposeMeshClones(mesh);
	mesh.material = mesh.userData.rptOrigMat;
	delete mesh.userData.rptOrigMat;
	tinted.delete(mesh);
}

function clearTints() {
	[...tinted.keys()].forEach(untint);
}

function repaint() {
	const want = new Map();
	const groupMeshes = [];
	(getCurrent().meshNames || []).forEach((n) => {
		const m = meshByName.get(n);
		if (!m) return;
		want.set(m, GROUP_COLOR);
		if (!selected.has(m)) groupMeshes.push(m); 
	});
	selected.forEach((o) => want.set(o, SELECT_COLOR)); 

	const stale = [];
	tinted.forEach((hex, mesh) => {
		if (want.get(mesh) !== hex) stale.push(mesh);
	});
	stale.forEach(untint);
	want.forEach((hex, mesh) => {
		if (tinted.get(mesh) !== hex) tint(mesh, hex);
	});

	setOutline("group", groupMeshes);
	setOutline("select", [...selected]);
}

function updateAnchorMarker() {
	const a = getCurrent().anchor;
	if (a) {
		anchorMarker.position.set(a.x, a.y, a.z);
		anchorMarker.visible = true;
	} else {
		anchorMarker.visible = false;
	}
}

// -------------------------------- selection + picking --------------------------------

function wireRaycaster() {
	const dom = orbitControls.domElement;
	const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2();

	dom.addEventListener("click", (e) => {
		if (suppressClick) {
			suppressClick = false;
			return;
		}
		const rect = dom.getBoundingClientRect();
		pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
		pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
		raycaster.setFromCamera(pointer, camera);

		const file3D = scene.getObjectByName("file3D");
		const hits = raycaster
			.intersectObject(file3D, true)
			.filter((h) => h.object !== anchorMarker);
		if (!hits.length) return;

		lastHit = hits[0].point.clone();
		const obj = hits[0].object;
		if (selected.has(obj)) selected.delete(obj);
		else selected.add(obj);
		repaint();
		renderEditor();
		renderFilter();
	});
}

// -------------------------------- box select --------------------------------

function wireMarquee() {
	const dom = orbitControls.domElement;
	let dragging = false;
	let start = null;

	marqueeEl = document.createElement("div");
	marqueeEl.className = "rpt-marquee";
	marqueeEl.style.display = "none";
	document.body.appendChild(marqueeEl);

	dom.addEventListener("pointerdown", (e) => {
		suppressClick = false; 
		if (!e.shiftKey || e.button !== 0) return;
		e.preventDefault();
		dragging = true;
		start = { x: e.clientX, y: e.clientY };
		orbitControls.enabled = false;
		drawMarquee(start, start);
		marqueeEl.style.display = "block";
	});

	window.addEventListener("pointermove", (e) => {
		if (!dragging) return;
		drawMarquee(start, { x: e.clientX, y: e.clientY });
	});

	window.addEventListener("pointerup", (e) => {
		if (!dragging) return;
		dragging = false;
		marqueeEl.style.display = "none";
		orbitControls.enabled = true;
		suppressClick = true; 

		const rect = {
			left: Math.min(start.x, e.clientX),
			right: Math.max(start.x, e.clientX),
			top: Math.min(start.y, e.clientY),
			bottom: Math.max(start.y, e.clientY),
		};
		if (rect.right - rect.left < 3 && rect.bottom - rect.top < 3) return; 

		selectInRect(rect, e.altKey);
	});
}

function drawMarquee(a, b) {
	marqueeEl.style.left = Math.min(a.x, b.x) + "px";
	marqueeEl.style.top = Math.min(a.y, b.y) + "px";
	marqueeEl.style.width = Math.abs(a.x - b.x) + "px";
	marqueeEl.style.height = Math.abs(a.y - b.y) + "px";
}

function selectInRect(rect, subtract) {
	const canvasRect = orbitControls.domElement.getBoundingClientRect();
	camera.updateMatrixWorld();

	const ndc = new THREE.Vector3();
	meshByName.forEach((mesh) => {
		ndc.copy(meshCenter(mesh)).project(camera);
		if (ndc.z > 1) return; // behind the camera
		const x = canvasRect.left + (ndc.x * 0.5 + 0.5) * canvasRect.width;
		const y = canvasRect.top + (-ndc.y * 0.5 + 0.5) * canvasRect.height;
		if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return;
		if (subtract) selected.delete(mesh);
		else selected.add(mesh);
	});

	repaint();
	renderEditor();
	renderFilter();
}

// -------------------------------- actions --------------------------------

function addSelection() {
	const ann = getCurrent();
	if (!ann.meshNames) ann.meshNames = [];
	selected.forEach((o) => {
		if (o.name && !ann.meshNames.includes(o.name)) ann.meshNames.push(o.name);
	});
	selected.clear();
	saveProgress();
	repaint();
	renderAll();
}

/** Bulk counterpart to Add selection: drop every selected mesh from the group. */
function excludeSelection() {
	const ann = getCurrent();
	if (!selected.size) return alert("Pilih dulu part yang mau dikeluarkan.");
	const drop = new Set([...selected].map((o) => o.name));
	ann.meshNames = (ann.meshNames || []).filter((n) => !drop.has(n));
	selected.clear();
	saveProgress();
	repaint();
	renderAll();
}

function clearSelection() {
	selected.clear();
	repaint();
	renderEditor();
	renderFilter();
}

function removeFromGroup(name) {
	const ann = getCurrent();
	ann.meshNames = (ann.meshNames || []).filter((n) => n !== name);
	saveProgress();
	repaint();
	renderAll();
}

function clearGroup() {
	const ann = getCurrent();
	const total = (ann.meshNames || []).length;
	if (!total) return;
	if (!confirm(`Hapus semua ${total} mesh dari "${ann.title}"?`)) return;
	ann.meshNames = [];
	saveProgress();
	repaint();
	renderAll();
}

function setAnchor() {
	if (!lastHit) return alert("Klik dulu satu bagian di model.");
	const ann = getCurrent();
	ann.anchor = { x: lastHit.x, y: lastHit.y, z: lastHit.z };
	if (!ann.labelOffset)
		ann.labelOffset = { x: lastHit.x, y: lastHit.y + DEFAULT_LABEL_LIFT, z: lastHit.z };
	saveProgress();
	updateAnchorMarker();
	renderAll();
}

function resetAnchor() {
	const ann = getCurrent();
	if (!ann.anchor) return;
	ann.anchor = null;
	ann.labelOffset = null;
	saveProgress();
	updateAnchorMarker();
	renderAll();
}

function saveCamera() {
	const ann = getCurrent();
	ann.camera = {
		position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
		target: { x: orbitControls.target.x, y: orbitControls.target.y, z: orbitControls.target.z },
		duration: 1.8,
	};
	saveProgress();
	renderAll();
}

function resetCamera() {
	const ann = getCurrent();
	if (!ann.camera) return;
	ann.camera = null;
	saveProgress();
	renderAll();
}

function preview() {
	clearTints();
	clearAllOutlines();
	anchorMarker.visible = false;
	deactivateRecyclingPlant();
	setTimeout(() => activateRecyclingPlant(), 1600);
}

function exportJSON() {
	const clean = store.map(({ region, exclude, ...rest }) => rest);
	const blob = new Blob([JSON.stringify(clean, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "recyclingPlantAnnotations.json";
	a.click();
	URL.revokeObjectURL(url);
}

function resetAll() {
	if (!confirm("Reset semua progress tagging ke awal?")) return;
	clearTints();
	selected.clear();
	resetToSeed();
	currentId = store[0] && store[0].id;
	selectAnnotation(currentId);
}

function selectAnnotation(id) {
	currentId = id;
	selected.clear();
	repaint();
	updateAnchorMarker();
	renderAll();
}

// -------------------------------- UI --------------------------------

function buildUI() {
	const panel = document.createElement("div");
	panel.className = "rpt-panel";
	panel.innerHTML = `
		<div class="rpt-head">
			<span>Tag Tool</span>
			<button class="rpt-toggle" id="rpt-toggle" title="Collapse / expand">▾</button>
		</div>
		<div class="rpt-body">
			<div class="rpt-list" id="rpt-list"></div>

			<div class="rpt-editor">
				<div class="rpt-sel-name" id="rpt-sel-name"></div>
				<div class="rpt-sel-meta" id="rpt-sel-meta"></div>
				<div class="rpt-hint">Shift+drag = box select · Shift+Alt+drag = deselect</div>
				<div class="rpt-actions">
					<button class="rpt-btn primary" id="rpt-add">Add selection</button>
					<button class="rpt-btn" id="rpt-exclude">Exclude selection</button>
				</div>
				<div class="rpt-actions">
					<button class="rpt-btn" id="rpt-clear-sel">Clear selection</button>
				</div>
				<div class="rpt-actions">
					<button class="rpt-btn" id="rpt-anchor">Set anchor</button>
					<button class="rpt-btn" id="rpt-anchor-reset">Reset anchor</button>
				</div>
				<div class="rpt-actions">
					<button class="rpt-btn" id="rpt-cam">Set camera</button>
					<button class="rpt-btn" id="rpt-cam-reset">Reset camera</button>
				</div>
				<button class="rpt-btn primary" id="rpt-preview">Preview</button>
			</div>

			<div>
				<div class="rpt-block-head">
					<span>Mesh in curr group (<span id="rpt-count">0</span>)</span>
					<button class="rpt-link" id="rpt-clear-group">clear all</button>
				</div>
				<div class="rpt-group" id="rpt-group"></div>
			</div>

			<div>
				<div class="rpt-block-head"><span>Search mesh</span></div>
				<input class="rpt-input" id="rpt-filter" placeholder="type mesh name, click to select" />
				<div class="rpt-flist" id="rpt-flist"></div>
			</div>
		</div>
		<div class="rpt-foot">
			<button class="rpt-btn primary" id="rpt-export">Export JSON</button>
			<button class="rpt-btn" id="rpt-reset">Reset</button>
		</div>
	`;
	document.body.appendChild(panel);

	el.list = panel.querySelector("#rpt-list");
	el.selName = panel.querySelector("#rpt-sel-name");
	el.selMeta = panel.querySelector("#rpt-sel-meta");
	el.count = panel.querySelector("#rpt-count");
	el.group = panel.querySelector("#rpt-group");
	el.filter = panel.querySelector("#rpt-filter");
	el.flist = panel.querySelector("#rpt-flist");

	panel.querySelector("#rpt-add").onclick = addSelection;
	panel.querySelector("#rpt-exclude").onclick = excludeSelection;
	panel.querySelector("#rpt-clear-sel").onclick = clearSelection;
	panel.querySelector("#rpt-anchor").onclick = setAnchor;
	panel.querySelector("#rpt-anchor-reset").onclick = resetAnchor;
	panel.querySelector("#rpt-cam").onclick = saveCamera;
	panel.querySelector("#rpt-cam-reset").onclick = resetCamera;
	panel.querySelector("#rpt-preview").onclick = preview;
	panel.querySelector("#rpt-clear-group").onclick = clearGroup;
	panel.querySelector("#rpt-export").onclick = exportJSON;
	panel.querySelector("#rpt-reset").onclick = resetAll;
	el.filter.addEventListener("input", renderFilter);

	const collapsed = localStorage.getItem("rptCollapsed") === "1";
	if (collapsed) panel.classList.add("collapsed");
	panel.querySelector(".rpt-head").onclick = () => {
		const isCollapsed = panel.classList.toggle("collapsed");
		localStorage.setItem("rptCollapsed", isCollapsed ? "1" : "0");
	};
}

function renderAll() {
	renderList();
	renderEditor();
	renderGroup();
	renderFilter();
}

function renderList() {
	el.list.innerHTML = "";
	[...store]
		.sort((a, b) => a.order - b.order)
		.forEach((ann) => {
			const row = document.createElement("div");
			row.className = "rpt-row" + (ann.id === currentId ? " active" : "");
			row.innerHTML = `
				<span class="rpt-num">${ann.order}</span>
				<span class="rpt-row-name" title="${ann.title} — ${ann.titleEn}">${ann.title}</span>
				<span class="rpt-dots">
					<span class="rpt-dot ${(ann.meshNames || []).length ? "on" : ""}" title="mesh"></span>
					<span class="rpt-dot ${ann.anchor ? "on" : ""}" title="anchor"></span>
					<span class="rpt-dot ${ann.camera ? "on" : ""}" title="camera"></span>
				</span>
			`;
			row.onclick = () => selectAnnotation(ann.id);
			el.list.appendChild(row);
		});
}

function renderEditor() {
	const ann = getCurrent();
	el.selName.textContent = `${ann.order}. ${ann.title}`;
	const ok = (b) => (b ? "✓" : "–");
	el.selMeta.textContent =
		`${(ann.meshNames || []).length} mesh · anchor ${ok(!!ann.anchor)} · camera ${ok(!!ann.camera)}` +
		(selected.size ? ` · selected ${selected.size}` : "");
}

function renderGroup() {
	const names = getCurrent().meshNames || [];
	el.count.textContent = String(names.length);
	el.group.innerHTML = "";
	if (!names.length) {
		el.group.innerHTML = `<div class="rpt-empty">Empty.</div>`;
		return;
	}

	names.slice(0, MAX_GROUP_ROWS).forEach((name) => {
		const row = document.createElement("div");
		row.className = "rpt-gitem";
		row.innerHTML = `<span title="${name}">${name}</span><span class="x">✕</span>`;
		row.querySelector(".x").onclick = () => removeFromGroup(name);
		el.group.appendChild(row);
	});
	if (names.length > MAX_GROUP_ROWS) {
		const more = document.createElement("div");
		more.className = "rpt-empty";
		more.textContent = `… +${names.length - MAX_GROUP_ROWS} more`;
		el.group.appendChild(more);
	}
}

function renderFilter() {
	const q = (el.filter.value || "").trim().toLowerCase();
	el.flist.innerHTML = "";
	if (!q) return;
	const selNames = new Set([...selected].map((o) => o.name));
	allNodeNames
		.filter((n) => n.toLowerCase().includes(q))
		.slice(0, 150)
		.forEach((name) => {
			const row = document.createElement("div");
			row.className = "rpt-fitem" + (selNames.has(name) ? " on" : "");
			row.innerHTML = `<span title="${name}">${name}</span>`;
			row.onclick = () => {
				const obj = meshByName.get(name);
				if (!obj) return;
				if (selected.has(obj)) selected.delete(obj);
				else selected.add(obj);
				repaint();
				renderEditor();
				renderFilter();
			};
			el.flist.appendChild(row);
		});
}
