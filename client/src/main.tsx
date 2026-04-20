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

createRoot(document.getElementById("root")!).render(<App />);
