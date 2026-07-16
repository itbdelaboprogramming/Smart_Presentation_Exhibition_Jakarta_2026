import { scene, camera, orbitControls, loader } from "../script.js";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
	CSS2DRenderer,
	CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

// ---------------------------------------------------------------------------------------
// ----------------------------------- Const, Var, Let -----------------------------------
// ---------------------------------------------------------------------------------------

// ----------------------------------- Explode 3D File -----------------------------------

// const explode_button = document.querySelector(".explode-button");
const explode_button = document.getElementById("explode-button");
let product_list_text = "VSI Gyropactor";
const moved_mesh = [
	"Mirror61",
	"Mirror62",
	"Mirror63",
	"Mirror71",
	"Mirror72",
	"Mirror73",
	"Mirror74",
	"Mirror77",

	"ﾌｨﾚｯﾄ5",
	"ﾌｨﾚｯﾄ11",
	"ﾌｨﾚｯﾄ12",

	"ﾐﾗｰ2_(93)",
	"ﾐﾗｰ3",
	"ﾐﾗｰ51",
	"ﾐﾗｰ52",
	"ﾐﾗｰ141",
	"ﾐﾗｰ142",
	"ﾐﾗｰ143",
	"ﾐﾗｰ144",
	"ﾐﾗｰ145",
	"ﾐﾗｰ201",

	"直線ﾊﾟﾀｰﾝ21",
	"直線ﾊﾟﾀｰﾝ22",
	"直線ﾊﾟﾀｰﾝ23",
	"直線ﾊﾟﾀｰﾝ23_1",
	"直線ﾊﾟﾀｰﾝ31",
	"直線ﾊﾟﾀｰﾝ32",
	"直線ﾊﾟﾀｰﾝ33",
	"直線ﾊﾟﾀｰﾝ51",
	"直線ﾊﾟﾀｰﾝ52",
	"直線ﾊﾟﾀｰﾝ54",
	"直線ﾊﾟﾀｰﾝ241",
	"直線ﾊﾟﾀｰﾝ244",

	"円形ﾊﾟﾀｰﾝ2",
	"円形ﾊﾟﾀｰﾝ2_(49)",
	"円形ﾊﾟﾀｰﾝ3",
	"円形ﾊﾟﾀｰﾝ10",
	"円形ﾊﾟﾀｰﾝ14_(48)",
	"円形ﾊﾟﾀｰﾝ15_(48)",
	"円形ﾊﾟﾀｰﾝ33",
	"円形ﾊﾟﾀｰﾝ52",
	"円形ﾊﾟﾀｰﾝ53",
	"円形ﾊﾟﾀｰﾝ55",
	"円形ﾊﾟﾀｰﾝ56",
	"円形ﾊﾟﾀｰﾝ61",
	"円形ﾊﾟﾀｰﾝ62",
	"円形ﾊﾟﾀｰﾝ81",
	"円形ﾊﾟﾀｰﾝ82",
	"円形ﾊﾟﾀｰﾝ83",
	"円形ﾊﾟﾀｰﾝ102",
	"円形ﾊﾟﾀｰﾝ103",
	"円形ﾊﾟﾀｰﾝ111",
	"円形ﾊﾟﾀｰﾝ112",
	"円形ﾊﾟﾀｰﾝ118",
	"円形ﾊﾟﾀｰﾝ119",

	"押し出し1",
	"押し出し4",
	"押し出し6",
	"押し出し7",
	"押し出し8",
	"押し出し11",

	"回転1_(220)",
	"回転1_(221)",
	"回転21",

	"M6x10_ねじ穴1",

	"M8_丸平ねじ用座ぐり穴1",

	"ﾎﾞｽ_-_押し出し1_(1)",
	"ﾎﾞｽ_-_押し出し1_(2)",
	"ﾎﾞｽ_-_押し出し1_(3)",
	"ﾎﾞｽ_-_押し出し2",
	"ﾎﾞｽ_-_押し出し4",

	"組み合わせ1",
	"組み合わせ1_(2)",
];
const moved_mesh_SR100C_v1 = [
	"¶¯Ä_-_µ_(2)",
	"¶¯Ä_-_µoµ_(20)",
	"¶¯Ä_-_µoµ_(10)",
	"~`ÊßÀ°_(6)",
	"Mirror61",
	"Mirror77",
	"Mirror76",
	"¶¯Ä_-_µoµ_(9)",
	"gÝ_(11)",
	"Ð×°11_(2)",
	"µ_(40)",
	"Mirror41",
	"Mirror75",
	"Mirror64",
	"Mirror62",
	"Mirror63",
	"Mirror74",
	"Extrude5",
	"Ð×°2_(1)",
	"µ_(41)",
	"Mirror73",
	"¶¯Ä_-_µ_(23)",
	"¶¯Ä_-_µ_(22)",
	"¶¯Ä_-_µ_(16)",
	"¶¯Ä_-_µ_(17)",
	"¶¯Ä_-_µ_(18)",
	"¶¯Ä_-_µ_(19)",
	"¶¯Ä_-_µ_(21)",
	"¶¯Ä_-_µ_(20)",
	"µ_(97)",
	"µ_(98)",
	"µ_(96)",
	"µ_(95)",
	"µ_(99)",
	"µ_(100)",
	"µ_(101)",
	"µ_(94)",
	"<APKB024A>-<DrilledHole>_(2)",
	"DrilledHole_(2)",
	"<APKB024A>-<DrilledHole>_(1)",
	"DrilledHole_(1)",
	"<APKB024A>-<DrilledHole>",
	"DrilledHole",
	"<APKB024A>-<DrilledHole>_(3)",
	"DrilledHole_(3)",
	"<APKB024A>-<CoverPattern5>_(2)",
	"CoverPattern4_(2)",
	"<APKB024A>-<CoverPattern4>_(1)",
	"<APKB024A>-<CoverPattern5>_(1)",
	"<APKB024A>-<CoverPattern1>_(2)",
	"CoverPattern3_(2)",
	"<APKB024A>-<CoverPattern3>_(1)",
	"<APKB024A>-<CoverPattern1>",
	"<APKB024A>-<CoverPattern5>",
	"<APKB024A>-<CoverPattern3>_(2)",
	"<APKB024A>-<CoverPattern2>_(2)",
	"<APKB024A>-<CoverPattern5>_(3)",
	"<APKB024A>-<CoverPattern4>_(3)",
	"<APKB024A>-<CoverPattern3>_(3)",
	"<APKB024A>-<CoverPattern2>_(3)",
	"<APKB024A>-<CoverPattern1>_(3)",
	"CoverPattern2_(2)",
	"<APKB024A>-<CoverPattern4>_(2)",
	"CoverPattern4_(3)",
	"CoverPattern1_(2)",
	"CoverPattern5_(2)",
	"CoverPattern5_(3)",
	"CoverPattern1_(3)",
	"CoverPattern3_(3)",
	"CoverPattern2_(3)",
	"<APKB024A>-<CoverPattern1>_(1)",
	"<APKB024A>-<CoverPattern2>_(1)",
	"CoverPattern1_(1)",
	"CoverPattern2_(1)",
	"CoverPattern3_(1)",
	"CoverPattern5_(1)",
	"CoverPattern4_(1)",
	"<APKB024A>-<CoverPattern4>",
	"<APKB024A>-<CoverPattern3>",
	"<APKB024A>-<CoverPattern2>",
	"CoverPattern5",
	"CoverPattern4",
	"CoverPattern1",
	"CoverPattern3",
	"CoverPattern2",
];

