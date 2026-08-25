// =====================================================
// CONFIGURAÇÕES DO SITE
// =====================================================

const CONFIG = {
  whatsappNumber: "5511968013319",

  whatsappMessage:
    "Olá! Quero agendar uma avaliação com a Dra. Cinthia Leone.",

  croText: "CRO: 126.543",

  addressText:
    "📍 Praça Barão de Macaúbas, 31 - Vila Formosa - São Paulo - SP, 03357-040",

  googleMapsLink:
    "https://www.google.com/maps/place/Dra+Cinthia+Leone+Cunha+-+Dentista/@-23.563236,-46.5597852,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce5d8c6b12106f:0x768202efae36b6de!8m2!3d-23.563236!4d-46.5572103!16s%2Fg%2F11ypllm6vp?entry=ttu&g_ep=EgoyMDI2MDEyMC4wIKXMDSoASAFQAw%3D%3D",

  googleReviewsLink:
    "https://www.google.com/search?sca_esv=c9a82c01d27467b1&rlz=1C1FKPE_pt-PTBR1101BR1101&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOTSf1r9qnpVxKl4xoy13Dh8Rwhe_mrG2izFNyyKYH3VJ9kfeWhSy-uPGQuKfnyE3bI9lOb_ce5fdR0gzsaxmeaGH-Va-TKG-6B-2d8_Bnb4jIaUuDrbW-GMlATkQDBwo1fhX4WY%3D&q=Dra+Cinthia+Leone+Cunha+-+Dentista+Coment%C3%A1rios&sa=X&ved=2ahUKEwippsW2zKCSAxX-DLkGHVBhPBQQ0bkNegQINxAH",
};


// =====================================================
// HELPERS
// =====================================================

function buildWhatsAppLink(number, message) {
  const encodedMessage = encodeURIComponent(message || "");

  return `https://wa.me/${number}?text=${encodedMessage}`;
}


function setHref(id, href) {
  const element = document.getElementById(id);

  if (element && href) {
    element.href = href;
  }
}


// =====================================================
// CONFIGURA CTAs / INFORMAÇÕES
// =====================================================

function setupCTAs() {
  const whatsappLink = buildWhatsAppLink(
    CONFIG.whatsappNumber,
    CONFIG.whatsappMessage
  );


  const whatsappButtons = [
    "btnHeaderCta",
    "btnMobileCta",
    "btnHeroCta",
    "btnSobreCta",
    "btnCasosCta",
    "btnAntesDepoisCta",
    "btnProcCta",
    "btnConsultationCta",
    "btnLocCta",
    "btnFooterCta",
    "waFloat",
  ];


  whatsappButtons.forEach((id) => {
    setHref(id, whatsappLink);
  });


  // CRO principal
  const cro = document.getElementById("croText");

  if (cro) {
    cro.textContent = CONFIG.croText;
  }


  // CRO footer
  const footerCro =
    document.getElementById("footerCro");

  if (footerCro) {
    footerCro.textContent = CONFIG.croText;
  }


  // Endereço
  const address =
    document.getElementById("addressText");

  if (address) {
    address.textContent = CONFIG.addressText;
  }


  // Google Maps
  setHref(
    "mapsLink",
    CONFIG.googleMapsLink
  );


  // Avaliações
  setHref(
    "btnGoogleReviews",
    CONFIG.googleReviewsLink
  );


  // Ano
  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }
}


// =====================================================
// GALERIAS DINÂMICAS
//
// galerias.js cria:
//
// window.GALERIAS = {
//   casos: [],
//   antesdepois: [],
//   nossaclinica: []
// };
// =====================================================

function setupGalleries() {
  const tracks =
    document.querySelectorAll(
      "[data-gallery]"
    );


  tracks.forEach((track) => {
    renderGallery(track);
  });
}


