// Entry point for Mario Builder 64 Level Parser & Serializer static site
// Uses Deno-bundled TypeScript, loaded as main.js
import { parseMb64 } from "../src/v1_1/parser.ts";
import { serializeMb64 } from "../src/v1_1/serializer.ts";

// Tab logic
const tabParse = document.getElementById("tab-parse")!;
const tabSerialize = document.getElementById("tab-serialize")!;
const paneParse = document.getElementById("pane-parse")!;
const paneSerialize = document.getElementById("pane-serialize")!;
const jsonEditor = document.getElementById("json-editor")!;
const parseError = document.getElementById("parse-error")!;
const serializeError = document.getElementById("serialize-error")!;
const serializeBtn = document.getElementById("serialize-btn")!;
const jsonTreeDiv = document.getElementById("json-tree")!;
const toggleJsonModeBtn = document.getElementById("toggle-json-mode")!;

function showTab(tab: "parse" | "serialize") {
  if (tab === "parse") {
    paneParse.classList.remove("hidden");
    paneSerialize.classList.add("hidden");
    tabParse.classList.add("border-b-2", "border-blue-500");
    tabParse.classList.remove("text-gray-500");
    tabSerialize.classList.remove("border-b-2", "border-blue-500");
    tabSerialize.classList.add("text-gray-500");
  } else {
    paneParse.classList.add("hidden");
    paneSerialize.classList.remove("hidden");
    tabSerialize.classList.add("border-b-2", "border-blue-500");
    tabSerialize.classList.remove("text-gray-500");
    tabParse.classList.remove("border-b-2", "border-blue-500");
    tabParse.classList.add("text-gray-500");
  }
}
tabParse.onclick = () => showTab("parse");
tabSerialize.onclick = () => showTab("serialize");

// Parse tab: file upload
const mb64Upload = document.getElementById("mb64-upload")! as HTMLInputElement;
mb64Upload.onchange = handleMb64Upload;

async function handleMb64Upload(_e: Event) {
  parseError.classList.add("hidden");
  const file = mb64Upload.files?.[0];
  if (!file) return;
  try {
    const buf = await file.arrayBuffer();
    const json = parseMb64(new Uint8Array(buf));
    const jsonStr = JSON.stringify(
      json,
      (_k, v) => typeof v === "bigint" ? v.toString() : v,
      2,
    );
    jsonEditor.value = jsonStr;
    persistFile(file.name, jsonStr, new Uint8Array(buf));
    if (treeMode) showTree(json);
    showTab("serialize");
  } catch (err) {
    parseError.textContent = err.message || String(err);
    parseError.classList.remove("hidden");
  }
}

// --- Persistence & Clear logic ---
const clearFileBtn = document.getElementById("clear-file")!;
const clearFileParseBtn = document.getElementById("clear-file-parse")!;
const FILE_KEY = "mb64_file";
const JSON_KEY = "mb64_json";
const FILENAME_KEY = "mb64_filename";

function persistFile(filename: string, jsonStr: string, fileData: Uint8Array) {
  localStorage.setItem(FILE_KEY, Array.from(fileData).join(","));
  localStorage.setItem(JSON_KEY, jsonStr);
  localStorage.setItem(FILENAME_KEY, filename);
}
function loadPersistedFile() {
  const jsonStr = localStorage.getItem(JSON_KEY);
  const filename = localStorage.getItem(FILENAME_KEY);
  if (jsonStr && filename) {
    jsonEditor.value = jsonStr;
    if (treeMode) {
      try {
        showTree(JSON.parse(jsonStr));
      } catch {}
    }
    showTab("serialize");
    return filename;
  }
  return null;
}
function clearPersistedFile() {
  localStorage.removeItem(FILE_KEY);
  localStorage.removeItem(JSON_KEY);
  localStorage.removeItem(FILENAME_KEY);
  jsonEditor.value = "";
  if (jsonTreeEditor) jsonTreeEditor.set({});
  showRaw("");
  showTab("parse");
}
clearFileBtn.onclick = clearPersistedFile;
clearFileParseBtn.onclick = clearPersistedFile;

// On page load, restore file if present
globalThis.addEventListener("DOMContentLoaded", () => {
  const jsonStr = localStorage.getItem(JSON_KEY);
  if (jsonStr) {
    jsonEditor.value = jsonStr;
    try {
      const json = JSON.parse(jsonStr);
      showTree(json);
      treeMode = true;
      toggleJsonModeBtn.textContent = "Switch to Raw";
    } catch {
      showRaw(jsonStr);
      treeMode = false;
      toggleJsonModeBtn.textContent = "Switch to Tree";
    }
    showTab("serialize");
  } else {
    showTab("parse");
    // Default to tree view
    showTree({});
    treeMode = true;
    toggleJsonModeBtn.textContent = "Switch to Raw";
  }
});

