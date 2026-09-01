import { ClerkProvider } from "@clerk/clerk-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App.tsx";

// Suppress browser extension / performance observer bug (startTime crash in reportAllChanges)
const handleGlobalError = (event: ErrorEvent | PromiseRejectionEvent) => {
  const msg = (event as ErrorEvent).message || (event as PromiseRejectionEvent).reason?.message || "";
  const stack = (event as ErrorEvent).error?.stack || (event as PromiseRejectionEvent).reason?.stack || "";
  if (
    msg.includes("startTime") ||
    msg.includes("reportAllChanges") ||
    stack.includes("reportAllChanges")
  ) {
    console.warn("[SDK/Extension Guard] Isolated third-party telemetry error:", msg);
    if (typeof (event as any).stopImmediatePropagation === "function") (event as any).stopImmediatePropagation();
    if (typeof event.preventDefault === "function") event.preventDefault();
    return true;
  }
};

window.addEventListener("error", handleGlobalError, true);
window.addEventListener("unhandledrejection", handleGlobalError, true);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable.");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} telemetry={false} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </StrictMode>
);