function renderGallery(track) {
  const galleryName =
    track.dataset.gallery;


  if (!galleryName) {
    return;
  }


  if (!window.GALERIAS) {
    console.warn(
      "GALERIAS não encontrada. Verifique se galerias.js está carregando antes de script.js."
    );

    return;
  }


  const images =
    window.GALERIAS[galleryName];


  if (!Array.isArray(images)) {
    console.warn(
      `Galeria "${galleryName}" não encontrada em galerias.js.`
    );

    return;
  }


  track.innerHTML = "";


  if (images.length === 0) {
    console.warn(
      `Nenhuma imagem encontrada na galeria "${galleryName}".`
    );

    return;
  }


  images.forEach(
    (imagePath, index) => {

      const item =
        document.createElement("div");


      item.className =
        "carousel__item";


      if (index === 0) {
        item.classList.add(
          "is-active"
        );
      }


      const image =
        document.createElement("img");


      image.src =
        imagePath;


      image.alt =
        buildGalleryAlt(
          galleryName,
          index
        );


      image.loading =
        "lazy";


      image.decoding =
        "async";


      image.addEventListener(
        "error",
        () => {

          console.warn(
            `Não foi possível carregar: ${imagePath}`
          );


          item.remove();

        }
      );


      item.appendChild(image);

      track.appendChild(item);

    }
  );
}


// =====================================================
// ALT DAS GALERIAS
// =====================================================

function buildGalleryAlt(
  galleryName,
  index
) {
  const number =
    index + 1;


  switch (galleryName) {

    case "casos":
      return `Caso clínico ${number} da Dra. Cinthia Leone`;


    case "antesdepois":
      return `Resultado antes e depois ${number} da Dra. Cinthia Leone`;


    case "nossaclinica":
      return `Consultório da Dra. Cinthia Leone - foto ${number}`;


    default:
      return `Imagem ${number}`;

  }
}


// =====================================================
// CARROSSEL
// =====================================================