// --- Use original filename for download ---
serializeBtn.onclick = () => {
  serializeError.classList.add("hidden");
  try {
    const json = JSON.parse(jsonEditor.value);
    const bin = serializeMb64(json);
    const url = URL.createObjectURL(
      new Blob([bin], { type: "application/octet-stream" }),
    );
    const a = document.createElement("a");
    const filename = localStorage.getItem(FILENAME_KEY) || "level.mb64";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (err) {
    serializeError.textContent = err.message || String(err);
    serializeError.classList.remove("hidden");
  }
};

const demoBtn = document.getElementById("demo-btn")!;
demoBtn.onclick = async () => {
  parseError.classList.add("hidden");
  try {
    const res = await fetch("abc.mb64");
    const buf = await res.arrayBuffer();
    const json = parseMb64(new Uint8Array(buf));
    const jsonStr = JSON.stringify(
      json,
      (_k, v) => typeof v === "bigint" ? v.toString() : v,
      2,
    );
    jsonEditor.value = jsonStr;
    persistFile("abc.mb64", jsonStr, new Uint8Array(buf));
    if (treeMode) showTree(json);
    showTab("serialize");
  } catch (err) {
    parseError.textContent = err.message || String(err);
    parseError.classList.remove("hidden");
  }
};

let jsonTreeEditor: any = null;
let treeMode = true;

function showTree(json: any) {
  if (!jsonTreeEditor) {
    jsonTreeEditor = new (window as any).JSONEditor(jsonTreeDiv, {
      mode: "tree",
      onChange: () => {
        try {
          const updated = jsonTreeEditor.get();
          jsonEditor.value = JSON.stringify(updated, null, 2);
        } catch {}
      },
    });
  }
  jsonTreeEditor.set(json);
  jsonTreeDiv.style.display = "block";
  jsonEditor.style.display = "none";
  jsonTreeFullscreenBtn.style.display = "inline-block";
}
function showRaw(jsonStr: string) {
  jsonTreeDiv.style.display = "none";
  jsonEditor.style.display = "block";
  if (jsonTreeEditor) {
    try {
      jsonTreeEditor.set(JSON.parse(jsonStr));
    } catch {}
  }
  jsonTreeFullscreenBtn.style.display = "none";
}
toggleJsonModeBtn.onclick = () => {
  treeMode = !treeMode;
  if (treeMode) {
    try {
      const json = JSON.parse(jsonEditor.value);
      showTree(json);
      toggleJsonModeBtn.textContent = "Switch to Raw";
    } catch (e) {
      serializeError.textContent = "Invalid JSON for tree view.";
      serializeError.classList.remove("hidden");
      treeMode = false;
    }
  } else {
    showRaw(jsonEditor.value);
    toggleJsonModeBtn.textContent = "Switch to Tree";
  }
};

// Fullscreen toggle for tree editor
const jsonTreeFullscreenBtn = document.getElementById("json-tree-fullscreen")!;
let jsonTreeWasScroll = false;

function exitJsonTreeFullscreen() {
  const treeDiv = jsonTreeDiv;
  treeDiv.classList.remove(
    "fixed",
    "top-0",
    "left-0",
    "w-screen",
    "h-screen",
    "z-50",
    "bg-white",
    "p-8",
  );
  treeDiv.style.height = "600px";
  document.body.style.overflow = jsonTreeWasScroll ? "hidden" : "";
  jsonTreeFullscreenBtn.textContent = "Fullscreen";
}

jsonTreeFullscreenBtn.onclick = () => {
  const treeDiv = jsonTreeDiv;
  if (!treeDiv.classList.contains("fixed")) {
    // Enter fullscreen
    jsonTreeWasScroll = document.body.style.overflow === "hidden";
    treeDiv.classList.add(
      "fixed",
      "top-0",
      "left-0",
      "w-screen",
      "h-screen",
      "z-50",
      "bg-white",
      "p-8",
    );
    treeDiv.style.height = "100vh";
    document.body.style.overflow = "hidden";
    jsonTreeFullscreenBtn.textContent = "Exit Fullscreen";
    // Add ESC key listener to exit fullscreen
    document.addEventListener("keydown", handleJsonTreeEsc, { once: true });
  } else {
    // Exit fullscreen
    exitJsonTreeFullscreen();
  }
};

function handleJsonTreeEsc(e: KeyboardEvent) {
  if (e.key === "Escape") {
    exitJsonTreeFullscreen();
  }
}

// Default tab
showTab("parse");