// ----------------------------------- dark/light mode -----------------------------------
const toggle = document.querySelector(".toggle");

let getMode = localStorage.getItem("mode");

// -------------------------------------- lightning --------------------------------------
const menuLightning = document.querySelector(".menu-container-blue-lightning");
const lightning_expand = document.querySelector(
	".menu-container-blue-lightning-expand"
);
const lightning_title = document.querySelector(".lightning-title-2");
const opsi = lightning_title.querySelectorAll(".opsi");

const custom_lightning = document.querySelector(".custom-lightning");

const ambientLight = scene.getObjectByName("ambientLight");
const dirLight = scene.getObjectByName("dirLight");
const light1 = scene.getObjectByName("light1");
const light2 = scene.getObjectByName("light2");
const light3 = scene.getObjectByName("light3");
const light4 = scene.getObjectByName("light4");

// -------------------------------- slider env brightness --------------------------------
const slider_env = document.getElementById("slider-env");
const maxValue_env = slider_env.getAttribute("max");
let value_env;
const sliderFill_env = document.getElementById("fill-env");

// --------------------------------- slider lamp position --------------------------------
const slider_lamp_pos = document.getElementById("slider-lamp-pos");
const maxValue_lamp_pos = slider_lamp_pos.getAttribute("max");
let value_lamp_pos;
const sliderFill_lamp_pos = document.getElementById("fill-lamp-pos");

