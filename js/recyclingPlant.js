import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { scene, camera, orbitControls, frameCallbacks } from "../script.js";
import { annotations as annotationsData, DEFAULT_VIEW } from "./recyclingPlantAnnotationsStore.js";
import { initOutline, setOutline, clearOutline } from "./recyclingPlantOutline.js";

const explodeButton = document.getElementById("explode-button");
const listPopup = document.getElementById("rp-list-popup");
const leaderLineSvg = document.getElementById("rp-leader-line-svg");
const infoPopup = document.getElementById("rp-info-popup");
const infoPopupClose = document.getElementById("rp-info-popup-close");
const infoPopupBadge = document.getElementById("rp-info-popup-badge");
const infoPopupTitle = document.getElementById("rp-info-popup-title");
const infoPopupTitleEn = document.getElementById("rp-info-popup-title-en");
const infoPopupImage = document.getElementById("rp-info-popup-image");
const infoPopupDescription = document.getElementById("rp-info-popup-description");
const ENABLE_OCCLUSION = true;
const OCCLUSION_INTERVAL_MS = 250;
const GHOST_COLOR = 0xe6eef0;
const GHOST_OPACITY = 1; // 0.3 for see-through, 1 for solid

let activated = false;
let focusedId = null;
let meshByName = null;
let ghostMaterial = null;
const ghostedMeshes = [];

const occlusionRaycaster = new THREE.Raycaster();
let lastOcclusionCheck = 0;

// id -> { listItem, dot?, dotEl?, label?, labelEl?, line?, anchor?, labelOffset? }
const markerEntries = new Map();

if (infoPopupClose) {
	infoPopupClose.addEventListener("click", () => {
		closeInfoPopup();
		if (focusedId) unfocusAnnotation();
	});
}

// ------------------------------------------- helpers -------------------------------------------

function getFile3D() {
	return scene.getObjectByName("file3D");
}

function waitForModel() {
	return new Promise((resolve) => {
		const check = () => {
			const file3D = getFile3D();
			if (file3D) resolve(file3D);
			else setTimeout(check, 200);
		};
		check();
	});
}

function buildMeshMap() {
	if (meshByName) return meshByName;
	const file3D = getFile3D();
	if (!file3D) return new Map();
	meshByName = new Map();
	const counts = new Map(); 
	file3D.traverse((child) => {
		if (!child.isMesh) return;
		const base = child.name && child.name.length ? child.name : "mesh";
		let name = base;
		if (meshByName.has(name)) {
			let n = (counts.get(base) || 1) + 1;
			name = `${base}__${n}`;
			while (meshByName.has(name)) name = `${base}__${++n}`;
			counts.set(base, n);
		} else {
			counts.set(base, 1);
		}
		child.name = name; 
		meshByName.set(name, child);
	});
	return meshByName;
}

export function getMeshMap() {
	return buildMeshMap();
}

function toVector3(point) {
	return new THREE.Vector3(point.x, point.y, point.z);
}

function isTaggable(ann) {
	return !ann.standalone && ann.anchor && ann.labelOffset;
}

function isFlyable(ann) {
	return !ann.standalone && ann.camera && ann.anchor;
}

// -------------------------------- leader-line screen-space projection --------------------------------
function worldToScreen(vector3) {
	const canvas = document.getElementById("myCanvas");
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const projected = vector3.clone().project(camera);
	return {
		x: (projected.x * 0.5 + 0.5) * width,
		y: (-projected.y * 0.5 + 0.5) * height,
	};
}

function updateLeaderLines() {
	markerEntries.forEach((entry) => {
		if (!entry.line) return;
		const a = worldToScreen(entry.anchor);
		const b = worldToScreen(entry.labelOffset);
		entry.line.setAttribute("x1", a.x);
		entry.line.setAttribute("y1", a.y);
		entry.line.setAttribute("x2", b.x);
		entry.line.setAttribute("y2", b.y);
	});
}

