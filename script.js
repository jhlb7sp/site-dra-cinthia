// ===== CONFIG (edite aqui) =====
const CONFIG = {
  whatsappNumber: "5511968013319", // ex: 5511980562649
  whatsappMessage: "Olá! Quero agendar uma avaliação com a Dra. Cinthia Leone.",
  croText: "CRO: 126.543",
  addressText: "📍 Praça Barão de Macaúbas, 31 - Vila Formosa - São Paulo - SP, 03357-040",
  googleMapsLink: "https://www.google.com/maps/place/Dra+Cinthia+Leone+Cunha+-+Dentista/@-23.563236,-46.5597852,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce5d8c6b12106f:0x768202efae36b6de!8m2!3d-23.563236!4d-46.5572103!16s%2Fg%2F11ypllm6vp?entry=ttu&g_ep=EgoyMDI2MDEyMC4wIKXMDSoASAFQAw%3D%3D", // cole o link do Maps do consultório
  googleReviewsLink: "https://www.google.com/search?sca_esv=c9a82c01d27467b1&rlz=1C1FKPE_pt-PTBR1101BR1101&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOTSf1r9qnpVxKl4xoy13Dh8Rwhe_mrG2izFNyyKYH3VJ9kfeWhSy-uPGQuKfnyE3bI9lOb_ce5fdR0gzsaxmeaGH-Va-TKG-6B-2d8_Bnb4jIaUuDrbW-GMlATkQDBwo1fhX4WY%3D&q=Dra+Cinthia+Leone+Cunha+-+Dentista+Coment%C3%A1rios&sa=X&ved=2ahUKEwippsW2zKCSAxX-DLkGHVBhPBQQ0bkNegQINxAH", // opcional
};

// ===== Helpers =====
function buildWhatsAppLink(number, message) {
  const msg = encodeURIComponent(message || "");
  return `https://wa.me/${number}?text=${msg}`;
}

function setHref(id, href) {
  const el = document.getElementById(id);
  if (el) el.href = href;
}

function setupCTAs() {
  const wa = buildWhatsAppLink(CONFIG.whatsappNumber, CONFIG.whatsappMessage);
  ["btnHeaderCta","btnHeroCta","btnSobreCta","btnCasosCta","btnProcCta","btnLocCta","btnFooterCta","waFloat"]
    .forEach(id => setHref(id, wa));

  const cro = document.getElementById("croText");
  if (cro) cro.textContent = CONFIG.croText;

  const addr = document.getElementById("addressText");
  if (addr) addr.textContent = CONFIG.addressText;

  setHref("mapsLink", CONFIG.googleMapsLink);
  setHref("btnGoogleReviews", CONFIG.googleReviewsLink);

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

// ===== Carousel =====
function setupCarousel(root) {
  const track = root.querySelector("[data-track]");
  let items = Array.from(track.children);

  const btnPrev = root.querySelector("[data-prev]");
  const btnNext = root.querySelector("[data-next]");

  // Se já foi inicializado, evita duplicar clones
  if (root.dataset.inited === "1") return;
  root.dataset.inited = "1";

  // --- CLONES (último no começo, primeiro no fim) ---
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);

  firstClone.dataset.clone = "1";
  lastClone.dataset.clone = "1";

  track.insertBefore(lastClone, items[0]);
  track.appendChild(firstClone);

  // Atualiza lista de itens agora com clones
  items = Array.from(track.children);

  // Índice começa no 1 (primeiro item real, porque 0 é clone do último)
  let index = 1;

  // Dá destaque no item central (real)
  function markActive() {
    items.forEach((it) => it.classList.remove("is-active"));
    items[index].classList.add("is-active");
  }

  // Centraliza o item no meio do track
  function centerItem(i, behavior = "smooth") {
    const target = items[i];
    const trackRect = track.getBoundingClientRect();
    const itemRect = target.getBoundingClientRect();

    const currentScroll = track.scrollLeft;
    const delta =
      (itemRect.left - trackRect.left) - (trackRect.width / 2 - itemRect.width / 2);

    track.scrollTo({ left: currentScroll + delta, behavior });
  }

  // Primeiro posicionamento (sem animar)
  requestAnimationFrame(() => {
    markActive();
    centerItem(index, "auto");
  });

  // Move 1 passo
  function goTo(newIndex) {
    index = newIndex;
    markActive();
    centerItem(index, "smooth");
  }

  btnNext?.addEventListener("click", () => goTo(index + 1));
  btnPrev?.addEventListener("click", () => goTo(index - 1));

  // Depois que a animação termina, se estiver no clone, "teleporta" pro real
  let isJumping = false;
  track.addEventListener("scroll", () => {
    if (isJumping) return;

    // Debounce pra esperar parar de rolar
    clearTimeout(track._t);
    track._t = setTimeout(() => {
      const current = items[index];

      if (current?.dataset?.clone === "1") {
        isJumping = true;

        // Se estamos no clone do primeiro (no final), vai para o primeiro real
        if (index === items.length - 1) {
          index = 1;
        }
        // Se estamos no clone do último (no começo), vai para o último real
        else if (index === 0) {
          index = items.length - 2;
        }

        markActive();
        centerItem(index, "auto"); // teleporta sem animação
        isJumping = false;
      } else {
        // Recalcula o item mais central (se o usuário arrastar no mobile)
        const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;

        let best = index;
        let bestDist = Infinity;

        items.forEach((it, i) => {
          const r = it.getBoundingClientRect();
          const center = r.left + r.width / 2;
          const dist = Math.abs(center - trackCenter);
          if (dist < bestDist) { bestDist = dist; best = i; }
        });

        index = best;
        markActive();
      }
    }, 120);
  });

  // Melhor experiência no mobile: permitir arrastar e "snapping"
  track.style.scrollSnapType = "x mandatory";
  items.forEach((it) => (it.style.scrollSnapAlign = "center"));
}