function setupCarousel(root) {
  const track =
    root.querySelector(
      "[data-track]"
    );


  if (!track) {
    return;
  }


  if (
    root.dataset.inited === "1"
  ) {
    return;
  }


  let items =
    Array.from(
      track.children
    );


  const btnPrev =
    root.querySelector(
      "[data-prev]"
    );


  const btnNext =
    root.querySelector(
      "[data-next]"
    );


  // =================================================
  // ZERO IMAGENS / ITENS
  // =================================================

  if (
    items.length === 0
  ) {

    hideCarouselButtons(
      btnPrev,
      btnNext
    );


    return;
  }


  // =================================================
  // UM ITEM
  // =================================================

  if (
    items.length === 1
  ) {

    root.dataset.inited =
      "1";


    items[0].classList.add(
      "is-active"
    );


    items[0].style.scrollSnapAlign =
      "center";


    hideCarouselButtons(
      btnPrev,
      btnNext
    );


    requestAnimationFrame(
      () => {

        centerElement(
          track,
          items[0],
          "auto"
        );

      }
    );


    return;
  }


  root.dataset.inited =
    "1";


  // =================================================
  // CLONES PARA LOOP
  // =================================================

  const firstClone =
    items[0].cloneNode(true);


  const lastClone =
    items[
      items.length - 1
    ].cloneNode(true);


  firstClone.dataset.clone =
    "1";


  lastClone.dataset.clone =
    "1";


  track.insertBefore(
    lastClone,
    items[0]
  );


  track.appendChild(
    firstClone
  );


  items =
    Array.from(
      track.children
    );


  // Índice 0 = clone do último
  // Índice 1 = primeiro real

  let index = 1;

  let isJumping =
    false;


  // =================================================
  // ACTIVE
  // =================================================

  function markActive() {
    items.forEach(
      (item) => {

        item.classList.remove(
          "is-active"
        );

      }
    );


    if (items[index]) {
      items[index].classList.add(
        "is-active"
      );
    }
  }


  // =================================================
  // CENTRALIZA
  // =================================================

  function centerCurrent(
    behavior = "smooth"
  ) {
    const target =
      items[index];


    if (!target) {
      return;
    }


    centerElement(
      track,
      target,
      behavior
    );
  }


  // =================================================
  // IR PARA
  // =================================================

  function goTo(
    newIndex
  ) {

    if (
      newIndex < 0 ||
      newIndex >= items.length
    ) {
      return;
    }


    index =
      newIndex;


    markActive();

    centerCurrent(
      "smooth"
    );

  }


  // =================================================
  // POSIÇÃO INICIAL
  // =================================================

  requestAnimationFrame(
    () => {

      markActive();

      centerCurrent(
        "auto"
      );

    }
  );


  // =================================================
  // BOTÕES
  // =================================================

  btnNext?.addEventListener(
    "click",
    () => {

      goTo(
        index + 1
      );

    }
  );


  btnPrev?.addEventListener(
    "click",
    () => {

      goTo(
        index - 1
      );

    }
  );


  // =================================================
  // SCROLL / LOOP
  // =================================================

  track.addEventListener(
    "scroll",
    () => {

      if (isJumping) {
        return;
      }


      clearTimeout(
        track._scrollTimer
      );


      track._scrollTimer =
        setTimeout(
          () => {

            const current =
              items[index];


            // =========================================
            // CLONE
            // =========================================

            if (
              current?.dataset?.clone === "1"
            ) {

              isJumping =
                true;


              // Clone do primeiro
              if (
                index ===
                items.length - 1
              ) {

                index = 1;

              }


              // Clone do último
              else if (
                index === 0
              ) {

                index =
                  items.length - 2;

              }


              markActive();

              centerCurrent(
                "auto"
              );


              requestAnimationFrame(
                () => {

                  isJumping =
                    false;

                }
              );


              return;
            }


            // =========================================
            // DESCOBRE ITEM CENTRAL
            // =========================================

            index =
              getClosestCenteredIndex(
                track,
                items,
                index
              );


            markActive();


            // =========================================
            // SE O USUÁRIO PAROU EXATAMENTE
            // NUM CLONE, FAZ O TELEPORTE
            // =========================================

            if (
              items[index]
                ?.dataset
                ?.clone === "1"
            ) {

              isJumping =
                true;


              if (
                index ===
                items.length - 1
              ) {

                index = 1;

              }

              else if (
                index === 0
              ) {

                index =
                  items.length - 2;

              }


              markActive();

              centerCurrent(
                "auto"
              );


              requestAnimationFrame(
                () => {

                  isJumping =
                    false;

                }
              );

            }

          },

          140
        );

    }
  );


  // =================================================
  // SNAP
  // =================================================

  track.style.scrollSnapType =
    "x mandatory";


  items.forEach(
    (item) => {

      item.style.scrollSnapAlign =
        "center";

    }
  );


  // =================================================
  // RESIZE
  // =================================================

  let resizeTimer;


  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          () => {

            centerCurrent(
              "auto"
            );

          },

          150
        );

    }
  );
}


// =====================================================
// AUXILIAR - CENTRALIZA ELEMENTO
// =====================================================

function centerElement(
  track,
  target,
  behavior = "smooth"
) {

  if (
    !track ||
    !target
  ) {
    return;
  }


  const trackRect =
    track.getBoundingClientRect();


  const itemRect =
    target.getBoundingClientRect();


  const currentScroll =
    track.scrollLeft;


  const delta =
    (
      itemRect.left -
      trackRect.left
    )
    -
    (
      trackRect.width / 2 -
      itemRect.width / 2
    );


  track.scrollTo({
    left:
      currentScroll +
      delta,

    behavior,
  });
}


// =====================================================
// AUXILIAR - ITEM MAIS CENTRAL
// =====================================================

function getClosestCenteredIndex(
  track,
  items,
  fallbackIndex = 0
) {

  const trackRect =
    track.getBoundingClientRect();


  const trackCenter =
    trackRect.left +
    track.clientWidth / 2;


  let bestIndex =
    fallbackIndex;


  let bestDistance =
    Infinity;


  items.forEach(
    (item, itemIndex) => {

      const rect =
        item.getBoundingClientRect();


      const center =
        rect.left +
        rect.width / 2;


      const distance =
        Math.abs(
          center -
          trackCenter
        );


      if (
        distance <
        bestDistance
      ) {

        bestDistance =
          distance;


        bestIndex =
          itemIndex;

      }

    }
  );


  return bestIndex;
}