// ------------------------------- slider lamp brightness --------------------------------
const slider_lamp = document.getElementById("slider-lamp");
const maxValue_lamp = slider_lamp.getAttribute("max");
let value_lamp;
const sliderFill_lamp = document.getElementById("fill-lamp");

// -------------------------------------- catalogue --------------------------------------
const menuAlbum = document.querySelector(".menu-container-blue-album");
const catalogueContainer = document.getElementById("catalogue-container-2");
const catalogue_product_list = document.querySelectorAll(
	".catalogue-product-list-2"
);

// ------------------------------------- slider zoom -------------------------------------
const slider = document.getElementById("slider-zoom");
const maxValue = slider.getAttribute("max");
let value;
const sliderFill = document.getElementById("fill-zoom");

// ---------------------------------------- sound ----------------------------------------
const menuSound = document.querySelector(".menu-container-blue-sound");
const iconSoundOff = document.getElementById("sound-off");
const iconSoundOn = document.getElementById("sound-on");

const soundExpand = document.querySelector(".sound-expand");

let change_audio = "model_name_1";
let soundStatus = 0;

var audio = new Audio("./audio/podcast-18169.mp3");
var audio_speech = new Audio("./audio/Play.ht - VSI Gyropactor.wav");
var audio_speech_2 = new Audio(
	"./audio/Play.ht - VSI Gyropactor & Platform.wav"
);
var audio_speech_3 = new Audio("./audio/Play.ht - Full Plant.wav");

var sound = audio_speech;

function musicPlayer() {
	audio.addEventListener("ended", function () {
		// Delay the next call to musicPlayer by 30000 milliseconds
		setTimeout(() => {
			musicPlayer();
		}, 30000);
	});

	audio.play();
}

function audioPlayer() {
	if (change_audio === "model_name_1") {
		sound = audio_speech;
	} else if (change_audio === "model_name_2") {
		sound = audio_speech_2;
	} else if (change_audio === "model_name_3") {
		sound = audio_speech_3;
	}

	if (typeof soundStatus !== "undefined" && soundStatus === 1) {
		sound.addEventListener("ended", function () {
			// Delay the next call to audioPlayer by 30000 milliseconds
			setTimeout(() => {
				audioPlayer();
			}, 30000);
		});
	}

	sound.play();
}

const toggle_music = document.querySelector(".toggle-music");
const toggle_speech = document.querySelector(".toggle-speech");

// -------------------------------------- animation --------------------------------------
const menuAnimation = document.querySelector(".menu-container-blue-animation");
const iconAnimationOff = document.getElementById("animation-off");
const iconAnimationOn = document.getElementById("animation-on");

// ------------------------------------- information -------------------------------------
const menuInformation = document.querySelector(
	".menu-container-blue-information"
);
const informationContainer = document.getElementById("information-container");

// ------------------------------------- video button ------------------------------------
const video_button = document.querySelector(".menu-video");
const video_pop_up = document.querySelector(".container-full-screen-video");
const video = document.getElementById("video");

// ---------------------------------------------------------------------------------------
// ------------------------------------- PROGRAM CODE ------------------------------------
// ---------------------------------------------------------------------------------------

// ----------------------------------- Explode 3D File -----------------------------------
explode_button.addEventListener("click", () => {
	explode_button.classList.toggle("active");

	let file3D = scene.getObjectByName("file3D");

	if (product_list_text == "VSI Gyropactor") {
		// SR100C_v1(obj);
		SR100C_v1(file3D);
	} else if (product_list_text == "VSI Gyropactor & Platform") {
		// SRユニット_v1(obj);
		SRユニット_v1(file3D);
	} else if (product_list_text == "Sand Manufacturing Plant") {
		SandManufacturingPlant(file3D);
	}
});

// ----------------------------------- dark/light mode -----------------------------------
if (getMode && getMode === "dark-theme") {
	document.body.classList.add("dark-theme");
	toggle.classList.add("active");

	scene.background = new THREE.Color(0x1d2538);

	scene.remove(scene.getObjectByName("grid"));

	const grid = new THREE.GridHelper(50, 50, 0x475b74, 0x475b74);
	grid.position.y = -1;
	grid.name = "grid";
	scene.add(grid);

	localStorage.setItem("mode", "dark-theme");
}

toggle.addEventListener("click", () => toggle.classList.toggle("active"));

