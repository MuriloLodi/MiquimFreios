
(() => {
  "use strict";

  // =========================
  // Mobile menu (drawer)
  // =========================
  const hamb = document.getElementById("hamb");
  const drawer = document.getElementById("drawer");

  const setDrawer = (open) => {
    if (!drawer || !hamb) return;
    drawer.classList.toggle("open", !!open);
    hamb.setAttribute("aria-expanded", open ? "true" : "false");
  };

  if (hamb && drawer) {
    hamb.setAttribute("aria-expanded", "false");

    hamb.addEventListener("click", () => {
      setDrawer(!drawer.classList.contains("open"));
    });

    // Fecha ao clicar em um item do menu mobile
    document.querySelectorAll(".m-link").forEach((a) =>
      a.addEventListener("click", () => setDrawer(false))
    );

    // ✅ Fecha ao clicar fora (mobile/desktop)
    document.addEventListener("pointerdown", (e) => {
      if (!drawer.classList.contains("open")) return;

      const clickedDrawer = e.target.closest("#drawer");
      const clickedHamb = e.target.closest("#hamb");
      if (clickedDrawer || clickedHamb) return;

      setDrawer(false);
    });

    // Fecha no ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("open")) {
        setDrawer(false);
      }
    });
  }

  // =========================
  // Smooth scroll (âncoras + [data-scroll])
  // =========================
  function goToHash(id) {
    if (!id) return;
    const el = document.querySelector(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 74;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      goToHash(id);
    });
  });

  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", () => goToHash(btn.getAttribute("data-scroll")));
  });

  // =========================
  // Hero Swiper
  // =========================
  if (typeof Swiper !== "undefined") {
    const swiper = new Swiper("#heroSwiper", {
      loop: true,
      speed: 650,
      autoplay: { delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true },
      effect: "slide",
      pagination: { el: ".swiper-pagination", clickable: true },
    });

    const heroPrev = document.getElementById("heroPrev");
    const heroNext = document.getElementById("heroNext");
    if (heroPrev) heroPrev.addEventListener("click", () => swiper.slidePrev());
    if (heroNext) heroNext.addEventListener("click", () => swiper.slideNext());
  }

  // =========================
  // Especialidades (desktop hover / mobile click)
  // =========================
  const cards = Array.from(document.querySelectorAll(".spec-card"));
  const isDesktopHover = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches && window.innerWidth > 980;

  function closeAll(except = null) {
    cards.forEach((c) => {
      if (c !== except) c.classList.remove("open");
    });
  }

  document.querySelectorAll(".spec-cta").forEach((a) => {
    a.addEventListener("click", (e) => e.stopPropagation());
  });

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (isDesktopHover()) return;
      const willOpen = !card.classList.contains("open");
      closeAll(card);
      card.classList.toggle("open", willOpen);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isDesktopHover()) return;
        const willOpen = !card.classList.contains("open");
        closeAll(card);
        card.classList.toggle("open", willOpen);
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (isDesktopHover()) return;
    const inside = e.target.closest(".spec-card");
    if (!inside) closeAll(null);
  });

  window.addEventListener("resize", () => {
    if (isDesktopHover()) closeAll(null);
  });

  // =========================
  // Vídeo modal (Serviços)
  // =========================
  const openVideoBtn = document.getElementById("openVideo");
  const videoModal = document.getElementById("videoModal");
  const svcVideoEl = document.getElementById("svcVideoEl");

  function openVideo() {
    if (!videoModal || !svcVideoEl) return;
    videoModal.classList.add("open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    try {
      svcVideoEl.currentTime = 0;
      const p = svcVideoEl.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch (e) {}
  }

  function closeVideo() {
    if (!videoModal || !svcVideoEl) return;
    videoModal.classList.remove("open");
    videoModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    try {
      svcVideoEl.pause();
      svcVideoEl.currentTime = 0;
    } catch (e) {}
  }

  if (openVideoBtn) openVideoBtn.addEventListener("click", openVideo);
  if (videoModal) {
    videoModal.querySelectorAll("[data-close]").forEach((el) =>
      el.addEventListener("click", closeVideo)
    );
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal && videoModal.classList.contains("open")) closeVideo();
  });
})();

// =========================
// FAQ (abrir suave com altura animada)
// =========================
const faqItems = Array.from(document.querySelectorAll(".faq-item"));

function closeFaq(item) {
  item.classList.remove("open");
  const btn = item.querySelector(".faq-q");
  const ans = item.querySelector(".faq-a");
  if (btn) btn.setAttribute("aria-expanded", "false");
  if (ans) ans.style.maxHeight = "0px";
}

function openFaq(item) {
  item.classList.add("open");
  const btn = item.querySelector(".faq-q");
  const ans = item.querySelector(".faq-a");
  if (btn) btn.setAttribute("aria-expanded", "true");
  if (ans) {
    // garante que dá pra medir altura
    ans.style.maxHeight = "0px";
    // força reflow pra transição ficar bonita
    void ans.offsetHeight;
    ans.style.maxHeight = ans.scrollHeight + "px";
  }
}

faqItems.forEach((item) => {
  const btn = item.querySelector(".faq-q");
  const ans = item.querySelector(".faq-a");
  if (!btn || !ans) return;

  // ✅ não usa hidden (pra animar)
  ans.hidden = false;
  ans.style.maxHeight = "0px";

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    // fecha todos
    faqItems.forEach(closeFaq);

    // abre o clicado
    if (!isOpen) openFaq(item);
  });
});

// ✅ recalcula altura se a tela mudar (quando estiver aberto)
window.addEventListener("resize", () => {
  faqItems.forEach((item) => {
    if (!item.classList.contains("open")) return;
    const ans = item.querySelector(".faq-a");
    if (ans) ans.style.maxHeight = ans.scrollHeight + "px";
  });
});