// ===== Before/After =====
function setupBeforeAfter() {
  const wrap = document.querySelector("[data-before-after]");
  if (!wrap) return;

  const range = wrap.querySelector("[data-range]");
  const after = wrap.querySelector("[data-after]");
  const handle = wrap.querySelector("[data-handle]");

  function apply(val) {
    const v = Math.max(0, Math.min(100, Number(val)));
    after.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
    handle.style.left = `${v}%`;
    range.value = String(v);
  }

  function valueFromClientX(clientX) {
    const rect = wrap.getBoundingClientRect();
    const x = Math.max(rect.left, Math.min(rect.right, clientX));
    const pct = ((x - rect.left) / rect.width) * 100;
    return pct;
  }

  // Range continua funcionando
  range.addEventListener("input", (e) => apply(e.target.value));

  // Arrastar pela bolinha (handle) OU clicar/arrastar na imagem inteira
  let dragging = false;

  function onDown(e) {
    dragging = true;
    wrap.classList.add("is-dragging");

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    apply(valueFromClientX(clientX));

    e.preventDefault();
  }

  function onMove(e) {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    apply(valueFromClientX(clientX));
    e.preventDefault();
  }

  function onUp() {
    dragging = false;
    wrap.classList.remove("is-dragging");
  }

  // Eventos no handle
  handle.addEventListener("mousedown", onDown);
  handle.addEventListener("touchstart", onDown, { passive: false });

  // (Opcional mas recomendado) também permitir arrastar clicando na imagem
  wrap.addEventListener("mousedown", onDown);
  wrap.addEventListener("touchstart", onDown, { passive: false });

  window.addEventListener("mousemove", onMove);
  window.addEventListener("touchmove", onMove, { passive: false });

  window.addEventListener("mouseup", onUp);
  window.addEventListener("touchend", onUp);

  // Inicial
  apply(range.value || 50);
}


// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  setupCTAs();
  setupBeforeAfter();

  document.querySelectorAll("[data-carousel]").forEach(setupCarousel);
});

document.addEventListener("DOMContentLoaded", () => {
  const topBtn = document.getElementById("topFloat");

  if (topBtn) {
    // começa escondido (opcional)
    topBtn.classList.add("is-hidden");

    // mostra depois que descer um pouco
    window.addEventListener("scroll", () => {
      const show = window.scrollY > 500; // ajuste aqui
      topBtn.classList.toggle("is-hidden", !show);
    });

    // clique: rolar suave pro topo
    topBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

document.addEventListener("contextmenu", (e) => {
  // Bloqueia clique direito só em imagens
  if (e.target && e.target.tagName === "IMG") {
    e.preventDefault();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (!lightbox || !lightboxImg) return;

  const closeBtn = lightbox.querySelector(".lightbox__close");
  const overlay = lightbox.querySelector(".lightbox__overlay");

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Imagem ampliada";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  // Delegação: funciona mesmo com clones do carrossel
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".carousel img, .map-link img");
    if (!img) return;
    open(img.src, img.alt);
  });

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) close();
  });
});