toggle.addEventListener("click", () => {
	document.body.classList.toggle("dark-theme");

	if (document.body.classList.contains("dark-theme")) {
		scene.background = new THREE.Color(0x1d2538);

		scene.remove(scene.getObjectByName("grid"));

		const grid = new THREE.GridHelper(50, 50, 0x475b74, 0x475b74);
		grid.position.y = -1;
		grid.name = "grid";
		scene.add(grid);

		localStorage.setItem("mode", "dark-theme");
	} else {
		scene.background = new THREE.Color(0xdbe9e9);

		scene.remove(scene.getObjectByName("grid"));
		const grid = new THREE.GridHelper(50, 50, 0xffffff, 0xffffff);
		grid.position.y = -1;
		grid.name = "grid";
		scene.add(grid);

		localStorage.setItem("mode", "light");
	}
});

// -------------------------------------- lightning --------------------------------------
menuLightning.addEventListener("click", () => {
	menuLightning.classList.toggle("active");

	if (menuLightning.classList.contains("active")) {
		lightning_expand.style.display = "block";
	} else {
		lightning_expand.style.display = "none";
	}
});

opsi.forEach(function (opsi) {
	opsi.addEventListener("click", () => {
		resetOpsi();
		opsi.classList.toggle("active");

		if (opsi.classList.contains("active")) {
			let opsi_text = opsi.innerText;
			updateLightning(opsi_text);
		}
	});
});

window.addEventListener("resize", () => {
	if (custom_lightning.style.display == "flex") {
		if (window.innerWidth < 900) {
			lightning_expand.style.height = "230px";
		} else {
			lightning_expand.style.height = "190px";
		}
	}
});

// -------------------------------- slider env brightness --------------------------------
updateSliderEnv();
slider_env.addEventListener("input", () => {
	updateSliderEnv();
	updateEnvBrightness();
});

// --------------------------------- slider lamp position --------------------------------
updateSliderLampPos();
slider_lamp_pos.addEventListener("input", () => {
	updateSliderLampPos();
	updateLampPos();
});

// ------------------------------- slider lamp brightness --------------------------------
updateSliderLamp();
slider_lamp.addEventListener("input", () => {
	updateSliderLamp();
	updateLamp();
});

// -------------------------------------- catalogue --------------------------------------
menuAlbum.addEventListener("click", () => {
	menuAlbum.classList.toggle("active");

	if (menuAlbum.classList.contains("active")) {
		catalogueContainer.style.display = "flex";
	} else {
		catalogueContainer.style.display = "none";
	}
});

loadCatalogue(catalogue_product_list);

// ------------------------------------- slider zoom -------------------------------------
updateSlider();
updateZoomCamera();
slider.addEventListener("input", () => {
	updateSlider();
	updateZoomCamera();
});

// ---------------------------------------- sound ----------------------------------------
menuSound.addEventListener("click", () => {
	menuSound.classList.toggle("active");

	if (menuSound.classList.contains("active")) {
		iconSoundOff.style.display = "none";
		iconSoundOn.style.display = "block";
		soundExpand.style.display = "flex";
	} else {
		iconSoundOff.style.display = "block";
		iconSoundOn.style.display = "none";
		soundExpand.style.display = "none";
	}
});

toggle_music.addEventListener("click", () => {
	toggle_music.classList.toggle("active");

	if (toggle_music.classList.contains("active")) {
		musicPlayer();
	} else {
		audio.pause();
	}
});

toggle_speech.addEventListener("click", () => {
	toggle_speech.classList.toggle("active");

	if (change_audio === "model_name_1") {
		sound = audio_speech;
	} else if (change_audio === "model_name_2") {
		sound = audio_speech_2;
	} else if (change_audio === "model_name_3") {
		sound = audio_speech_3;
	}

	if (toggle_speech.classList.contains("active")) {
		soundStatus = 1;
		audioPlayer();
	} else {
		soundStatus = 0;
		sound.pause();
		sound.currentTime = 0;
	}
});

// -------------------------------------- animation --------------------------------------
menuAnimation.addEventListener("click", () => {
	menuAnimation.classList.toggle("active");

	if (menuAnimation.classList.contains("active")) {
		iconAnimationOff.style.display = "none";
		iconAnimationOn.style.display = "block";
		orbitControls.autoRotate = true;
	} else {
		iconAnimationOff.style.display = "block";
		iconAnimationOn.style.display = "none";
		orbitControls.autoRotate = false;
	}
});

// ------------------------------------- information -------------------------------------
menuInformation.addEventListener("click", () => {
	menuInformation.classList.toggle("active");

	if (menuInformation.classList.contains("active")) {
		informationContainer.style.display = "flex";
	} else {
		informationContainer.style.display = "none";
	}
});

// ------------------------------------- video button ------------------------------------
video_button.addEventListener("click", () => {
	video_pop_up.classList.toggle("active");
});

