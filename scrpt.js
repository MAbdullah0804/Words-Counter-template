const textInput = document.getElementById("textInput");
const charCountEl = document.getElementById("charCount");
const wordCountEl = document.getElementById("wordCount");
const sentenceCountEl = document.getElementById("sentenceCount");
const readingTimeEl = document.getElementById("readingTime");
const densityList = document.getElementById("densityList");

const includeSpaces = document.getElementById("includeSpaces");
const limitInput = document.getElementById("limitInput");
const warning = document.getElementById("warning");
const themeSelect = document.getElementById("themeSelect");

function analyze() {
  const text = textInput.value;
  const include = includeSpaces.checked;

  // CHAR COUNT
  const charCount = include ? text.length : text.replace(/\s+/g, "").length;
  charCountEl.textContent = charCount;

  // WORD COUNT
  const words = text.trim() === "" ? [] : text.trim().split(/\s+/);
  wordCountEl.textContent = words.length;

  // SENTENCE COUNT
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  sentenceCountEl.textContent = sentences.length;

  // READING TIME (200 wpm → 3.33 wps)
  const seconds = Math.ceil(words.length / 3.33);
  readingTimeEl.textContent = seconds < 60 
    ? `${seconds} sec`
    : `${Math.round(seconds/60)} min`;

  // LETTER DENSITY
  const density = {};
  [...text.toLowerCase()].forEach(ch => {
    if (/[a-z]/.test(ch)) {
      density[ch] = (density[ch] || 0) + 1;
    }
  });

  densityList.innerHTML = Object.keys(density)
    .sort()
    .map(letter => `<li><strong>${letter.toUpperCase()}</strong>: ${density[letter]}</li>`)
    .join("");

  // LIMIT CHECK
  const limit = Number(limitInput.value);
  if (limit > 0 && charCount > limit) {
    warning.textContent = `⚠️ You exceeded the limit by ${charCount - limit} characters.`;
    textInput.style.borderColor = "var(--warning)";
  } else {
    warning.textContent = "";
    textInput.style.borderColor = "var(--border)";
  }
}

// Theme switcher
themeSelect.addEventListener("change", () => {
  document.documentElement.setAttribute("data-theme", themeSelect.value);
  localStorage.setItem("theme", themeSelect.value);
});

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeSelect.value = savedTheme;
}

// Listeners
textInput.addEventListener("input", analyze);
includeSpaces.addEventListener("change", analyze);
limitInput.addEventListener("input", analyze);
