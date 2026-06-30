const STORAGE_KEY = "calendario-marcados";
const monthLabel = document.getElementById("monthLabel");
const grid = document.getElementById("grid");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const todayBtn = document.getElementById("todayBtn");

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const today = new Date();
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();

function loadMarked() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  } catch {
    return new Set();
  }
}

function saveMarked(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

let marked = loadMarked();

function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function render() {
  monthLabel.textContent = `${monthNames[viewMonth]} ${viewYear}`;
  grid.innerHTML = "";

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    grid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    const key = dateKey(viewYear, viewMonth, d);
    cell.className = "day";
    cell.textContent = d;

    const isToday =
      viewYear === today.getFullYear() &&
      viewMonth === today.getMonth() &&
      d === today.getDate();
    if (isToday) cell.classList.add("today");
    if (marked.has(key)) cell.classList.add("marked");

    cell.addEventListener("click", () => {
      if (marked.has(key)) {
        marked.delete(key);
      } else {
        marked.add(key);
      }
      saveMarked(marked);
      cell.classList.toggle("marked");
    });

    grid.appendChild(cell);
  }
}

prevBtn.addEventListener("click", () => {
  viewMonth--;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear--;
  }
  render();
});

nextBtn.addEventListener("click", () => {
  viewMonth++;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear++;
  }
  render();
});

todayBtn.addEventListener("click", () => {
  viewYear = today.getFullYear();
  viewMonth = today.getMonth();
  render();
});

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