video_pop_up.addEventListener("click", function (e) {
	if (
		!document.getElementById("pdf-pop-up-container-video").contains(e.target)
	) {
		if (video_pop_up.classList.contains("active")) {
			video_pop_up.classList.remove("active");
			video.pause();
			video.currentTime = 0;
		}
	}
});

// ---------------------------------------------------------------------------------------
// ---------------------------------- FUNCTION HELPER ------------------------------------
// ---------------------------------------------------------------------------------------

// ----------------------------------- Explode 3D File -----------------------------------

// Function to create an annotation
function createAnnotation(obj, content, position, label) {
	const annotationDiv = document.createElement("div");
	annotationDiv.id = "annotationDiv";

	annotationDiv.textContent = content;
	annotationDiv.style.backgroundColor = "#74E7D4";
	annotationDiv.style.fontFamily = "Ubuntu";
	annotationDiv.style.borderRadius = "5px";
	annotationDiv.style.padding = "4px";

	const annotation = new CSS2DObject(annotationDiv);
	annotation.name = label;
	annotation.position.copy(position);
	annotation.center.set(0, 1, 0);
	obj.add(annotation);
}

function createAnnotation2(img, position, scaleX, scaleY, scaleZ, label) {
	let path = "files/SRユニット_v1/" + img;
	const map = new THREE.TextureLoader().load(path);
	const material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });

	var sprite = new THREE.Sprite(material);
	sprite.name = label;
	sprite.scale.set(scaleX, scaleY, scaleZ);
	sprite.position.copy(position);
	scene.add(sprite);
}

// Function to remove an annotation
function removeAnnotation(obj, label) {
	const annotation = obj.getObjectByName(label);
	if (annotation != null) {
		obj.remove(annotation);
	}
}

// Function to reset the state of the 3D model and annotations
function resetModelAndAnnotations(obj) {
	// explode_button.classList.contains("active");
	explode_button.classList.remove("active");

	removeAnnotation(obj, "A");
	removeAnnotation(obj, "B");
	removeAnnotation(obj, "C");
	removeAnnotation(obj, "D");
	removeAnnotation(obj, "E");
	removeAnnotation(obj, "F");
	removeAnnotation(obj, "G");
	removeAnnotation(obj, "H");
	removeAnnotation(obj, "I");
	removeAnnotation(obj, "J");
	removeAnnotation(obj, "K");

	// removeAnnotation(scene, "A");
	// removeAnnotation(scene, "B");
	// removeAnnotation(scene, "C");
	// removeAnnotation(scene, "D");
	// removeAnnotation(scene, "E");
}

function SR100C_v1(obj) {
	let object_children = obj.children;

	if (explode_button.classList.contains("active")) {
		object_children.forEach((child) => {
			if (moved_mesh.includes(child.name)) {
				child.visible = false;
			}
		});

		// SR100 Annotation
		createAnnotation(obj, "Upper Casing", new THREE.Vector3(-0.6, 2.2, 0), "A");
		createAnnotation(
			obj,
			"Material Feed",
			new THREE.Vector3(-0.3, 2.5, 0),
			"B"
		);
		createAnnotation(
			obj,
			"Hydraulic Casing Opener",
			new THREE.Vector3(0.6, 2.2, 0),
			"C"
		);
		createAnnotation(obj, "Guide Flange", new THREE.Vector3(-0.3, 1.5, 0), "D");
		createAnnotation(
			obj,
			"Air Circulation",
			new THREE.Vector3(0.1, 1.75, 0.75),
			"E"
		);
		createAnnotation(
			obj,
			"Upper Frame",
			new THREE.Vector3(0.6, 1.5, 0.75),
			"F"
		);
		createAnnotation(
			obj,
			"Crushing Chamber",
			new THREE.Vector3(0.1, 1, 0.75),
			"G"
		);
		createAnnotation(obj, "Rotor", new THREE.Vector3(-0.1, 1, 0), "H");
		createAnnotation(
			obj,
			"Vertical Shaft",
			new THREE.Vector3(-0.25, 0.5, 0),
			"I"
		);
		createAnnotation(obj, "Pulley", new THREE.Vector3(-0.1, -0.1, 0), "J");
		createAnnotation(
			obj,
			"Shaped Material",
			new THREE.Vector3(-0.1, -0.1, 0.75),
			"K"
		);

		gsap.to(camera.position, {
			duration: 2,
			x: -3.5,
		});
		gsap.to(camera.position, {
			duration: 2,
			y: 2,
		});
		gsap.to(camera.position, {
			duration: 1,
			z: 2.8,
		});

		document.getElementById("explode-button").disabled = true;
		orbitControls.enabled = false;
		setTimeout(function () {
			document.getElementById("explode-button").disabled = false;
			orbitControls.enabled = true;
		}, 2500);
	} else {
		object_children.forEach((child) => {
			if (moved_mesh.includes(child.name)) {
				child.visible = true;
			}
		});

		// SR100 Annotation
		resetModelAndAnnotations(obj);

		gsap.to(camera.position, {
			duration: 2.8,
			x: 6,
		});
		gsap.to(camera.position, {
			duration: 2.5,
			y: 4,
		});
		gsap.to(camera.position, {
			duration: 1,
			z: -4,
		});
		document.getElementById("explode-button").disabled = true;
		orbitControls.enabled = false;
		setTimeout(function () {
			document.getElementById("explode-button").disabled = false;
			orbitControls.enabled = true;
		}, 2500);
	}
}

