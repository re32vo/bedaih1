import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

if (apiBaseUrl && typeof window !== "undefined") {
	const nativeFetch = window.fetch.bind(window);

	window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
		if (typeof input === "string" && input.startsWith("/api")) {
			return nativeFetch(`${apiBaseUrl}${input}`, init);
		}

		if (input instanceof Request && input.url.startsWith(`${window.location.origin}/api`)) {
			const proxiedUrl = input.url.replace(window.location.origin, apiBaseUrl);
			return nativeFetch(new Request(proxiedUrl, input), init);
		}

		return nativeFetch(input as RequestInfo, init);
	}) as typeof window.fetch;
}

if (typeof window !== "undefined") {
	const isEditableElement = (target: EventTarget | null) => {
		if (!(target instanceof HTMLElement)) return false;
		const tag = target.tagName.toLowerCase();
		return tag === "input" || tag === "textarea" || target.isContentEditable;
	};

	const stopEvent = (event: Event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	// Disable right-click context menu.
	window.addEventListener("contextmenu", stopEvent, { capture: true });

	// Disable dragging images/links to reduce easy saving.
	window.addEventListener(
		"dragstart",
		(event) => {
			const target = event.target as HTMLElement | null;
			if (!target) return;
			const tag = target.tagName?.toLowerCase();
			if (tag === "img" || tag === "a") {
				stopEvent(event);
			}
		},
		{ capture: true }
	);

	// Block selecting text globally except editable fields.
	window.addEventListener(
		"selectstart",
		(event) => {
			if (!isEditableElement(event.target)) {
				stopEvent(event);
			}
		},
		{ capture: true }
	);

	// Block copy/cut/print shortcuts and developer tools shortcuts.
	window.addEventListener(
		"keydown",
		(event) => {
			const key = event.key.toLowerCase();
			const ctrlOrMeta = event.ctrlKey || event.metaKey;

			if (
				event.key === "F12" ||
				(ctrlOrMeta && ["u", "s", "p", "c", "x", "a", "i", "j"].includes(key)) ||
				(ctrlOrMeta && event.shiftKey && ["i", "j", "c"].includes(key))
			) {
				stopEvent(event);
			}
		},
		{ capture: true }
	);

	window.addEventListener("copy", stopEvent, { capture: true });
	window.addEventListener("cut", stopEvent, { capture: true });

	// Basic DevTools open detector (deterrent only, not absolute protection).
	let warningEl: HTMLDivElement | null = null;
	const ensureWarning = () => {
		if (warningEl) return warningEl;
		warningEl = document.createElement("div");
		warningEl.style.position = "fixed";
		warningEl.style.inset = "0";
		warningEl.style.zIndex = "999999";
		warningEl.style.display = "none";
		warningEl.style.alignItems = "center";
		warningEl.style.justifyContent = "center";
		warningEl.style.background = "rgba(15,23,42,0.92)";
		warningEl.style.color = "#fff";
		warningEl.style.fontSize = "22px";
		warningEl.style.fontWeight = "700";
		warningEl.style.textAlign = "center";
		warningEl.style.padding = "24px";
		warningEl.textContent = "تم تقييد أدوات المطور لحماية المحتوى";
		document.body.appendChild(warningEl);
		return warningEl;
	};

	setInterval(() => {
		const widthGap = window.outerWidth - window.innerWidth > 160;
		const heightGap = window.outerHeight - window.innerHeight > 160;
		const devtoolsLikelyOpen = widthGap || heightGap;
		const overlay = ensureWarning();
		overlay.style.display = devtoolsLikelyOpen ? "flex" : "none";
	}, 1200);
}

createRoot(document.getElementById("root")!).render(<App />);