// =====================================================
// ESCONDE SETAS
// =====================================================

function hideCarouselButtons(
  btnPrev,
  btnNext
) {

  if (btnPrev) {
    btnPrev.style.display =
      "none";
  }


  if (btnNext) {
    btnNext.style.display =
      "none";
  }
}


// =====================================================
// MENU MOBILE
// =====================================================

function setupMobileMenu() {
  const menuToggle =
    document.getElementById(
      "menuToggle"
    );


  const mobileNav =
    document.getElementById(
      "mobileNav"
    );


  if (
    !menuToggle ||
    !mobileNav
  ) {
    return;
  }


  function openMenu() {
    menuToggle.classList.add(
      "is-active"
    );


    mobileNav.classList.add(
      "is-open"
    );


    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );


    menuToggle.setAttribute(
      "aria-label",
      "Fechar menu"
    );


    document.body.classList.add(
      "menu-open"
    );
  }


  function closeMenu() {
    menuToggle.classList.remove(
      "is-active"
    );


    mobileNav.classList.remove(
      "is-open"
    );


    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );


    menuToggle.setAttribute(
      "aria-label",
      "Abrir menu"
    );


    document.body.classList.remove(
      "menu-open"
    );
  }


  function toggleMenu() {
    const isOpen =
      mobileNav.classList.contains(
        "is-open"
      );


    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }


  menuToggle.addEventListener(
    "click",
    toggleMenu
  );


  // Fecha ao navegar
  mobileNav
    .querySelectorAll("a")
    .forEach(
      (link) => {

        link.addEventListener(
          "click",
          closeMenu
        );

      }
    );


  // Fecha com ESC
  window.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        mobileNav.classList.contains(
          "is-open"
        )
      ) {

        closeMenu();

      }

    }
  );


  // Se aumentar tela para desktop,
  // fecha o menu mobile.
  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth >
        1050
      ) {

        closeMenu();

      }

    }
  );
}


// =====================================================
// HEADER AO ROLAR
// =====================================================

function setupHeaderScroll() {
  const header =
    document.querySelector(
      ".header"
    );


  if (!header) {
    return;
  }


  function update() {
    const hasScrolled =
      window.scrollY > 20;


    header.classList.toggle(
      "is-scrolled",
      hasScrolled
    );
  }


  update();


  window.addEventListener(
    "scroll",
    update,
    {
      passive: true,
    }
  );
}


// =====================================================
// VOLTAR AO TOPO
// =====================================================

function setupTopButton() {
  const topButton =
    document.getElementById(
      "topFloat"
    );


  if (!topButton) {
    return;
  }


  function updateVisibility() {
    const shouldShow =
      window.scrollY > 600;


    topButton.classList.toggle(
      "is-hidden",
      !shouldShow
    );
  }


  updateVisibility();


  window.addEventListener(
    "scroll",
    updateVisibility,
    {
      passive: true,
    }
  );


  topButton.addEventListener(
    "click",
    (event) => {

      event.preventDefault();


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    }
  );
}


// =====================================================
// LIGHTBOX
// =====================================================