function SRユニット_v1(obj) {
	let object_children = obj.children;

	if (explode_button.classList.contains("active")) {
		object_children.forEach((child) => {
			if (moved_mesh_SR100C_v1.includes(child.name)) {
				let new_pos = child.position.y + 2;
				gsap.to(child.position, {
					duration: 1,
					y: new_pos,
				});
			}
		});
		// createAnnotation2("Belt.png",new THREE.Vector3(0.2, 0.2, 1.4), 0.4, 0.14, 1, "A");
		createAnnotation(obj, "Belt", new THREE.Vector3(-0.5, 0.2, 0.1), "A");
		// createAnnotation2("Motor.png", new THREE.Vector3(-0.8, 2, 0.4), 0.4, 0.14, 1, "B");
		createAnnotation(obj, "Motor", new THREE.Vector3(-0.9, 2.9, 0.2), "B");
		// createAnnotation2("Motor_casing.png", new THREE.Vector3(-0.8, 2.8, 0.7), 0.4, 0.14, 1, "C");
		createAnnotation(
			obj,
			"Motor Casing",
			new THREE.Vector3(-0.9, 3.7, 0.2),
			"C"
		);
		// createAnnotation2("Platform.png", new THREE.Vector3(3, 0.1, 1.3), 0.4, 0.14, 1, "D");
		createAnnotation(obj, "Platform", new THREE.Vector3(2.9, 1, 1.2), "D");
		// createAnnotation2("vsi.png", new THREE.Vector3(1.2, 0.9, 1.3), 0.46, 0.21, 1, "E" );
		createAnnotation(
			obj,
			"VSI SR100 Gyropactor",
			new THREE.Vector3(1.2, 1.8, 1.2),
			"E"
		);
		gsap.to(camera.position, {
			duration: 1.2,
			x: -1.9,
		});
		gsap.to(camera.position, {
			duration: 1,
			y: 2.2,
		});
		gsap.to(camera.position, {
			duration: 1.3,
			z: 3.7,
		});
		document.getElementById("explode-button").disabled = true;
		orbitControls.enabled = false;
		setTimeout(function () {
			document.getElementById("explode-button").disabled = false;
			orbitControls.enabled = true;
		}, 1500);
	} else {
		object_children.forEach((child) => {
			if (moved_mesh_SR100C_v1.includes(child.name)) {
				let new_pos = child.position.y - 2;
				gsap.to(child.position, {
					duration: 1,
					y: new_pos,
				});
			}
		});
		// resetModelAndAnnotations(scene);
		resetModelAndAnnotations(obj);
		gsap.to(camera.position, {
			duration: 1.1,
			x: 6,
		});
		gsap.to(camera.position, {
			duration: 1.4,
			y: 4,
		});
		gsap.to(camera.position, {
			duration: 1,
			z: -4,
		});
		document.getElementById("explode-button").disabled = true;
		orbitControls.enabled = false;
		setTimeout(function () {
			document.getElementById("explode-button").disabled = false;
			orbitControls.enabled = true;
		}, 1500);
	}
	// let object_children = obj.children;
	// if (explode_button.classList.contains("active")) {
	// 	obj.forEach((child) => {
	// 		// Check if the child's name is in the list of objects to hide
	// 		if (moved_mesh.includes(child.name)) {
	// 			// Hide the child object
	// 			child.visible = false;
	// 		} else {
	// 			let target = new THREE.Vector3();
	// 			child.getWorldPosition(target);
	// 			target.normalize();
	// 			target.setX(target.x * 1 + child.position.x);
	// 			target.setY(target.y * 1 + child.position.y);
	// 			target.setZ(target.z * 1 + child.position.z);
	// 			gsap.to(child.position, {
	// 				duration: 1,
	// 				x: target.x,
	// 			});
	// 			gsap.to(child.position, {
	// 				duration: 1,
	// 				y: target.y,
	// 			});
	// 			gsap.to(child.position, {
	// 				duration: 1,
	// 				z: target.z,
	// 			});
	// 		}
	// 	});
	// } else {
	// 	obj.forEach((child) => {
	// 		// Toggle visibility for child objects
	// 		if (moved_mesh.includes(child.name)) {
	// 			// Show the child object
	// 			child.visible = true;
	// 		} else {
	// 			let target = new THREE.Vector3();
	// 			child.getWorldPosition(target);
	// 			target.normalize();
	// 			target.setX(child.position.x - target.x * 1);
	// 			target.setY(child.position.y - target.y * 1);
	// 			target.setZ(child.position.z - target.z * 1);
	// 			gsap.to(child.position, {
	// 				duration: 1,
	// 				x: target.x,
	// 			});
	// 			gsap.to(child.position, {
	// 				duration: 1,
	// 				y: target.y,
	// 			});
	// 			gsap.to(child.position, {
	// 				duration: 1,
	// 				z: target.z,
	// 			});
	// 		}
	// 	});
	// }
}
function SandManufacturingPlant(obj) {
	if (explode_button.classList.contains("active")) {
		gsap.to(camera.position, {
			duration: 2,
			x: -8,
		});
		gsap.to(camera.position, {
			duration: 2,
			y: 5,
		});
		gsap.to(camera.position, {
			duration: 1,
			z: 11,
		});
		createAnnotation(
			obj,
			"Vibrating Screen",
			new THREE.Vector3(-6, 6.8, -0.6),
			"A"
		);
		createAnnotation(obj, "Cone Crusher", new THREE.Vector3(-0.5, 3, -0), "B");
		createAnnotation(obj, "Surge Bin", new THREE.Vector3(4, 8, 0), "C");
		createAnnotation(
			obj,
			"Vertical Shaft Impact (VSI) Crusher",
			new THREE.Vector3(-1, 5, 19),
			"D"
		);
		createAnnotation(obj, "Vibro Feeder", new THREE.Vector3(1, 4.5, 0), "E");
		createAnnotation(
			obj,
			"Primary Jaw Crusher",
			new THREE.Vector3(20, 7, -7),
			"F"
		);
		createAnnotation(obj, "Stockpile 1", new THREE.Vector3(-2, 8, -22), "G");
		createAnnotation(obj, "Stockpile 2", new THREE.Vector3(-17, 8, -1), "H");
		createAnnotation(obj, "Stockpile 3", new THREE.Vector3(-8.5, 6, 12), "I");

		orbitControls.target.set(-1, 3, 19);
		document.getElementById("explode-button").disabled = true;
		orbitControls.enabled = false;
		setTimeout(function () {
			document.getElementById("explode-button").disabled = false;
			orbitControls.enabled = true;
		}, 2500);
	} else {
		gsap.to(camera.position, {
			duration: 1,
			x: -19,
		});
		gsap.to(camera.position, {
			duration: 2.5,
			y: 12,
		});
		gsap.to(camera.position, {
			duration: 1,
			z: -17,
		});
		resetModelAndAnnotations(obj);
		orbitControls.target.set(0, 0, 0);
		document.getElementById("explode-button").disabled = true;
		orbitControls.enabled = false;
		setTimeout(function () {
			document.getElementById("explode-button").disabled = false;
			orbitControls.enabled = true;
		}, 2500);
	}
}

