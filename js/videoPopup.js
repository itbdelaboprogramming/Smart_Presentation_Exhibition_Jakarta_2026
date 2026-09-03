const popup = document.querySelector(".container-full-screen-video");
const frame = document.getElementById("pdf-pop-up-container-video");
const video = document.getElementById("video");

const DEFAULT_SRC = video ? video.getAttribute("src") : "";

export function openVideoPopup(src) {
	if (!popup || !video) return;

	const nextSrc = src || DEFAULT_SRC;
	if (video.getAttribute("src") !== nextSrc) {
		video.pause();
		video.setAttribute("src", nextSrc);
		video.load();
	}
	popup.classList.add("active");
}

export function closeVideoPopup() {
	if (!popup || !video) return;
	popup.classList.remove("active");
	video.pause();
	video.currentTime = 0;
}

if (popup) {
	popup.addEventListener("click", (event) => {
		if (frame && frame.contains(event.target)) return;
		if (popup.classList.contains("active")) closeVideoPopup();
	});
}
