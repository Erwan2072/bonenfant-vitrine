(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const btn = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });

    // fermeture si clic hors menu (mobile)
    document.addEventListener("click", (e) => {
      const inside = nav.contains(e.target) || btn.contains(e.target);
      if (!inside) {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Contact: mailto sans backend
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#name")?.value?.trim() || "";
      const email = form.querySelector("#email")?.value?.trim() || "";
      const message = form.querySelector("#message")?.value?.trim() || "";

      const subject = encodeURIComponent(`Contact — ${name}`);
      const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\n${message}`);

      window.location.href = `mailto:reussirchasne2026@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();
