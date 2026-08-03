// block types for info popup:
//   { type: "heading", value: "Judul sub-bagian" }
//   { type: "text",    value: "Satu paragraf." }
//   { type: "list",    items: ["butir 1", "butir 2"], ordered: true }
//   { type: "image",   src: "./files/x.png", caption: "...", alt: "..." }
//   { type: "video",   src: "./files/x.mp4", label: "Watch Video" }


import { openVideoPopup } from "./videoPopup.js";

const DEFAULT_VIDEO_LABEL = "Watch Video";

function stripHtml(value) {
	return String(value).replace(/<[^>]*>/g, "");
}

function renderHeading(block) {
	if (!block.value) return null;
	const heading = document.createElement("div");
	heading.className = "rp-info-popup-heading";
	heading.innerHTML = block.value;
	return heading;
}

function renderText(block) {
	if (!block.value) return null;
	const paragraph = document.createElement("div");
	paragraph.className = "rp-info-popup-text";
	paragraph.innerHTML = block.value;
	return paragraph;
}

function renderList(block) {
	if (!Array.isArray(block.items) || !block.items.length) return null;
	const list = document.createElement(block.ordered ? "ol" : "ul");
	list.className = "rp-info-popup-list";
	block.items.forEach((text) => {
		const item = document.createElement("li");
		item.innerHTML = text;
		list.appendChild(item);
	});
	return list;
}

function renderImage(block) {
	if (!block.src) return null;
	const figure = document.createElement("figure");
	figure.className = "rp-info-popup-figure";

	const image = document.createElement("img");
	image.className = "rp-info-popup-image";
	image.src = block.src;
	image.alt = block.alt || (block.caption ? stripHtml(block.caption) : "");
	image.loading = "lazy";
	figure.appendChild(image);

	if (block.caption) {
		const caption = document.createElement("figcaption");
		caption.className = "rp-info-popup-caption";
		caption.innerHTML = block.caption;
		figure.appendChild(caption);
	}
	return figure;
}

function renderVideo(block) {
	if (!block.src) return null;
	const button = document.createElement("button");
	button.type = "button";
	button.className = "rp-info-popup-video";

	const icon = document.createElement("img");
	icon.className = "rp-info-popup-video-icon";
	icon.src = "./assets/Video-Copy.svg";
	icon.alt = "";

	const label = document.createElement("span");
	label.textContent = block.label || DEFAULT_VIDEO_LABEL;

	button.append(icon, label);
	button.addEventListener("click", () => openVideoPopup(block.src));
	return button;
}

const RENDERERS = {
	heading: renderHeading,
	text: renderText,
	list: renderList,
	image: renderImage,
	video: renderVideo,
};

function toBlocks(popup) {
	if (!popup) return [];
	if (Array.isArray(popup.blocks)) return popup.blocks;

	const blocks = [];
	if (popup.description) blocks.push({ type: "text", value: popup.description });
	if (popup.image) blocks.push({ type: "image", src: popup.image });
	return blocks;
}

export function renderPopupBody(body, footer, popup) {
	body.innerHTML = "";
	footer.innerHTML = "";

	toBlocks(popup).forEach((block) => {
		if (!block || !block.type) return;
		const render = RENDERERS[block.type];
		if (!render) return;
		const element = render(block);
		if (!element) return;
		(block.type === "video" ? footer : body).appendChild(element);
	});

	footer.classList.toggle("active", footer.children.length > 0);
	body.scrollTop = 0;
}
