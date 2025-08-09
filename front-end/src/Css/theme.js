export default async function setTheme() {
  const res = await fetch("/colors.json");
  const mode = localStorage.getItem("theme") || "light";

  const colors = await res.json();
  const theme = colors[mode];
  Object.keys(theme).forEach((key) => {
    document.documentElement.style.setProperty(key, theme[key]);
  });
  const button = document.getElementById("theme-toggle");
  button.addEventListener("click", () => {
    const current = mode;
    const next = current === "light" ? "dark" : "light";
    window.localStorage.setItem("theme", next);
  });

  window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.dataset.theme = saved;
    setTheme(saved);
  });
}
