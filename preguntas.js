// --- nuevo maca: acordeón FAQ ---
document.querySelectorAll(".acordeon-titulo").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    item.classList.toggle("activo");
  });
});