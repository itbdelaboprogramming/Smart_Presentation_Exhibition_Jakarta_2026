const myCanvas = document.querySelector("#myCanvas");
// var myText = document.getElementById("myText").textContent;

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import {
	CSS2DRenderer,
	CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

// ----------------------------------- SCENE BACKGROUND COLOR -----------------------------------
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdbe9e9);

// ------------------------------------------- CAMERA -------------------------------------------
export const camera = new THREE.PerspectiveCamera(
	60,
	myCanvas.offsetWidth / myCanvas.offsetHeight
);
camera.position.set(6, 4, -4);
camera.layers.enableAll();

// ----------------------------------------- GRID HELPER ----------------------------------------
const size = 50;
const divisions = 50;
const colorCenterLine = 0xffffff;
const colorGrid = 0xffffff;

const grid = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
grid.position.y = -1;
grid.name = "grid";
scene.add(grid);

// ------------------------------------------ LIGHTNING -----------------------------------------
/*
	Light in 3D scene
	set(x,y,z)
		+x front
		+y up
		+z left
*/

// ---------------------------------- LIGHTNING CUSTOM: AMBIENT ---------------------------------
const ambientLight = new THREE.HemisphereLight(
	"white", // bright sky color
	"grey", // dim ground color
	0 // intensity
);
ambientLight.name = "ambientLight";
scene.add(ambientLight);

// -------------------------------- LIGHTNING CUSTOM: DIRECTIONAL -------------------------------
var dirLight = new THREE.DirectionalLight(0x404040, 0);
dirLight.name = "dirLight";
dirLight.position.set(100, 100, -10);
dirLight.castShadow = true;
scene.add(dirLight);

// --------------------------- LIGHTNING DEFAULT: FRONT ABOVE CENTER ----------------------------
const r = 20;
const light1 = new THREE.PointLight(0xffffff, 1, 0);
light1.name = "light1";
light1.position.set(r, r, 0);
light1.shadowMapVisible = true;
scene.add(light1);

// ----------------------------- LIGHTNING DEFAULT: BACK ABOVE LEFT -----------------------------
const light2 = new THREE.PointLight(0xffffff, 1, 0);
light2.name = "light2";
light2.position.set(-0.5 * r, r, 0.866 * r);
scene.add(light2);

// ---------------------------- LIGHTNING DEFAULT: BACK ABOVE RIGHT -----------------------------
const light3 = new THREE.PointLight(0xffffff, 1, 0);
light3.name = "light3";
light3.position.set(-0.5 * r, r, -0.866 * r);
scene.add(light3);

// --------------------------- LIGHTNING DEFAULT: CENTER BELOW CENTER ---------------------------
const light4 = new THREE.PointLight(0xffffff, 1, 0);
light4.name = "light4";
light4.position.set(0, -r, 0);
scene.add(light4);

// --------------------------- LIGHTNING DEFAULT: CENTER BELOW CENTER ---------------------------
const renderer = new THREE.WebGLRenderer({ canvas: myCanvas });
renderer.setClearColor(0xff0000, 1.0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(myCanvas.offsetWidth, myCanvas.offsetHeight);

// --------------------------------------- ORBIT CONTROLS ---------------------------------------
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.zIndex = 1;
labelRenderer.domElement.style.top = "0px";
document.body.appendChild(labelRenderer.domElement);

export const orbitControls = new OrbitControls(
	camera,
	labelRenderer.domElement
);

// --------------------------------------- 3D FILE LOADER ---------------------------------------
const loadingScreenBar = document.getElementById("loadingBar");
const loadingScreenContainer = document.querySelector(
	".loadingScreenContainer"
);
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = function () {
	loadingScreenContainer.style.display = "flex";
};

loadingManager.onProgress = function (url, loaded, total) {
	loadingScreenBar.value = (loaded / total) * 100;
};

loadingManager.onLoad = function () {
	loadingScreenBar.value = 0;
	loadingScreenContainer.style.display = "none";
};

export const loader = new GLTFLoader(loadingManager);
loader.name = "loader";

let path = "files/" + "VSI Gyropactor.glb";

loader.load(
	path,
	function (gltf) {
		let file3D = gltf.scene;
		file3D.name = "file3D";
		scene.add(file3D);
		file3D.layers.enableAll();

		file3D.position.set(0, -0.95, 0);
	},
	undefined,
	function (error) {
		console.error(error);
	}
);

// const map = new THREE.TextureLoader().load("files/SR100C_V1/Belt.png");
// const material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });
// var sprite = new THREE.Sprite(material);
// sprite.scale.set(0.35, 0.1, 1);
// sprite.position.set(-0.8, 0.8, -1);
// scene.add(sprite);

// var spritey = makeTextSprite(" Held00 ");
// spritey.position.set(0.8, 0.8, -1);
// scene.add(spritey);

// function makeTextSprite(message) {
// 	var canvas = document.createElement("canvas");
// 	var context = canvas.getContext("2d");

// 	var fontface = "Inter";
// 	var fontsize = 15;
// 	var borderThickness = 0;

// 	// canvas.style.backgroundColor = "blue";

// 	context.font = "bolder " + fontsize + "px " + fontface;
// 	var metrics = context.measureText(message);
// 	console.log(metrics);

// 	context.fillStyle = "rgba(116,231,212,1.0";
// 	context.fillRect(0, 0, metrics.width, 25);
// 	context.strokeStyle = "rgba(0,0,0,1.0)";
// 	context.fillStyle = "rgba(0,0,0,1.0)";

// 	context.font = "Bold " + fontsize + "px " + fontface;
// 	context.fillText(message, borderThickness, fontsize + borderThickness);

// 	var texture = new THREE.Texture(canvas);
// 	texture.needsUpdate = true;
// 	var spriteMaterial = new THREE.SpriteMaterial({
// 		map: texture,
// 		useScreenCoordinates: false,
// 	});

// 	var sprite = new THREE.Sprite(spriteMaterial);
// 	return sprite;
// }

// ----------------------------------------- RENDER LOOP ----------------------------------------
renderer.setAnimationLoop(() => {
	orbitControls.update();
	labelRenderer.render(scene, camera);
	renderer.render(scene, camera);
});

// ---------------------------------------- RESIZE CANVAS ---------------------------------------
myCanvas.style.width = window.innerWidth + "px";
myCanvas.style.height = window.innerHeight + "px";
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

window.addEventListener("resize", () => {
	myCanvas.style.width = window.innerWidth + "px";
	myCanvas.style.height = window.innerHeight + "px";
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	labelRenderer.setSize(window.innerWidth - 0.5, window.innerHeight - 0.5);
});