// -------------------------------------- lightning --------------------------------------
function resetOpsi() {
	opsi.forEach(function (opsi) {
		opsi.classList.remove("active");
	});
}

function updateLightning(opsi_text) {
	if (opsi_text === "custom") {
		custom_lightning.style.display = "flex";

		if (window.innerWidth < 900) {
			lightning_expand.style.height = "230px";
		}

		ambientLight.intensity = 0.5;
		dirLight.intensity = 20;

		light1.intensity = 0;
		light2.intensity = 0;
		light3.intensity = 0;
		light4.intensity = 0;

		slider_env.value = 0.5;
		updateSliderEnv();
		updateEnvBrightness();
		slider_lamp.value = 20;
		updateSliderLamp();
		updateLamp();
		slider_lamp_pos.value = 210;
		updateSliderLampPos();
		updateLampPos();
	} else {
		custom_lightning.style.display = "none";
		lightning_expand.style.height = "190px";

		ambientLight.intensity = 0;
		dirLight.intensity = 0;

		light1.intensity = 1;
		light2.intensity = 1;
		light3.intensity = 1;
		light4.intensity = 1;
	}
}

// -------------------------------- slider env brightness --------------------------------
function updateSliderEnv() {
	value_env = (slider_env.value / maxValue_env) * 100 + "%";
	sliderFill_env.style.width = value_env;
}

