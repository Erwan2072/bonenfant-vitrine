(() => {
  /* =========================
     Année dynamique
     ========================= */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* =========================
     Menu mobile
     ========================= */
  const btn = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  const closeNav = () => {
    if (!nav || !btn) return;
    nav.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  };

  if (btn && nav) {
    // Click bouton
    btn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });

    // Accessibilité: Enter / Space
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const isOpen = nav.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(isOpen));
      }
    });

    // Fermeture si clic hors menu (mobile)
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      const inside = nav.contains(target) || btn.contains(target);
      if (!inside) closeNav();
    });

    // Fermeture si clic sur un lien (mobile)
    nav.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof Element && target.closest("a")) closeNav();
    });

    // Fermeture au clavier (Esc)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* =========================
     Contact: mailto sans backend
     ========================= */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#name")?.value?.trim() || "";
      const email = form.querySelector("#email")?.value?.trim() || "";
      const message = form.querySelector("#message")?.value?.trim() || "";

      const subject = encodeURIComponent(`Contact — ${name}`);
      const body = encodeURIComponent(
        `Nom: ${name}\nEmail: ${email}\n\n${message}`
      );

      window.location.href = `mailto:reussirchasne2026@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* =========================================================
     Coin presse : tri auto + du plus récent au plus ancien
     (scroll interne géré par ton CSS .press__list)
     ========================================================= */

  // Recommandé dans ton HTML :
  // <div id="pressList" class="press__list"> ... </div>
  // et chaque item :
  // <article class="press-item" data-date="2026-01-05">...</article>

  const pressList = document.getElementById("pressList");
  if (pressList) {
    const parseDateSafe = (value) => {
      if (!value) return null;

      // Accepte:
      // - "2026-01-05" (recommandé)
      // - "2026-01-05T10:00:00"
      // - "05/01/2026" (fallback FR)
      const raw = String(value).trim();

      // ISO direct
      const d1 = new Date(raw);
      if (!Number.isNaN(d1.getTime())) return d1;

      // Fallback FR "dd/mm/yyyy"
      const m = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (m) {
        const dd = Number(m[1]);
        const mm = Number(m[2]) - 1;
        const yyyy = Number(m[3]);
        const d2 = new Date(yyyy, mm, dd);
        if (!Number.isNaN(d2.getTime())) return d2;
      }

      return null;
    };

    const items = Array.from(pressList.querySelectorAll(".press-item"));

    // Tri: plus récent -> plus ancien
    items
      .map((node) => ({
        node,
        date:
          parseDateSafe(node.getAttribute("data-date")) ||
          parseDateSafe(node.querySelector("time")?.getAttribute("datetime")) ||
          null,
      }))
      .sort((a, b) => {
        const ta = a.date ? a.date.getTime() : -Infinity;
        const tb = b.date ? b.date.getTime() : -Infinity;
        return tb - ta;
      })
      .forEach(({ node }) => pressList.appendChild(node));
  }

  /* =========================================================
     Agenda : "Ce mois-ci" auto via data/events.json
     (sans API Google)
     ========================================================= */

  const eventsGrid = document.getElementById("eventsGrid");
  const eventsHint = document.getElementById("eventsHint");

  // Ne s’exécute que sur la page qui contient #eventsGrid
  if (eventsGrid) {
    const pad2 = (n) => String(n).padStart(2, "0");

    const toDate = (iso) => {
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    const sameMonth = (a, b) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

    const formatDateFR = (d) =>
      `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
    const formatTimeFR = (d) => `${pad2(d.getHours())}h${pad2(d.getMinutes())}`;

    const el = (tag, opts = {}) => {
      const node = document.createElement(tag);
      if (opts.class) node.className = opts.class;
      if (opts.role) node.setAttribute("role", opts.role);
      if (opts.href) node.setAttribute("href", opts.href);
      if (opts.text != null) node.textContent = opts.text;
      return node;
    };

    const renderEmpty = () => {
      eventsGrid.innerHTML = "";

      const article = el("article", { class: "photo-card", role: "listitem" });
      const body = el("div", { class: "photo-card__body" });

      body.appendChild(el("h3", { text: "Aucun événement ce mois-ci" }));
      body.appendChild(
        el("p", {
          class: "muted",
          text: "Consultez l’agenda ci-dessous ou proposez un rendez-vous.",
        })
      );

      const cta = el("div", { class: "cta" });
      cta.style.marginTop = "10px";

      const a1 = el("a", { class: "btn btn--ghost", href: "#agenda" });
      a1.textContent = "Voir l’agenda";

      const a2 = el("a", {
        class: "btn btn--outline",
        href: "mailto:reussirchasne2026@gmail.com",
      });
      a2.textContent = "Proposer un rendez-vous";

      cta.appendChild(a1);
      cta.appendChild(a2);

      body.appendChild(cta);
      article.appendChild(body);
      eventsGrid.appendChild(article);

      if (eventsHint) eventsHint.textContent = "";
    };

    const renderCard = (evt) => {
      const article = el("article", { class: "photo-card", role: "listitem" });
      const body = el("div", { class: "photo-card__body" });

      body.appendChild(el("h3", { text: evt.title || "Événement" }));

      const start = toDate(evt.start);
      const end = toDate(evt.end);

      const pDate = document.createElement("p");
      const bDate = document.createElement("strong");
      bDate.textContent = "Date : ";
      pDate.appendChild(bDate);

      if (start) {
        pDate.appendChild(document.createTextNode(formatDateFR(start)));

        if (end) {
          pDate.appendChild(document.createTextNode(" • "));
          const bHeure = document.createElement("strong");
          bHeure.textContent = "Heure : ";
          pDate.appendChild(bHeure);
          pDate.appendChild(
            document.createTextNode(`${formatTimeFR(start)} → ${formatTimeFR(end)}`)
          );
        }
      } else {
        pDate.appendChild(document.createTextNode("À confirmer"));
      }

      const pLieu = document.createElement("p");
      const bLieu = document.createElement("strong");
      bLieu.textContent = "Lieu : ";
      pLieu.appendChild(bLieu);
      pLieu.appendChild(document.createTextNode(evt.location || "À préciser"));

      body.appendChild(pDate);
      body.appendChild(pLieu);

      if (evt.description)
        body.appendChild(el("p", { class: "muted", text: evt.description }));

      const cta = el("div", { class: "cta" });
      cta.style.marginTop = "10px";

      const link = evt.link || "#agenda";
      const a = el("a", { class: "btn btn--ghost", href: link });
      a.textContent = "Ouvrir l’agenda";
      cta.appendChild(a);

      body.appendChild(cta);

      article.appendChild(body);
      return article;
    };

    const loadEvents = async () => {
      try {
        const res = await fetch("data/events.json", { cache: "no-store" });
        if (!res.ok) throw new Error("events.json introuvable");

        const list = await res.json();
        const now = new Date();

        const events = (Array.isArray(list) ? list : [])
          .map((e) => ({ ...e, _start: toDate(e.start) }))
          .filter((e) => e._start && sameMonth(e._start, now))
          .sort((a, b) => a._start - b._start);

        eventsGrid.innerHTML = "";

        if (!events.length) {
          renderEmpty();
          return;
        }

        // On limite à 9 pour rester propre
        events.slice(0, 9).forEach((evt) => eventsGrid.appendChild(renderCard(evt)));

        if (eventsHint) {
          eventsHint.textContent =
            "Les rendez-vous affichés ici proviennent du fichier data/events.json.";
        }
      } catch (err) {
        // Ne casse pas la page
        renderEmpty();
        if (eventsHint)
          eventsHint.textContent =
            "Ajoutez vos événements dans data/events.json pour remplir cette section.";
      }
    };

    loadEvents();
  }
})();