function setupLightbox() {
  const lightbox =
    document.getElementById(
      "lightbox"
    );


  const lightboxImage =
    document.getElementById(
      "lightboxImg"
    );


  if (
    !lightbox ||
    !lightboxImage
  ) {
    return;
  }


  const closeButton =
    lightbox.querySelector(
      ".lightbox__close"
    );


  const overlay =
    lightbox.querySelector(
      ".lightbox__overlay"
    );


  function openLightbox(
    src,
    alt
  ) {

    lightboxImage.src =
      src;


    lightboxImage.alt =
      alt ||
      "Imagem ampliada";


    lightbox.classList.add(
      "is-open"
    );


    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";


    closeButton?.focus();

  }


  function closeLightbox() {
    lightbox.classList.remove(
      "is-open"
    );


    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "";


    lightboxImage.src =
      "";

  }


  // Delegação:
  // funciona inclusive com os clones
  // criados dinamicamente pelos carrosséis.
  document.addEventListener(
    "click",
    (event) => {

      const image =
        event.target.closest(
          ".carousel img"
        );


      if (!image) {
        return;
      }


      openLightbox(
        image.src,
        image.alt
      );

    }
  );


  closeButton?.addEventListener(
    "click",
    closeLightbox
  );


  overlay?.addEventListener(
    "click",
    closeLightbox
  );


  window.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        lightbox.classList.contains(
          "is-open"
        )
      ) {

        closeLightbox();

      }

    }
  );
}


// =====================================================
// PROTEÇÃO BÁSICA DE IMAGENS
// =====================================================

function setupImageProtection() {
  document.addEventListener(
    "contextmenu",
    (event) => {

      const image =
        event.target.closest(
          "img"
        );


      if (image) {
        event.preventDefault();
      }

    }
  );


  document.addEventListener(
    "dragstart",
    (event) => {

      if (
        event.target
          ?.tagName === "IMG"
      ) {

        event.preventDefault();

      }

    }
  );
}


// =====================================================
// SCROLL SUAVE PARA ÂNCORAS INTERNAS
// =====================================================

function setupAnchorNavigation() {
  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(
      (link) => {

        const href =
          link.getAttribute(
            "href"
          );


        if (
          !href ||
          href === "#"
        ) {
          return;
        }


        link.addEventListener(
          "click",
          (event) => {

            const target =
              document.querySelector(
                href
              );


            if (!target) {
              return;
            }


            event.preventDefault();


            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });

          }
        );

      }
    );
}
// =====================================================
// GOOGLE ANALYTICS - EVENTOS PERSONALIZADOS
// =====================================================

function setupAnalyticsEvents() {

  function sendAnalyticsEvent(eventName, params = {}) {

    if (typeof gtag !== "function") {
      console.warn(
        `Google Analytics ainda não disponível para o evento: ${eventName}`
      );

      return;
    }


    gtag(
      "event",
      eventName,
      params
    );

  }


  // =================================================
  // BOTÕES DE AGENDAMENTO
  // =================================================

  const appointmentButtons = {
    btnHeaderCta: "header",
    btnMobileCta: "menu_mobile",
    btnHeroCta: "hero",
    btnSobreCta: "sobre",
    btnCasosCta: "casos",
    btnAntesDepoisCta: "antes_depois",
    btnProcCta: "tratamentos",
    btnConsultationCta: "cta_final",
    btnLocCta: "localizacao",
    btnFooterCta: "footer",
  };


  Object.entries(
    appointmentButtons
  ).forEach(
    ([id, location]) => {

      const button =
        document.getElementById(id);


      if (!button) {
        return;
      }


      button.addEventListener(
        "click",
        () => {

          sendAnalyticsEvent(
            "agendar_consulta",
            {
              button_location:
                location,

              button_text:
                button.textContent.trim(),

              link_url:
                button.href || "",
            }
          );

        }
      );

    }
  );


  // =================================================
  // WHATSAPP FLUTUANTE
  // =================================================

  const whatsappFloat =
    document.getElementById(
      "waFloat"
    );


  if (whatsappFloat) {

    whatsappFloat.addEventListener(
      "click",
      () => {

        sendAnalyticsEvent(
          "whatsapp_click",
          {
            button_location:
              "flutuante",

            button_text:
              "WhatsApp flutuante",

            link_url:
              whatsappFloat.href || "",
          }
        );

      }
    );

  }


  // =================================================
  // GOOGLE MAPS
  // =================================================

  const mapsLink =
    document.getElementById(
      "mapsLink"
    );


  if (mapsLink) {

    mapsLink.addEventListener(
      "click",
      () => {

        sendAnalyticsEvent(
          "ver_localizacao",
          {
            button_location:
              "mapa",

            button_text:
              mapsLink.textContent.trim(),

            link_url:
              mapsLink.href || "",
          }
        );

      }
    );

  }

}

