/* =========================================================
   ELITE BAGS — APP.JS
   Common website functionality
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     BASIC SETTINGS
     --------------------------------------------------------- */

  const site = window.STORE || {
    name: "Elite Bags",
    email: "luxuriouselitebags@gmail.com",
    whatsapp: "+1 208-903-4508",
    whatsappLink: "https://wa.me/12089034508",
    tiktok: "https://www.tiktok.com/@elite.bagss",
    address: "Guang Zhou Shi, Guang Dong Sheng, China",
    quality: "Master Quality",
    shipping: "Free Worldwide Shipping",
    delivery: "9–13 Working Days"
  };

  const products = Array.isArray(window.PRODUCTS)
    ? window.PRODUCTS
    : [];

  /* ---------------------------------------------------------
     GLOBAL OBJECT
     --------------------------------------------------------- */

  window.EliteBags = {
    products: products,
    store: site,

    getProduct: function (id) {
      return products.find(function (product) {
        return String(product.id) === String(id);
      });
    },

    getProductsByCategory: function (category) {
      return products.filter(function (product) {
        return String(product.category || "").toLowerCase() ===
          String(category || "").toLowerCase();
      });
    },

    whatsapp: function (message) {
      const text = encodeURIComponent(
        message || "Hello Elite Bags, I would like to know more about your products."
      );

      window.open(
        site.whatsappLink + "?text=" + text,
        "_blank",
        "noopener,noreferrer"
      );
    },

    productMessage: function (product) {
      if (!product) return "";

      return (
        "Hello Elite Bags 👋\n\n" +
        "I am interested in:\n" +
        product.name +
        "\n\n" +
        "Product ID: " +
        product.id +
        "\n" +
        "Price: $" +
        product.price +
        "\n\n" +
        "Please send me the details and availability."
      );
    }
  };

  /* ---------------------------------------------------------
     PAGE READY
     --------------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", function () {

    addAnimationSystem();

    setupScrollReveal();

    setupImageFallbacks();

    setupLazyImages();

    setupProductLinks();

    setupProductPage();

    setupDynamicProductGrids();

    setupGenericWhatsAppButtons();

    setupSmoothAnchors();

    setupHeaderScroll();

    setupBackToTop();

    setupCurrentYear();

    markPageReady();

  });


  /* =========================================================
     ANIMATION SYSTEM
     ========================================================= */

  function addAnimationSystem() {

    if (document.getElementById("elite-animation-system")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "elite-animation-system";

    style.textContent = `
      .elite-reveal {
        opacity: 0;
        transform: translateY(35px);
        transition:
          opacity .8s ease,
          transform .8s cubic-bezier(.22,.61,.36,1);
      }

      .elite-reveal.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      .elite-reveal-left {
        opacity: 0;
        transform: translateX(-40px);
        transition:
          opacity .8s ease,
          transform .8s cubic-bezier(.22,.61,.36,1);
      }

      .elite-reveal-left.is-visible {
        opacity: 1;
        transform: translateX(0);
      }

      .elite-reveal-right {
        opacity: 0;
        transform: translateX(40px);
        transition:
          opacity .8s ease,
          transform .8s cubic-bezier(.22,.61,.36,1);
      }

      .elite-reveal-right.is-visible {
        opacity: 1;
        transform: translateX(0);
      }

      .elite-scale {
        opacity: 0;
        transform: scale(.92);
        transition:
          opacity .8s ease,
          transform .8s cubic-bezier(.22,.61,.36,1);
      }

      .elite-scale.is-visible {
        opacity: 1;
        transform: scale(1);
      }

      .elite-stagger {
        opacity: 0;
        transform: translateY(25px);
        transition:
          opacity .7s ease,
          transform .7s cubic-bezier(.22,.61,.36,1);
      }

      .elite-stagger.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      .elite-delay-1 {
        transition-delay: .08s;
      }

      .elite-delay-2 {
        transition-delay: .16s;
      }

      .elite-delay-3 {
        transition-delay: .24s;
      }

      .elite-delay-4 {
        transition-delay: .32s;
      }

      .elite-delay-5 {
        transition-delay: .40s;
      }

      .elite-delay-6 {
        transition-delay: .48s;
      }

      .elite-image-hover {
        overflow: hidden;
      }

      .elite-image-hover img {
        transition:
          transform .7s cubic-bezier(.22,.61,.36,1),
          filter .5s ease;
      }

      .elite-image-hover:hover img {
        transform: scale(1.06);
      }

      @media (prefers-reduced-motion: reduce) {
        .elite-reveal,
        .elite-reveal-left,
        .elite-reveal-right,
        .elite-scale,
        .elite-stagger {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }

        .elite-image-hover img {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }


  /* =========================================================
     SCROLL REVEAL
     ========================================================= */

  function setupScrollReveal() {

    const selectors = [
      ".hero",
      ".trust",
      ".trust-strip",
      ".categories",
      ".category-card",
      ".featured",
      ".product-card",
      ".standard",
      ".standard-card",
      ".elite-standard",
      ".steps",
      ".step",
      ".how-it-works",
      ".cta",
      ".contact",
      ".footer",
      ".section-title"
    ];

    const elements = [];

    selectors.forEach(function (selector) {

      document.querySelectorAll(selector).forEach(function (element) {

        if (
          !element.classList.contains("elite-reveal") &&
          !element.classList.contains("elite-scale")
        ) {
          element.classList.add("elite-reveal");
        }

        elements.push(element);
      });

    });

    if (!elements.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {

      elements.forEach(function (element) {
        element.classList.add("is-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add("is-visible");

            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }


  /* =========================================================
     IMAGE FALLBACKS
     ========================================================= */

  function setupImageFallbacks() {

    document.querySelectorAll("img").forEach(function (image) {

      if (image.dataset.fallbackReady === "true") {
        return;
      }

      image.dataset.fallbackReady = "true";

      image.addEventListener("error", function () {

        if (image.dataset.fallbackUsed === "true") {
          return;
        }

        image.dataset.fallbackUsed = "true";

        image.src =
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="800"
                 height="800"
                 viewBox="0 0 800 800">

              <rect width="800" height="800" fill="#0b0d10"/>

              <circle
                cx="400"
                cy="350"
                r="115"
                fill="none"
                stroke="#ff1738"
                stroke-width="8"/>

              <text
                x="400"
                y="380"
                text-anchor="middle"
                fill="#ffffff"
                font-size="92"
                font-family="Arial, sans-serif"
                font-weight="700">
                EB
              </text>

              <text
                x="400"
                y="540"
                text-anchor="middle"
                fill="#aaaaaa"
                font-size="28"
                font-family="Arial, sans-serif"
                letter-spacing="5">
                ELITE BAGS
              </text>

            </svg>
          `);

      });

    });
  }


  /* =========================================================
     LAZY LOAD IMAGES
     ========================================================= */

  function setupLazyImages() {

    document.querySelectorAll("img").forEach(function (image) {

      if (!image.hasAttribute("loading")) {
        image.setAttribute("loading", "lazy");
      }

      if (!image.hasAttribute("decoding")) {
        image.setAttribute("decoding", "async");
      }

    });
  }


  /* =========================================================
     PRODUCT LINKS
     ========================================================= */

  function setupProductLinks() {

    document.querySelectorAll("[data-product-id]").forEach(function (element) {

      const id = element.getAttribute("data-product-id");

      if (!id) {
        return;
      }

      if (
        element.tagName.toLowerCase() === "a" &&
        !element.getAttribute("href")
      ) {
        element.setAttribute(
          "href",
          "product.html?id=" + encodeURIComponent(id)
        );
      }

      if (
        element.tagName.toLowerCase() !== "a" &&
        !element.dataset.productLinkReady
      ) {

        element.dataset.productLinkReady = "true";

        element.style.cursor = "pointer";

        element.addEventListener("click", function () {

          window.location.href =
            "product.html?id=" +
            encodeURIComponent(id);

        });

      }

    });
  }


  /* =========================================================
     PRODUCT DETAIL PAGE
     ========================================================= */

  function setupProductPage() {

    const page = document.querySelector("[data-product-page]");

    if (!page) {
      return;
    }

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) {
      return;
    }

    const product = window.EliteBags.getProduct(id);

    if (!product) {
      return;
    }

    document.title =
      product.name + " | Elite Bags";

    const nameElements =
      document.querySelectorAll("[data-product-name]");

    nameElements.forEach(function (element) {
      element.textContent = product.name;
    });

    const priceElements =
      document.querySelectorAll("[data-product-price]");

    priceElements.forEach(function (element) {
      element.textContent = "$" + product.price;
    });

    const categoryElements =
      document.querySelectorAll("[data-product-category]");

    categoryElements.forEach(function (element) {
      element.textContent = product.category || "";
    });

    const descriptionElements =
      document.querySelectorAll("[data-product-description]");

    descriptionElements.forEach(function (element) {
      element.textContent = product.description || "";
    });

    const imageElements =
      document.querySelectorAll("[data-product-image]");

    if (product.images && product.images.length) {

      imageElements.forEach(function (image, index) {

        const source =
          product.images[index] ||
          product.images[0];

        if (source) {
          image.src = source;
          image.alt = product.name;
        }

      });

    }

    document.querySelectorAll("[data-product-order]").forEach(function (button) {

      button.addEventListener("click", function () {

        window.EliteBags.whatsapp(
          window.EliteBags.productMessage(product)
        );

      });

    });
  }


  /* =========================================================
     DYNAMIC PRODUCT GRIDS
     
     Any future page can use:
     <div data-products="Bags"></div>
     
     or:
     <div data-products="Shoes"></div>
     
     ========================================================= */

  function setupDynamicProductGrids() {

    document.querySelectorAll("[data-products]").forEach(function (grid) {

      const category =
        grid.getAttribute("data-products");

      let list = products.slice();

      if (
        category &&
        category.toLowerCase() !== "all"
      ) {
        list = products.filter(function (product) {
          return String(product.category || "")
            .toLowerCase() ===
            category.toLowerCase();
        });
      }

      renderProductGrid(grid, list);

    });
  }


  function renderProductGrid(grid, list) {

    if (!grid) {
      return;
    }

    if (!list.length) {

      grid.innerHTML = `
        <div class="empty-products">
          <div class="empty-products-icon">EB</div>
          <h3>Coming Soon</h3>
          <p>New pieces are being added to this collection.</p>
        </div>
      `;

      return;
    }

    grid.innerHTML = list.map(function (product) {

      const image =
        product.images &&
        product.images.length
          ? product.images[0]
          : "";

      const badge =
        product.badge
          ? `<span class="product-badge">${escapeHTML(product.badge)}</span>`
          : "";

      return `
        <article
          class="product-card elite-stagger"
          data-product-card
          data-category="${escapeHTML(product.category || "")}"
          data-product-id="${escapeHTML(String(product.id))}">

          <a
            class="product-image elite-image-hover"
            href="product.html?id=${encodeURIComponent(product.id)}">

            ${badge}

            ${
              image
                ? `
                  <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    decoding="async">
                `
                : `
                  <div class="product-placeholder">
                    <strong>EB</strong>
                  </div>
                `
            }

          </a>

          <div class="product-info">

            <span class="product-category">
              ${escapeHTML(product.category || "")}
            </span>

            <h3>
              <a
                href="product.html?id=${encodeURIComponent(product.id)}">
                ${escapeHTML(product.name)}
              </a>
            </h3>

            <div class="product-bottom">

              <strong class="product-price">
                $${escapeHTML(String(product.price))}
              </strong>

              <button
                type="button"
                class="product-order"
                data-order-product="${escapeHTML(String(product.id))}">
                WhatsApp
              </button>

            </div>

          </div>

        </article>
      `;

    }).join("");

    setupImageFallbacks();

    setupProductLinks();

    setupDynamicOrderButtons(grid);

    requestAnimationFrame(function () {

      grid.querySelectorAll(".elite-stagger").forEach(function (element, index) {

        element.classList.add(
          "elite-delay-" + Math.min(index + 1, 6)
        );

        requestAnimationFrame(function () {
          element.classList.add("is-visible");
        });

      });

    });
  }


  /* =========================================================
     DYNAMIC WHATSAPP ORDER BUTTONS
     ========================================================= */

  function setupDynamicOrderButtons(container) {

    container
      .querySelectorAll("[data-order-product]")
      .forEach(function (button) {

        if (button.dataset.orderReady === "true") {
          return;
        }

        button.dataset.orderReady = "true";

        button.addEventListener("click", function (event) {

          event.preventDefault();

          event.stopPropagation();

          const id =
            button.getAttribute("data-order-product");

          const product =
            window.EliteBags.getProduct(id);

          if (!product) {
            return;
          }

          window.EliteBags.whatsapp(
            window.EliteBags.productMessage(product)
          );

        });

      });
  }


  /* =========================================================
     GENERIC WHATSAPP BUTTONS
     
     Use:
     data-whatsapp
     
     ========================================================= */

  function setupGenericWhatsAppButtons() {

    document
      .querySelectorAll("[data-whatsapp]")
      .forEach(function (button) {

        if (button.dataset.whatsappReady === "true") {
          return;
        }

        button.dataset.whatsappReady = "true";

        button.addEventListener("click", function (event) {

          event.preventDefault();

          const customMessage =
            button.getAttribute("data-whatsapp");

          window.EliteBags.whatsapp(
            customMessage ||
            "Hello Elite Bags 👋 I would like to know more about your collection."
          );

        });

      });
  }


  /* =========================================================
     SMOOTH ANCHOR LINKS
     ========================================================= */

  function setupSmoothAnchors() {

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

      if (link.dataset.smoothReady === "true") {
        return;
      }

      link.dataset.smoothReady = "true";

      link.addEventListener("click", function (event) {

        const targetID =
          link.getAttribute("href");

        if (
          !targetID ||
          targetID === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(targetID);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      });

    });
  }


  /* =========================================================
     HEADER SCROLL EFFECT
     ========================================================= */

  function setupHeaderScroll() {

    const header =
      document.querySelector("header");

    if (!header) {
      return;
    }

    function updateHeader() {

      if (window.scrollY > 30) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }

    }

    updateHeader();

    window.addEventListener(
      "scroll",
      updateHeader,
      { passive: true }
    );
  }


  /* =========================================================
     BACK TO TOP
     ========================================================= */

  function setupBackToTop() {

    const button =
      document.querySelector("[data-back-top]");

    if (!button) {
      return;
    }

    function update() {

      if (window.scrollY > 600) {
        button.classList.add("show");
      } else {
        button.classList.remove("show");
      }

    }

    window.addEventListener(
      "scroll",
      update,
      { passive: true }
    );

    button.addEventListener("click", function () {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

    update();
  }


  /* =========================================================
     CURRENT YEAR
     ========================================================= */

  function setupCurrentYear() {

    const year =
      new Date().getFullYear();

    document.querySelectorAll("[data-year]").forEach(function (element) {
      element.textContent = year;
    });
  }


  /* =========================================================
     PAGE READY CLASS
     ========================================================= */

  function markPageReady() {

    requestAnimationFrame(function () {

      document.documentElement.classList.add(
        "elite-page-ready"
      );

      document.body.classList.add(
        "elite-page-ready"
      );

    });
  }


  /* =========================================================
     SECURITY / HTML ESCAPE
     ========================================================= */

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =========================================================
     PUBLIC SEARCH HELPER
     ========================================================= */

  window.EliteBags.searchProducts = function (query) {

    const search =
      String(query || "")
        .trim()
        .toLowerCase();

    if (!search) {
      return products.slice();
    }

    return products.filter(function (product) {

      const searchable = [
        product.id,
        product.name,
        product.category,
        product.subcategory,
        product.color,
        product.material,
        product.description
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(search);

    });
  };


  /* =========================================================
     PUBLIC CATEGORY HELPER
     ========================================================= */

  window.EliteBags.category = function (category) {

    if (
      !category ||
      String(category).toLowerCase() === "all"
    ) {
      return products.slice();
    }

    return products.filter(function (product) {

      return String(product.category || "")
        .toLowerCase() ===
        String(category).toLowerCase();

    });
  };


  /* =========================================================
     PUBLIC ORDER HELPER
     ========================================================= */

  window.EliteBags.order = function (id) {

    const product =
      window.EliteBags.getProduct(id);

    if (!product) {
      return;
    }

    window.EliteBags.whatsapp(
      window.EliteBags.productMessage(product)
    );
  };


})();