function updateOcclusion(now) {
	if (now - lastOcclusionCheck < OCCLUSION_INTERVAL_MS) return;
	lastOcclusionCheck = now;

	const file3D = getFile3D();
	if (!file3D) return;

	markerEntries.forEach((entry) => {
		if (!entry.anchor || !entry.dotEl) return;

		const worldAnchor = file3D.localToWorld(entry.anchor.clone());
		const ndc = worldAnchor.clone().project(camera);
		const onScreen =
			ndc.z < 1 && ndc.x >= -1 && ndc.x <= 1 && ndc.y >= -1 && ndc.y <= 1;
		if (!onScreen) {
			entry.dotEl.classList.remove("rp-occluded");
			if (entry.labelEl) entry.labelEl.classList.remove("rp-occluded");
			return;
		}

		const dir = worldAnchor.clone().sub(camera.position);
		const dist = dir.length();
		dir.normalize();
		occlusionRaycaster.set(camera.position, dir);
		const hits = occlusionRaycaster.intersectObject(file3D, true);
		const occluded = hits.length > 0 && hits[0].distance < dist - 0.4;

		entry.dotEl.classList.toggle("rp-occluded", occluded);
		if (entry.labelEl) entry.labelEl.classList.toggle("rp-occluded", occluded);
	});
}

frameCallbacks.push(() => {
	if (!activated) return;
	updateLeaderLines();
	if (ENABLE_OCCLUSION) updateOcclusion(performance.now());
});

// ------------------------------------- markers + list creation -------------------------------------

function createMarkersAndList() {
	const file3D = getFile3D();
	const sorted = [...annotationsData].sort((a, b) => a.order - b.order);

	const header = document.createElement("div");
	header.className = "rp-list-header";
	header.textContent = "Parts";
	listPopup.appendChild(header);

	sorted.forEach((ann) => {
		const item = document.createElement("div");
		item.className = "rp-list-item";
		item.dataset.id = ann.id;
		item.style.opacity = "0";
		item.innerHTML = `
			<span class="rp-list-item-badge">${ann.order}</span>
			<span class="rp-list-item-text">
				<span class="rp-list-item-title">${ann.title}</span>
				
			</span>
		`;
		item.addEventListener("click", () => onAnnotationPicked(ann.id));
		listPopup.appendChild(item);

		const entry = { listItem: item };

		if (isTaggable(ann)) {
			const anchorVec = toVector3(ann.anchor);
			const labelVec = toVector3(ann.labelOffset);

			const dotDiv = document.createElement("div");
			dotDiv.className = "rp-annotation-dot";
			dotDiv.title = ann.title;
			dotDiv.style.opacity = "0";
			dotDiv.addEventListener("click", (event) => {
				event.stopPropagation();
				onAnnotationPicked(ann.id);
			});
			const dotObj = new CSS2DObject(dotDiv);
			dotObj.position.copy(anchorVec);
			dotObj.name = `rp-dot-${ann.id}`;
			file3D.add(dotObj);

			const labelDiv = document.createElement("div");
			labelDiv.className = "rp-annotation-label";
			labelDiv.style.opacity = "0";
			labelDiv.innerHTML = `
				<span class="rp-annotation-badge">${ann.order}</span>
				<span class="rp-annotation-name">${ann.title}</span>
			`;
			labelDiv.addEventListener("click", (event) => {
				event.stopPropagation();
				onAnnotationPicked(ann.id);
			});
			const labelObj = new CSS2DObject(labelDiv);
			labelObj.position.copy(labelVec);
			labelObj.center.set(0.5, 1.0);
			labelObj.name = `rp-label-${ann.id}`;
			file3D.add(labelObj);

			const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
			leaderLineSvg.appendChild(line);

			entry.dot = dotObj;
			entry.dotEl = dotDiv;
			entry.label = labelObj;
			entry.labelEl = labelDiv;
			entry.line = line;
			entry.anchor = anchorVec;
			entry.labelOffset = labelVec;
		}

		markerEntries.set(ann.id, entry);
	});
}

