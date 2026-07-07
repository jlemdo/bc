/* =============================================================
   BC GREENHOUSE — main.js
   Vanilla JS, sin dependencias. Cada bloque es independiente
   y tolerante a que el elemento no exista en la página.
   ============================================================= */
(function () {
  "use strict";

  /* ---------- 1. Menú móvil ---------- */
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");

  const closeMenu = function () {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (header) header.classList.remove("nav-open");
    document.body.style.overflow = "";
  };

  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      // Eleva el header por encima de todo el contenido mientras el menú
      // está abierto (evita problemas de stacking context).
      if (header) header.classList.toggle("nav-open", open);
    });
    // Cerrar al hacer click en un enlace del menú
    nav.querySelectorAll(".nav__menu a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    // Cerrar con Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) closeMenu();
    });
  }

  /* ---------- 2. Header sticky: sombra al hacer scroll ---------- */
  if (header) {
    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 3. Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      const io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- 4. Contador animado de estadísticas ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = function (el) {
      const target = parseFloat(el.getAttribute("data-count"));
      const decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
      const suffix = el.getAttribute("data-suffix") || "";
      const prefix = el.getAttribute("data-prefix") || "";
      if (prefersReduced) { el.textContent = prefix + target + suffix; return; }
      const duration = 1600;
      let startTime = null;
      const step = function (ts) {
        if (!startTime) startTime = ts;
        const p = Math.min((ts - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        const val = (target * eased).toFixed(decimals);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 5. Año dinámico en el footer ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 6. Botón scroll to top ---------- */
  const toTop = document.querySelector("[data-to-top]");
  if (toTop) {
    const toggleTop = function () {
      toTop.classList.toggle("is-visible", window.scrollY > 500);
    };
    toggleTop();
    window.addEventListener("scroll", toggleTop, { passive: true });
    toTop.addEventListener("click", function () {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

})();
