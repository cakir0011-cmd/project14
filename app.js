const board = document.getElementById("board");
const viewport = document.getElementById("boardViewport");

const mediaUrl = document.getElementById("mediaUrl");
const frameColor = document.getElementById("frameColor");
const noteText = document.getElementById("noteText");
const customText = document.getElementById("customText");
const fontFamily = document.getElementById("fontFamily");
const sizeSlider = document.getElementById("sizeSlider");
const itemColor = document.getElementById("itemColor");

const addImageBtn = document.getElementById("addImageBtn");
const addVideoBtn = document.getElementById("addVideoBtn");
const addNoteYellow = document.getElementById("addNoteYellow");
const addNoteBlue = document.getElementById("addNoteBlue");
const addTextBtn = document.getElementById("addTextBtn");

let selected = null;
let zCounter = 1;

viewport.scrollLeft = 3800;
viewport.scrollTop = 3800;

function sanitizeUrl(url) {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}

function randomPosition() {
  return {
    x: 3600 + Math.round(Math.random() * 500),
    y: 3600 + Math.round(Math.random() * 450),
  };
}

function selectItem(el) {
  if (selected) selected.classList.remove("selected");
  selected = el;
  if (!selected) return;

  selected.classList.add("selected");
  selected.style.zIndex = String(++zCounter);

  const kind = selected.dataset.kind;
  if (kind === "polaroid") {
    const box = selected.querySelector(".polaroid");
    const width = parseInt(box.style.width || "280", 10);
    sizeSlider.value = String(width);
    itemColor.value = rgbToHex(getComputedStyle(box).getPropertyValue("--frame") || frameColor.value);
  } else if (kind === "note") {
    const box = selected.querySelector(".note");
    const width = parseInt(box.style.width || "260", 10);
    sizeSlider.value = String(width);
    itemColor.value = rgbToHex(getComputedStyle(box).backgroundColor);
  } else if (kind === "text") {
    const box = selected.querySelector(".text-item");
    sizeSlider.value = String(parseInt(getComputedStyle(box).fontSize, 10));
    itemColor.value = rgbToHex(getComputedStyle(box).color);
  }
}

function rgbToHex(rgb) {
  if (!rgb || rgb.startsWith("#")) return rgb || "#ffffff";
  const values = rgb.match(/\d+/g);
  if (!values || values.length < 3) return "#ffffff";
  return `#${values.slice(0, 3).map((v) => Number(v).toString(16).padStart(2, "0")).join("")}`;
}

function makeDraggable(el) {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;

  el.addEventListener("pointerdown", (event) => {
    dragging = true;
    el.setPointerCapture(event.pointerId);
    selectItem(el);

    startX = event.clientX;
    startY = event.clientY;
    originX = Number(el.dataset.x || 0);
    originY = Number(el.dataset.y || 0);
    el.style.cursor = "grabbing";
  });

  el.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const x = originX + (event.clientX - startX);
    const y = originY + (event.clientY - startY);
    placeItem(el, x, y);
  });

  const stop = () => {
    dragging = false;
    el.style.cursor = "grab";
  };

  el.addEventListener("pointerup", stop);
  el.addEventListener("pointercancel", stop);

  el.addEventListener("click", () => selectItem(el));
}

function placeItem(el, x, y) {
  const safeX = Math.max(0, Math.min(7900, x));
  const safeY = Math.max(0, Math.min(7900, y));
  el.dataset.x = String(safeX);
  el.dataset.y = String(safeY);
  el.style.left = `${safeX}px`;
  el.style.top = `${safeY}px`;
}

function createItem(kind, innerNode) {
  const wrap = document.createElement("article");
  wrap.className = "item";
  wrap.dataset.kind = kind;
  wrap.style.zIndex = String(++zCounter);
  wrap.append(innerNode);

  const pos = randomPosition();
  placeItem(wrap, pos.x, pos.y);
  makeDraggable(wrap);
  board.append(wrap);
  selectItem(wrap);
}

function addPolaroid(type) {
  const clean = sanitizeUrl(mediaUrl.value.trim());
  if (!clean) {
    alert("Please enter a valid media URL (http/https).");
    return;
  }

  const shell = document.createElement("div");
  shell.className = "polaroid";
  shell.style.setProperty("--frame", frameColor.value);
  shell.style.width = "280px";

  const media = document.createElement(type === "video" ? "video" : "img");
  media.src = clean;
  if (type === "video") {
    media.controls = true;
    media.muted = true;
  }

  const caption = document.createElement("div");
  caption.className = "caption";
  caption.textContent = type === "video" ? "polaroid motion" : "polaroid still";

  shell.append(media, caption);
  createItem("polaroid", shell);
  mediaUrl.value = "";
}

function addNote(variant) {
  const value = noteText.value.trim() || "new note";
  const note = document.createElement("div");
  note.className = `note ${variant}`;
  note.style.width = "260px";
  note.textContent = value;
  createItem("note", note);
  noteText.value = "";
}

function addText() {
  const value = customText.value.trim() || "New text";
  const text = document.createElement("div");
  text.className = "text-item";
  text.textContent = value;
  text.style.fontFamily = fontFamily.value;
  text.style.color = "#1f1f1f";
  createItem("text", text);
  customText.value = "";
}

sizeSlider.addEventListener("input", () => {
  if (!selected) return;
  const kind = selected.dataset.kind;
  if (kind === "polaroid") selected.querySelector(".polaroid").style.width = `${sizeSlider.value}px`;
  if (kind === "note") selected.querySelector(".note").style.width = `${sizeSlider.value}px`;
  if (kind === "text") selected.querySelector(".text-item").style.fontSize = `${Math.max(12, Number(sizeSlider.value) / 6)}px`;
});

itemColor.addEventListener("input", () => {
  if (!selected) return;
  const kind = selected.dataset.kind;
  if (kind === "polaroid") {
    selected.querySelector(".polaroid").style.setProperty("--frame", itemColor.value);
  }
  if (kind === "note") {
    selected.querySelector(".note").style.background = itemColor.value;
  }
  if (kind === "text") {
    selected.querySelector(".text-item").style.color = itemColor.value;
  }
});

fontFamily.addEventListener("change", () => {
  if (!selected || selected.dataset.kind !== "text") return;
  selected.querySelector(".text-item").style.fontFamily = fontFamily.value;
});

addImageBtn.addEventListener("click", () => addPolaroid("image"));
addVideoBtn.addEventListener("click", () => addPolaroid("video"));
addNoteYellow.addEventListener("click", () => addNote("yellow"));
addNoteBlue.addEventListener("click", () => addNote("blue"));
addTextBtn.addEventListener("click", addText);

board.addEventListener("click", (event) => {
  if (event.target === board) {
    if (selected) selected.classList.remove("selected");
    selected = null;
  }
});

addNote("yellow");
addText();
