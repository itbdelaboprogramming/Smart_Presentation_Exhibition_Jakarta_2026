import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { scene, camera, renderer, setRenderOverride } from "../script.js";


const CHANNELS = {
	highlight: {
		color: 0x05485a,
		hiddenColor: 0x05485a,
		edgeStrength: 15,
		edgeGlow: 0.0,
		edgeThickness: 3,
		pulsePeriod: 0,
	},
	group: { color: 0x2fbf71, edgeStrength: 3, edgeGlow: 0.3, edgeThickness: 1.5, pulsePeriod: 0 },
	select: { color: 0xffa500, edgeStrength: 6, edgeGlow: 0.8, edgeThickness: 2, pulsePeriod: 0 },
};

let composer = null;
const passes = new Map();

function dim(hex) {
	return new THREE.Color(hex).multiplyScalar(0.35).getHex();
}

export function initOutline() {
	if (composer) return;

	const size = renderer.getSize(new THREE.Vector2());
	composer = new EffectComposer(renderer);
	composer.setPixelRatio(renderer.getPixelRatio());
	composer.setSize(size.x, size.y);
	composer.addPass(new RenderPass(scene, camera));
	composer.addPass(new OutputPass());

	window.addEventListener("resize", () => {
		const s = renderer.getSize(new THREE.Vector2());
		composer.setSize(s.x, s.y);
	});

	setRenderOverride(() => composer.render());
}

function ensurePass(channel) {
	let pass = passes.get(channel);
	if (pass) return pass;

	const cfg = CHANNELS[channel];
	if (!cfg) throw new Error(`[outline] unknown channel "${channel}"`);

	const size = renderer.getSize(new THREE.Vector2());
	pass = new OutlinePass(size, scene, camera);
	pass.visibleEdgeColor.setHex(cfg.color);
	pass.hiddenEdgeColor.setHex(cfg.hiddenColor ?? dim(cfg.color));
	pass.edgeStrength = cfg.edgeStrength;
	pass.edgeGlow = cfg.edgeGlow;
	pass.edgeThickness = cfg.edgeThickness;
	pass.pulsePeriod = cfg.pulsePeriod;

	composer.insertPass(pass, composer.passes.length - 1);
	passes.set(channel, pass);
	return pass;
}

export function setOutline(channel, meshes) {
	if (!composer) initOutline();
	if (!meshes.length && !passes.has(channel)) return;
	ensurePass(channel).selectedObjects = meshes;
}

export function clearOutline(channel) {
	setOutline(channel, []);
}

export function clearAllOutlines() {
	passes.forEach((pass) => (pass.selectedObjects = []));
}