function removeAllMarkers() {
	const file3D = getFile3D();
	markerEntries.forEach((entry) => {
		if (entry.dot) file3D.remove(entry.dot);
		if (entry.label) file3D.remove(entry.label);
		if (entry.line) leaderLineSvg.removeChild(entry.line);
	});
	markerEntries.clear();
	listPopup.innerHTML = "";
}

function staggerReveal() {
	const tl = gsap.timeline();
	Array.from(markerEntries.values()).forEach((entry, i) => {
		const delay = i * 0.06;
		if (entry.dotEl) tl.to(entry.dotEl, { opacity: 1, duration: 0.3 }, delay);
		if (entry.labelEl) tl.to(entry.labelEl, { opacity: 1, duration: 0.3 }, delay);
		tl.to(entry.listItem, { opacity: 1, duration: 0.3 }, delay);
	});
	return tl;
}

function staggerHide(onComplete) {
	const tl = gsap.timeline({ onComplete });
	Array.from(markerEntries.values()).forEach((entry, i) => {
		const delay = i * 0.03;
		if (entry.dotEl) tl.to(entry.dotEl, { opacity: 0, duration: 0.2 }, delay);
		if (entry.labelEl) tl.to(entry.labelEl, { opacity: 0, duration: 0.2 }, delay);
		tl.to(entry.listItem, { opacity: 0, duration: 0.2 }, delay);
	});
	return tl;
}

// ------------------------------------------- selection visuals -------------------------------------------

function setActiveStates(id) {
	markerEntries.forEach((entry, key) => {
		const isActive = key === id;
		entry.listItem.classList.toggle("active", isActive);
		if (entry.dotEl) entry.dotEl.classList.toggle("active", isActive);
		if (entry.labelEl) entry.labelEl.classList.toggle("active", isActive);
		if (entry.line) entry.line.classList.toggle("active", isActive);
	});
}

function clearActiveStates() {
	markerEntries.forEach((entry) => {
		entry.listItem.classList.remove("active");
		if (entry.dotEl) entry.dotEl.classList.remove("active");
		if (entry.labelEl) entry.labelEl.classList.remove("active");
		if (entry.line) entry.line.classList.remove("active");
	});
}

function dimOthers(id) {
	markerEntries.forEach((entry, key) => {
		const dim = key !== id;
		entry.listItem.classList.toggle("rp-dim", dim);
		if (entry.dotEl) entry.dotEl.classList.toggle("rp-dim", dim);
		if (entry.labelEl) entry.labelEl.classList.toggle("rp-dim", dim);
		if (entry.line) entry.line.classList.toggle("rp-dim", dim);
	});
}

function restoreDimOthers() {
	markerEntries.forEach((entry) => {
		entry.listItem.classList.remove("rp-dim");
		if (entry.dotEl) entry.dotEl.classList.remove("rp-dim");
		if (entry.labelEl) entry.labelEl.classList.remove("rp-dim");
		if (entry.line) entry.line.classList.remove("rp-dim");
	});
}

// ------------------------------------------- mesh highlight -------------------------------------------

function getGhostMaterial() {
	if (!ghostMaterial) {
		ghostMaterial = new THREE.MeshStandardMaterial({
			color: GHOST_COLOR,
			roughness: 1,
			metalness: 0,
			transparent: GHOST_OPACITY < 1,
			opacity: GHOST_OPACITY,
			depthWrite: true,
		});
	}
	return ghostMaterial;
}

function applyGhost(keep) {
	restoreGhost(); 
	const ghost = getGhostMaterial();
	buildMeshMap().forEach((mesh) => {
		if (keep.has(mesh)) return;
		if (mesh.userData.rpOrigMat === undefined) mesh.userData.rpOrigMat = mesh.material;
		mesh.material = ghost;
		ghostedMeshes.push(mesh);
	});
}

function restoreGhost() {
	ghostedMeshes.forEach((mesh) => {
		if (mesh.userData.rpOrigMat !== undefined) {
			mesh.material = mesh.userData.rpOrigMat;
			delete mesh.userData.rpOrigMat;
		}
	});
	ghostedMeshes.length = 0;
}