// =====================================================
// COMPARADOR ANTES / DEPOIS
// =====================================================

function setupBeforeAfter() {

  const wrapper =
    document.querySelector(
      "[data-before-after]"
    );


  if (!wrapper) {
    return;
  }


  const range =
    wrapper.querySelector(
      "[data-range]"
    );


  const before =
    wrapper.querySelector(
      "[data-before]"
    );


  const handle =
    wrapper.querySelector(
      "[data-handle]"
    );


  if (
    !range ||
    !before ||
    !handle
  ) {
    return;
  }


  // =================================================
  // APLICA POSIÇÃO
  // =================================================

  function apply(value) {

    const position =
      Math.max(
        0,
        Math.min(
          100,
          Number(value)
        )
      );


    before.style.clipPath =
      `inset(0 ${100 - position}% 0 0)`;


    handle.style.left =
      `${position}%`;


    range.value =
      String(position);

  }


  // =================================================
  // POSIÇÃO DO MOUSE / TOQUE
  // =================================================

  function positionFromX(clientX) {

    const rect =
      wrapper.getBoundingClientRect();


    const x =
      Math.max(
        rect.left,
        Math.min(
          rect.right,
          clientX
        )
      );


    return (
      (
        x -
        rect.left
      ) /
      rect.width
    ) * 100;

  }


  // =================================================
  // RANGE
  // Permite teclado / acessibilidade
  // =================================================

  range.addEventListener(
    "input",
    (event) => {

      apply(
        event.target.value
      );

    }
  );


  // =================================================
  // POINTER EVENTS
  // Mouse + touch
  // =================================================

  let dragging =
    false;


  wrapper.addEventListener(
    "pointerdown",
    (event) => {

      dragging =
        true;


      wrapper.classList.add(
        "is-dragging"
      );


      try {

        wrapper.setPointerCapture(
          event.pointerId
        );

      } catch (_) { }


      apply(
        positionFromX(
          event.clientX
        )
      );

    }
  );


  wrapper.addEventListener(
    "pointermove",
    (event) => {

      if (!dragging) {
        return;
      }


      apply(
        positionFromX(
          event.clientX
        )
      );

    }
  );


  function stopDragging(
    event
  ) {

    dragging =
      false;


    wrapper.classList.remove(
      "is-dragging"
    );


    if (
      event?.pointerId !==
      undefined
    ) {

      try {

        wrapper.releasePointerCapture(
          event.pointerId
        );

      } catch (_) { }

    }

  }


  wrapper.addEventListener(
    "pointerup",
    stopDragging
  );


  wrapper.addEventListener(
    "pointercancel",
    stopDragging
  );


  // =================================================
  // INICIAL
  // =================================================

  apply(
    range.value || 50
  );

}

// =====================================================
// INICIALIZAÇÃO
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    // -----------------------------------------------
    // Informações e links
    // -----------------------------------------------

    setupCTAs();
    setupBeforeAfter();
    setupAnalyticsEvents();
    // -----------------------------------------------
    // Galerias primeiro
    // -----------------------------------------------

    setupGalleries();


    // -----------------------------------------------
    // Carrosséis depois
    // -----------------------------------------------

    document
      .querySelectorAll(
        "[data-carousel]"
      )
      .forEach(
        setupCarousel
      );


    // -----------------------------------------------
    // Menu
    // -----------------------------------------------

    setupMobileMenu();


    // -----------------------------------------------
    // Header
    // -----------------------------------------------

    setupHeaderScroll();


    // -----------------------------------------------
    // Topo
    // -----------------------------------------------

    setupTopButton();


    // -----------------------------------------------
    // Lightbox
    // -----------------------------------------------

    setupLightbox();


    // -----------------------------------------------
    // Proteção básica
    // -----------------------------------------------

    setupImageProtection();


    // -----------------------------------------------
    // Navegação
    // -----------------------------------------------

    setupAnchorNavigation();

  }
);