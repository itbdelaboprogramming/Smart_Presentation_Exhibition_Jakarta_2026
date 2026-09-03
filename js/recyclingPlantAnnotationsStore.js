import seedAnnotations, { DEFAULT_VIEW } from "./recyclingPlantAnnotations.js";

const STORAGE_KEY = "rpAnnotationsTagProgress";

export const isTagMode = new URLSearchParams(window.location.search).has("tag");

function cloneSeed() {
	return JSON.parse(JSON.stringify(seedAnnotations));
}

function loadInitial() {
	if (isTagMode) {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) return JSON.parse(raw);
		} catch (e) {}
	}
	return cloneSeed();
}

export let annotations = loadInitial();

export function saveProgress() {
	if (!isTagMode) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
}

export function resetToSeed() {
	if (isTagMode) localStorage.removeItem(STORAGE_KEY);
	annotations = cloneSeed();
}

export { DEFAULT_VIEW };