function applyMeshHighlight(meshNames) {
	if (!meshNames || meshNames.length === 0) return; 
	const map = buildMeshMap();
	const meshes = [];
	meshNames.forEach((name) => {
		const mesh = map.get(name);
		if (mesh) meshes.push(mesh);
	});
	if (!meshes.length) return;

	applyGhost(new Set(meshes));
	setOutline("highlight", meshes);
}

function restoreMeshHighlight() {
	restoreGhost();
	clearOutline("highlight");
}

// ------------------------------------------- info popup -------------------------------------------

function openInfoPopup(ann) {
	if (infoPopupBadge) infoPopupBadge.textContent = ann.order;
	infoPopupTitle.textContent = ann.title;
	infoPopupTitleEn.textContent = ann.titleEn;
	infoPopupDescription.textContent = (ann.popup && ann.popup.description) || "";
	if (ann.popup && ann.popup.image) {
		infoPopupImage.src = ann.popup.image;
		infoPopupImage.style.display = "block";
	} else {
		infoPopupImage.removeAttribute("src");
		infoPopupImage.style.display = "none";
	}
	infoPopup.classList.add("active");
}

function closeInfoPopup() {
	infoPopup.classList.remove("active");
}

// ------------------------------------------- camera flight -------------------------------------------

function flyCamera(position, target, duration, onComplete) {
	const tl = gsap.timeline({ onComplete });
	tl.to(
		camera.position,
		{ x: position.x, y: position.y, z: position.z, duration, ease: "power2.inOut" },
		0
	);
	tl.to(
		orbitControls.target,
		{ x: target.x, y: target.y, z: target.z, duration, ease: "power2.inOut" },
		0
	);
	return tl;
}

function focusAnnotation(id) {
	const ann = annotationsData.find((a) => a.id === id);
	if (!ann) return;

	if (focusedId && focusedId !== id) {
		restoreMeshHighlight();
		closeInfoPopup();
	}

	focusedId = id;
	setActiveStates(id);
	dimOthers(id);

	orbitControls.enabled = false;
	explodeButton.disabled = true;

	flyCamera(ann.camera.position, ann.camera.target, ann.camera.duration || 1.8, () => {
		if (focusedId !== id) return;
		orbitControls.enabled = true;
		explodeButton.disabled = false;
		applyMeshHighlight(ann.meshNames);
		openInfoPopup(ann);
	});
}

function unfocusAnnotation() {
	if (!focusedId) return;
	focusedId = null;

	restoreMeshHighlight();
	closeInfoPopup();
	clearActiveStates();

	orbitControls.enabled = false;
	explodeButton.disabled = true;

	flyCamera(DEFAULT_VIEW.position, DEFAULT_VIEW.target, 1.5, () => {
		orbitControls.enabled = true;
		explodeButton.disabled = false;
		restoreDimOthers();
	});
}

function onAnnotationPicked(id) {
	if (!activated) return;
	const ann = annotationsData.find((a) => a.id === id);
	if (!ann) return;

	if (ann.standalone) {
		setActiveStates(id);
		openInfoPopup(ann);
		return;
	}

	if (!isFlyable(ann)) {
		console.warn(
			`[recyclingPlant] "${ann.id}" is not tagged yet (missing camera/anchor). Open the site with ?tag=1 to tag it.`
		);
		return;
	}

	if (focusedId === id) return;
	focusAnnotation(id);
}

// ------------------------------------------- activate / deactivate -------------------------------------------

export async function activateRecyclingPlant() {
	if (activated) return;
	await waitForModel();
	buildMeshMap();
	initOutline(); 

	removeAllMarkers();
	createMarkersAndList();

	activated = true;
	listPopup.classList.add("active");
	staggerReveal();
}

export function deactivateRecyclingPlant() {
	if (!activated) return;
	activated = false;

	if (focusedId) {
		focusedId = null;
		restoreMeshHighlight();
		closeInfoPopup();
	}

	staggerHide(() => {
		listPopup.classList.remove("active");
		removeAllMarkers();
	});

	flyCamera(DEFAULT_VIEW.position, DEFAULT_VIEW.target, 1.5);
}
