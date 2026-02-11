const state = {
  pages: [
    {
      items: [
        { type: "image", src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80" },
        { type: "note", text: "Welcome to your modernist notebook. Add images, videos, and ideas." },
      ],
    },
  ],
  currentPage: 0,
};

const book = document.getElementById("book");
const mediaUrl = document.getElementById("mediaUrl");
const noteInput = document.getElementById("noteInput");
const pageIndicator = document.getElementById("pageIndicator");

const addImageBtn = document.getElementById("addImageBtn");
const addVideoBtn = document.getElementById("addVideoBtn");
const addNoteBtn = document.getElementById("addNoteBtn");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const newPageBtn = document.getElementById("newPageBtn");
const helpButton = document.getElementById("helpButton");
const helpDialog = document.getElementById("helpDialog");

const tiltCycle = ["-2deg", "1.2deg", "-1deg", "2.4deg"];

function getCurrent() {
  return state.pages[state.currentPage];
}

function sanitizeUrl(url) {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}

function createPolaroid(item, index) {
  const card = document.createElement("article");
  card.className = "polaroid";
  card.style.setProperty("--tilt", tiltCycle[index % tiltCycle.length]);

  const media = document.createElement(item.type === "video" ? "video" : "img");
  if (item.type === "video") {
    media.controls = true;
    media.muted = true;
  }
  media.src = item.src;
  media.alt = "Page media";

  const caption = document.createElement("p");
  caption.className = "caption";
  caption.textContent = item.type === "video" ? "moving memory" : "still memory";

  card.append(media, caption);
  return card;
}

function createNote(item) {
  const note = document.createElement("article");
  note.className = "note";
  note.textContent = item.text;
  return note;
}

function renderPageContent(page) {
  const content = document.createElement("div");
  content.className = "page-content";

  page.items.forEach((item, index) => {
    if (item.type === "note") {
      content.append(createNote(item));
      return;
    }
    content.append(createPolaroid(item, index));
  });

  return content;
}

function renderBook() {
  book.innerHTML = "";

  state.pages.forEach((page, idx) => {
    const pageEl = document.createElement("section");
    const isLeft = idx < state.currentPage;
    const isCurrent = idx === state.currentPage;

    pageEl.className = `page ${isLeft ? "left" : "right"} ${isLeft ? "flipped" : ""} ${
      isCurrent ? "active" : ""
    }`;

    pageEl.style.zIndex = String(200 - idx);

    const face = document.createElement("div");
    face.className = "page-face";
    face.append(renderPageContent(page));

    const handle = document.createElement("button");
    handle.className = `flip-handle ${isLeft ? "left" : "right"}`;
    handle.title = isLeft ? "Flip backward" : "Flip forward";
    handle.addEventListener("click", () => {
      if (isLeft) {
        goToPage(idx);
      } else {
        goToPage(Math.min(idx + 1, state.pages.length - 1));
      }
    });

    pageEl.append(face, handle);
    book.append(pageEl);
  });

  pageIndicator.textContent = `Page ${state.currentPage + 1} of ${state.pages.length}`;
}

function goToPage(target) {
  state.currentPage = Math.max(0, Math.min(target, state.pages.length - 1));
  renderBook();
}

function addMedia(type) {
  const clean = sanitizeUrl(mediaUrl.value.trim());
  if (!clean) {
    alert("Please enter a valid http/https media URL.");
    return;
  }

  getCurrent().items.push({ type, src: clean });
  mediaUrl.value = "";
  renderBook();
}

function addNote() {
  const text = noteInput.value.trim();
  if (!text) {
    alert("Write a note first.");
    return;
  }

  getCurrent().items.push({ type: "note", text });
  noteInput.value = "";
  renderBook();
}

function addPage() {
  state.pages.push({ items: [] });
  goToPage(state.pages.length - 1);
}

addImageBtn.addEventListener("click", () => addMedia("image"));
addVideoBtn.addEventListener("click", () => addMedia("video"));
addNoteBtn.addEventListener("click", addNote);
newPageBtn.addEventListener("click", addPage);
prevPageBtn.addEventListener("click", () => goToPage(state.currentPage - 1));
nextPageBtn.addEventListener("click", () => goToPage(state.currentPage + 1));

helpButton.addEventListener("click", () => helpDialog.showModal());

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") goToPage(state.currentPage - 1);
  if (event.key === "ArrowRight") goToPage(state.currentPage + 1);
});

renderBook();
