(function(){
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const btn = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  if (btn && nav){
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  }

  // Contact: sans backend → mailto
  const form = document.getElementById("contactForm");
  if (form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#name")?.value?.trim() || "";
      const email = form.querySelector("#email")?.value?.trim() || "";
      const message = form.querySelector("#message")?.value?.trim() || "";

      const subject = encodeURIComponent(`Contact — ${name}`);
      const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\n${message}`);

      // TODO: remplace l'email destinataire
      window.location.href = `mailto:contact@exemple.fr?subject=${subject}&body=${body}`;
    });
  }
})();
