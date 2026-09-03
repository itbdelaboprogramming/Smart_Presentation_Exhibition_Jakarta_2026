const BASE_PATH = "./audio/voiceover/";

const VOICE_OVER_FILES = {
	overall: `${BASE_PATH}overall.wav`,
	1: `${BASE_PATH}annotation-1.wav`,
	2: `${BASE_PATH}annotation-2.wav`,
	3: `${BASE_PATH}annotation-3.wav`,
	4: `${BASE_PATH}annotation-4.wav`,
	5: `${BASE_PATH}annotation-5.wav`,
	6: `${BASE_PATH}annotation-6.wav`,
	7: `${BASE_PATH}annotation-7.wav`,
};

const OVERALL_KEY = "overall";
const REPLAY_DELAY_MS = 30000;

// ?vodebug=1 
const DEBUG = new URLSearchParams(window.location.search).has("vodebug");

function debugLog(action, key) {
	if (!DEBUG) return;
	console.log(`[voiceOver] ${action} — ${key} (${VOICE_OVER_FILES[key]})`);
}

// ------------------------------------------- state -------------------------------------------

const players = new Map(); 
let enabled = false;
let currentKey = OVERALL_KEY;
let replayTimer = null;

function normalizeKey(key) {
	if (key === null || key === undefined || key === "") return OVERALL_KEY;
	const asString = String(key);
	return VOICE_OVER_FILES[asString] ? asString : OVERALL_KEY;
}

function getPlayer(key) {
	if (!players.has(key)) {
		const player = new Audio(VOICE_OVER_FILES[key]);
		player.preload = "none";
		players.set(key, player);
	}
	return players.get(key);
}

function seekToStart(player) {
	if (player.currentTime === 0) return;
	try {
		player.currentTime = 0;
	} catch (e) {}
}

function clearReplayTimer() {
	if (replayTimer === null) return;
	clearTimeout(replayTimer);
	replayTimer = null;
}

function stopPlayer(key) {
	const player = players.get(key);
	if (!player) return;
	player.onended = null;
	if (!player.paused) debugLog("STOP", key);
	player.pause();
	seekToStart(player);
}

function playCurrent() {
	if (!enabled) return;

	const key = currentKey;
	const player = getPlayer(key);

	seekToStart(player);
	player.onended = () => {
		clearReplayTimer();
		replayTimer = setTimeout(() => {
			replayTimer = null;
			if (!enabled || currentKey !== key) return;
			playCurrent();
		}, REPLAY_DELAY_MS);
	};

	debugLog("PLAY", key);
	const started = player.play();
	if (started && typeof started.catch === "function") started.catch(() => {});
}

// ------------------------------------------- API publik -------------------------------------------

export function setVoiceOverEnabled(value) {
	const next = Boolean(value);
	if (next === enabled) return;
	enabled = next;
	debugLog(enabled ? "VO ON" : "VO OFF", currentKey);

	clearReplayTimer();
	if (enabled) {
		playCurrent();
	} else {
		stopPlayer(currentKey);
	}
}

export function isVoiceOverEnabled() {
	return enabled;
}

export function setVoiceOverContext(annotationId) {
	const nextKey = normalizeKey(annotationId);
	if (nextKey === currentKey) return;

	clearReplayTimer();
	stopPlayer(currentKey);
	currentKey = nextKey;
	debugLog(enabled ? "KONTEKS" : "KONTEKS", currentKey);
	playCurrent();
}

export function getVoiceOverState() {
	return { enabled, currentKey, file: VOICE_OVER_FILES[currentKey] };
}

if (DEBUG) {
	window.voiceOver = { state: getVoiceOverState, files: VOICE_OVER_FILES };
}