function updateEnvBrightness() {
	let ambient = scene.getObjectByName("ambientLight");
	ambient.intensity = slider_env.value;
}

// --------------------------------- slider lamp position --------------------------------
function updateSliderLampPos() {
	value_lamp_pos = (slider_lamp_pos.value / maxValue_lamp_pos) * 100 + "%";
	sliderFill_lamp_pos.style.width = value_lamp_pos;
}

function updateLampPos() {
	let lamp = scene.getObjectByName("dirLight");
	lamp.position.set(100, 100, -(slider_lamp_pos.value - 200));
}

// ------------------------------- slider lamp brightness --------------------------------
function updateSliderLamp() {
	value_lamp = (slider_lamp.value / maxValue_lamp) * 100 + "%";
	sliderFill_lamp.style.width = value_lamp;
}

function updateLamp() {
	let lamp = scene.getObjectByName("dirLight");
	lamp.intensity = slider_lamp.value;
}

// -------------------------------------- catalogue --------------------------------------

// Inside the loadCatalogue function
function loadCatalogue(catalogue_product_list) {
	catalogue_product_list.forEach(function (product_list) {
		product_list.addEventListener("click", () => {
			if (product_list.id != change_audio) {
				change_audio = product_list.id;
				sound.pause();
				sound.currentTime = 0;
				toggle_speech.classList.contains("active") ? audioPlayer() : "";
			}

			resetCatalogueSelect();

			// product_list.classList.toggle("active");
			product_list.classList.add("active"); // Add the "active" class here

			product_list_text = product_list.querySelector(
				".catalogue-product-list-text-2"
			).innerText;

			// Find the current 3D model object
			let file3D = scene.getObjectByName("file3D");

			// Reset the model and annotations for the current 3D model
			resetModelAndAnnotations(file3D);

			updateFile3D(product_list_text);
		});
	});
}

function resetCatalogueSelect() {
	catalogue_product_list.forEach(function (product_list) {
		product_list.classList.remove("active");
	});
}

function updateFile3D(file_name) {
	try {
		let file3D = scene.getObjectByName("file3D");
		file3D.name = "file3D";

		scene.remove(file3D);
		let newFile3D;
		if (file_name == "Sand Manufacturing Plant") {
			newFile3D = `files/Full_Plant_NIW_2.glb`;
		} else {
			newFile3D = `files/${file_name}.glb`;
		}

		if (product_list_text == "Sand Manufacturing Plant") {
			camera.position.set(-19, 12, -17);
			// camera.position.set(-9, 8, 19);
			// camera.position.set(-1, 3, 17);
			// orbitControls.target.set(-1, 3, 17);
			orbitControls.target.set(0, 0, 0);
		} else {
			camera.position.set(6, 4, -4);
			orbitControls.target.set(0, 0, 0);
		}

		loader.load(
			newFile3D,
			function (gltf) {
				file3D = gltf.scene;
				file3D.name = "file3D";
				scene.add(file3D);
				file3D.position.set(0, -0.95, 0);
			},
			undefined,
			function (error) {
				console.error(error);
			}
		);
	} catch (e) {
		// do nothing
	}
}

// ------------------------------------- slider zoom -------------------------------------
function updateZoomCamera() {
	camera.zoom = slider.value;
	camera.updateProjectionMatrix();
}

function updateSlider() {
	value = (slider.value / maxValue) * 100 + "%";
	sliderFill.style.width = value;
}

// pdf button
const pdf_button = document.querySelector(".menu-pdf");
const pdf_pop_up = document.querySelector(".container-full-screen-pdf");

pdf_button.addEventListener("click", () => {
	const annotationDivs = document.querySelectorAll("#annotationDiv");

	if (annotationDivs) {
		annotationDivs.forEach((div) => {
			div.style.display = "none";
		});
	}
	pdf_pop_up.classList.toggle("active");
});

pdf_pop_up.addEventListener("click", function (e) {
	if (!document.getElementById("pdf-pop-up-container").contains(e.target)) {
		if (pdf_pop_up.classList.contains("active")) {
			pdf_pop_up.classList.remove("active");
		}
	}
});
