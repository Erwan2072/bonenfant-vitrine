(function () {
  // Année
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const btn = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  let lastFocusEl = null;

  function openNav() {
    if (!btn || !nav) return;
    lastFocusEl = document.activeElement;

    nav.classList.add("open");
    btn.setAttribute("aria-expanded", "true");

    // En a11y: focus sur le premier lien du menu
    const firstLink = nav.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeNav({ restoreFocus = true } = {}) {
    if (!btn || !nav) return;

    nav.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");

    if (restoreFocus && lastFocusEl && typeof lastFocusEl.focus === "function") {
      lastFocusEl.focus();
    }
  }

  function isNavOpen() {
    return !!nav && nav.classList.contains("open");
  }

  if (btn && nav) {
    // Bonus ARIA (utile lecteurs d’écran)
    btn.setAttribute("aria-haspopup", "true");

    btn.addEventListener("click", () => {
      if (isNavOpen()) closeNav({ restoreFocus: false });
      else openNav();
    });

    // Clic sur un lien -> fermer menu
    nav.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      closeNav({ restoreFocus: false });
    });

    // Fermer au clavier (Escape)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isNavOpen()) {
        e.preventDefault();
        closeNav();
      }
    });

    // Clic en dehors -> fermer
    document.addEventListener("click", (e) => {
      if (!isNavOpen()) return;
      const target = e.target;
      if (nav.contains(target) || btn.contains(target)) return;
      closeNav({ restoreFocus: false });
    });
  }

  // Contact: sans backend → mailto
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#name")?.value?.trim() || "";
      const email = form.querySelector("#email")?.value?.trim() || "";
      const subjectInput = form.querySelector("#subject")?.value?.trim() || "";
      const message = form.querySelector("#message")?.value?.trim() || "";

      const subject = encodeURIComponent(subjectInput || `Contact — ${name || "Réussir Chasné 2026"}`);
      const body = encodeURIComponent(
        `Nom: ${name}\nEmail: ${email}\n\n${message}`
      );

      window.location.href = `mailto:reussirchasne2026@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();
