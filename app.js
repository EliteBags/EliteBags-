/* =========================================================
   ELITE BAGS — APP.JS
   Master catalog + search + filters + cart + wishlist
   WhatsApp ordering + product gallery + mobile menu
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     GLOBAL SETTINGS
     --------------------------------------------------------- */

  const CONFIG = window.ELITE_BAGS_CONFIG || {
    brand: "Elite Bags",
    whatsapp: "12089034508",
    email: "luxuriouselitebags@gmail.com",
    tiktok: "@elite.bagss",
    tiktokUrl: "https://www.tiktok.com/@elite.bagss",
    address: "Guang Zhou Shi, Guang Dong Sheng, China",
    shipping: "Free Worldwide Shipping",
    delivery: "9–13 Working Days",
    currency: "USD"
  };

  const STORAGE = {
    cart: "elitebags_cart",
    wishlist: "elitebags_wishlist"
  };

  let allProducts = Array.isArray(window.PRODUCTS)
    ? [...window.PRODUCTS]
    : [];

  let currentProducts = [...allProducts];
  let currentPage = 1;
  let productsPerPage = 12;

  /* ---------------------------------------------------------
     BASIC HELPERS
     --------------------------------------------------------- */

  function $(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function money(value) {
    const number = Number(value) || 0;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: CONFIG.currency || "USD",
      maximumFractionDigits: 0
    }).format(number);
  }

  function normalize(value) {
    return String(value ?? "")
      .toLowerCase()
      .trim();
  }

  function getProduct(id) {
    const productId = String(id ?? "").trim();

    return allProducts.find(
      product => String(product.id) === productId
    ) || null;
  }

  function getImages(product) {
    if (!product) return [];

    let images = [];

    if (Array.isArray(product.images)) {
      images = product.images;
    } else {
      images = [
        product.image1,
        product.image2,
        product.image3,
        product.image4,
        product.image5
      ];
    }

    images = images
      .filter(Boolean)
      .map(image => String(image).trim())
      .filter(Boolean);

    return [...new Set(images)].slice(0, 5);
  }

  function getProductUrl(product) {
    if (!product) return "product.html";

    return `product.html?id=${encodeURIComponent(product.id)}`;
  }

  function getWhatsAppUrl(product = null) {
    let message = `Hello ${CONFIG.brand}, I would like to know more about your products.`;

    if (product) {
      message =
        `Hello ${CONFIG.brand}, I would like to order:\n\n` +
        `Product: ${product.name}\n` +
        `Product ID: ${product.id}\n` +
        `Price: ${money(product.price)}\n\n` +
        `Please let me know the next steps.`;
    }

    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  /* ---------------------------------------------------------
     CART
     --------------------------------------------------------- */

  function getCart() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE.cart) || "[]"
      );

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(
      STORAGE.cart,
      JSON.stringify(cart)
    );

    updateCartCount();
  }

  function addToCart(productId) {
    const product = getProduct(productId);

    if (!product) return;

    const cart = getCart();

    if (!cart.includes(String(product.id))) {
      cart.push(String(product.id));
      saveCart(cart);

      showToast("Added to cart");
    } else {
      showToast("Already in your cart");
    }
  }

  function removeFromCart(productId) {
    const cart = getCart()
      .filter(id => String(id) !== String(productId));

    saveCart(cart);
    renderCartDrawer();
  }

  function updateCartCount() {
    const count = getCart().length;

    $$(
      "[data-cart-count], .cart-count, #cartCount"
    ).forEach(element => {
      element.textContent = count;
      element.style.display = count > 0 ? "" : "none";
    });
  }

  /* ---------------------------------------------------------
     WISHLIST
     --------------------------------------------------------- */

  function getWishlist() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE.wishlist) || "[]"
      );

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function saveWishlist(list) {
    localStorage.setItem(
      STORAGE.wishlist,
      JSON.stringify(list)
    );
  }

  function isWishlisted(productId) {
    return getWishlist().includes(String(productId));
  }

  function toggleWishlist(productId) {
    const id = String(productId);
    const wishlist = getWishlist();

    const index = wishlist.indexOf(id);

    if (index === -1) {
      wishlist.push(id);
      showToast("Added to wishlist");
    } else {
      wishlist.splice(index, 1);
      showToast("Removed from wishlist");
    }

    saveWishlist(wishlist);

    refreshWishlistButtons();
  }

  function refreshWishlistButtons() {
    $$("[data-wishlist]").forEach(button => {
      const id = String(button.dataset.wishlist);
      const active = isWishlisted(id);

      button.classList.toggle("active", active);
      button.setAttribute(
        "aria-label",
        active
          ? "Remove from wishlist"
          : "Add to wishlist"
      );

      const icon = $(".wishlist-icon", button);

      if (icon) {
        icon.textContent = active ? "♥" : "♡";
      }
    });
  }

  /* ---------------------------------------------------------
     TOAST
     --------------------------------------------------------- */

  function showToast(message) {
    let toast = $("#eliteToast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "eliteToast";
      toast.className = "elite-toast";

      Object.assign(toast.style, {
        position: "fixed",
        left: "50%",
        bottom: "28px",
        transform: "translateX(-50%) translateY(20px)",
        zIndex: "99999",
        padding: "13px 20px",
        borderRadius: "999px",
        background: "#111",
        color: "#fff",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow: "0 12px 35px rgba(0,0,0,.18)",
        opacity: "0",
        transition: "all .3s ease",
        pointerEvents: "none"
      });

      document.body.appendChild(toast);
    }

    toast.textContent = message;

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform =
        "translateX(-50%) translateY(0)";
    });

    clearTimeout(window.__eliteToastTimer);

    window.__eliteToastTimer = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform =
        "translateX(-50%) translateY(20px)";
    }, 2200);
  }

  /* ---------------------------------------------------------
     PRODUCT CARD
     --------------------------------------------------------- */

  function productCard(product) {
    const images = getImages(product);

    const mainImage =
      images[0] ||
      "https://via.placeholder.com/800x1000?text=Elite+Bags";

    const category = product.category || "";
    const subcategory = product.subcategory || "";

    const badge =
      product.badge ||
      product.tag ||
      "";

    const wishlisted = isWishlisted(product.id);

    return `
      <article
        class="product-card reveal"
        data-product-id="${escapeHTML(product.id)}"
        data-category="${escapeHTML(category)}"
      >

        <div class="product-card-image">

          <a href="${getProductUrl(product)}"
             class="product-image-link"
             aria-label="${escapeHTML(product.name)}">

            <img
              src="${escapeHTML(mainImage)}"
              alt="${escapeHTML(product.name)}"
              loading="lazy"
              class="product-image"
              data-product-image
            >

          </a>

          ${
            badge
              ? `
                <span class="product-badge">
                  ${escapeHTML(badge)}
                </span>
              `
              : ""
          }

          <button
            type="button"
            class="wishlist-btn ${wishlisted ? "active" : ""}"
            data-wishlist="${escapeHTML(product.id)}"
            aria-label="${wishlisted ? "Remove" : "Add"} from wishlist"
          >
            <span class="wishlist-icon">
              ${wishlisted ? "♥" : "♡"}
            </span>
          </button>

          ${
            images.length > 1
              ? `
                <div class="product-image-dots">
                  ${images
                    .map(
                      (image, index) => `
                        <button
                          type="button"
                          class="image-dot ${index === 0 ? "active" : ""}"
                          data-image="${escapeHTML(image)}"
                          data-index="${index}"
                          aria-label="View image ${index + 1}"
                        ></button>
                      `
                    )
                    .join("")}
                </div>
              `
              : ""
          }

        </div>

        <div class="product-card-content">

          <div class="product-category">
            ${escapeHTML(category)}
            ${
              subcategory
                ? ` · ${escapeHTML(subcategory)}`
                : ""
            }
          </div>

          <h3 class="product-title">
            <a href="${getProductUrl(product)}">
              ${escapeHTML(product.name)}
            </a>
          </h3>

          <div class="product-price">
            ${money(product.price)}
          </div>

          <div class="product-card-actions">

            <a
              href="${getProductUrl(product)}"
              class="product-view-btn"
            >
              View Details
            </a>

            <button
              type="button"
              class="product-cart-btn"
              data-add-cart="${escapeHTML(product.id)}"
            >
              Add to Cart
            </button>

          </div>

        </div>

      </article>
    `;
  }

  /* ---------------------------------------------------------
     RENDER PRODUCT GRID
     --------------------------------------------------------- */

  function renderProducts(products = currentProducts) {
    const containers = [
      ...$$("[data-products]"),
      ...$$(".products-grid"),
      ...$$("#productsGrid"),
      ...$$("#productGrid")
    ];

    const uniqueContainers = [...new Set(containers)];

    uniqueContainers.forEach(container => {
      const emptyMessage =
        container.dataset.emptyMessage ||
        "No products found.";

      if (!products.length) {
        container.innerHTML = `
          <div class="empty-products">
            <div class="empty-products-icon">⌕</div>
            <h3>No products found</h3>
            <p>${escapeHTML(emptyMessage)}</p>
          </div>
        `;

        return;
      }

      container.innerHTML =
        products.map(productCard).join("");

      setupProductImageHover(container);
      refreshWishlistButtons();
    });

    updateResultsCount(products.length);
  }

  function updateResultsCount(count) {
    $$(
      "[data-results-count], #resultsCount, .results-count"
    ).forEach(element => {
      element.textContent =
        `${count} ${count === 1 ? "product" : "products"}`;
    });
  }

  /* ---------------------------------------------------------
     SEARCH
     --------------------------------------------------------- */

  function performSearch(query, category = "") {
    const q = normalize(query);
    const cat = normalize(category);

    currentProducts = allProducts.filter(product => {
      const searchable = [
        product.id,
        product.name,
        product.category,
        product.subcategory,
        product.color,
        product.material,
        product.description,
        product.badge,
        product.tag
      ]
        .filter(Boolean)
        .join(" ");

      const matchesSearch =
        !q || normalize(searchable).includes(q);

      const matchesCategory =
        !cat ||
        normalize(product.category) === cat ||
        normalize(product.subcategory) === cat;

      return matchesSearch && matchesCategory;
    });

    currentPage = 1;

    applySort();

    renderProducts(currentProducts);
  }

  function setupSearch() {
    const inputs = [
      ...$$("[data-search]"),
      ...$$("#searchInput"),
      ...$$(".search-input"),
      ...$$('input[type="search"]')
    ];

    const uniqueInputs = [...new Set(inputs)];

    uniqueInputs.forEach(input => {
      input.addEventListener("input", () => {
        const category =
          input.dataset.category ||
          document.body.dataset.category ||
          "";

        performSearch(input.value, category);
      });

      input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();

          const category =
            input.dataset.category ||
            document.body.dataset.category ||
            "";

          performSearch(input.value, category);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     CATEGORY FILTERS
     --------------------------------------------------------- */

  function setupCategoryFilters() {
    $$("[data-category-filter]").forEach(button => {
      button.addEventListener("click", () => {
        const category = button.dataset.categoryFilter || "";

        $$("[data-category-filter]").forEach(item => {
          item.classList.remove("active");
        });

        button.classList.add("active");

        const searchInput =
          $("[data-search]") ||
          $("#searchInput") ||
          $(".search-input");

        const query = searchInput
          ? searchInput.value
          : "";

        performSearch(query, category);
      });
    });
  }

  /* ---------------------------------------------------------
     SORT
     --------------------------------------------------------- */

  let activeSort = "";

  function sortProducts(products, sort) {
    const sorted = [...products];

    switch (sort) {
      case "price-low":
      case "price-asc":
        sorted.sort(
          (a, b) =>
            Number(a.price || 0) -
            Number(b.price || 0)
        );
        break;

      case "price-high":
      case "price-desc":
        sorted.sort(
          (a, b) =>
            Number(b.price || 0) -
            Number(a.price || 0)
        );
        break;

      case "name":
      case "name-asc":
        sorted.sort((a, b) =>
          String(a.name || "").localeCompare(
            String(b.name || "")
          )
        );
        break;

      case "newest":
        sorted.sort((a, b) =>
          String(b.id || "").localeCompare(
            String(a.id || ""),
            undefined,
            { numeric: true }
          )
        );
        break;

      default:
        break;
    }

    return sorted;
  }

  function applySort() {
    currentProducts =
      sortProducts(currentProducts, activeSort);
  }

  function setupSort() {
    const selects = [
      ...$$("[data-sort]"),
      ...$$("#sortSelect"),
      ...$$(".sort-select")
    ];

    [...new Set(selects)].forEach(select => {
      select.addEventListener("change", () => {
        activeSort = select.value || "";

        applySort();
        renderProducts(currentProducts);
      });
    });
  }

  /* ---------------------------------------------------------
     PRODUCT CATEGORY PAGE
     --------------------------------------------------------- */

  function detectPageCategory() {
    const bodyCategory =
      document.body.dataset.category;

    if (bodyCategory) {
      return bodyCategory;
    }

    const path =
      window.location.pathname.toLowerCase();

    if (path.includes("bags")) return "Bags";
    if (path.includes("shoes")) return "Shoes";
    if (path.includes("heels")) return "Heels";
    if (path.includes("watches")) return "Watches";
    if (path.includes("accessories")) return "Accessories";

    return "";
  }

  function initializeCategoryPage() {
    const category = detectPageCategory();

    if (!category) {
      currentProducts = [...allProducts];
      renderProducts(currentProducts);
      return;
    }

    currentProducts = allProducts.filter(
      product =>
        normalize(product.category) ===
        normalize(category)
    );

    renderProducts(currentProducts);
  }

  /* ---------------------------------------------------------
     PRODUCT DETAIL PAGE
     --------------------------------------------------------- */

  function getProductIdFromUrl() {
    const params =
      new URLSearchParams(window.location.search);

    return params.get("id");
  }

  function renderProductDetail() {
    const productId = getProductIdFromUrl();

    if (!productId) return;

    const product = getProduct(productId);

    if (!product) {
      renderProductNotFound();
      return;
    }

    const images = getImages(product);

    const image =
      images[0] ||
      "https://via.placeholder.com/800x1000?text=Elite+Bags";

    const setText = (selectors, value) => {
      selectors.forEach(selector => {
        $$(selector).forEach(element => {
          element.textContent = value || "";
        });
      });
    };

    setText(
      ["[data-product-name]", "#productName", ".product-name"],
      product.name
    );

    setText(
      ["[data-product-price]", "#productPrice", ".product-price"],
      money(product.price)
    );

    setText(
      ["[data-product-id]", "#productId"],
      product.id
    );

    setText(
      ["[data-product-category]", "#productCategory"],
      product.category
    );

    setText(
      ["[data-product-subcategory]", "#productSubcategory"],
      product.subcategory
    );

    setText(
      ["[data-product-color]", "#productColor"],
      product.color
    );

    setText(
      ["[data-product-material]", "#productMaterial"],
      product.material
    );

    setText(
      ["[data-product-dimensions]", "#productDimensions"],
      product.dimensions
    );

    setText(
      ["[data-product-shipping]", "#productShipping"],
      product.shipping || CONFIG.shipping
    );

    setText(
      ["[data-product-delivery]", "#productDelivery"],
      product.delivery || CONFIG.delivery
    );

    setText(
      ["[data-product-description]", "#productDescription"],
      product.description
    );

    $$("[data-product-image]").forEach(element => {
      element.src = image;
      element.alt = product.name;
    });

    const mainImage =
      $("[data-main-product-image]") ||
      $("#mainProductImage") ||
      $(".main-product-image");

    if (mainImage) {
      mainImage.src = image;
      mainImage.alt = product.name;
    }

    const title =
      document.querySelector("title");

    if (title) {
      title.textContent =
        `${product.name} | ${CONFIG.brand}`;
    }

    const metaDescription =
      document.querySelector(
        'meta[name="description"]'
      );

    if (metaDescription && product.description) {
      metaDescription.setAttribute(
        "content",
        product.description
      );
    }

    setupProductGallery(product);
   $$("[data-product-whatsapp]").forEach(button => {
      button.setAttribute(
        "href",
        getWhatsAppUrl(product)
      );
      button.target = "_blank";
      button.rel = "noopener";
    });

    $$("[data-order-product]").forEach(button => {
      button.addEventListener("click", () => {
        window.open(
          getWhatsAppUrl(product),
          "_blank",
          "noopener"
        );
      });
    });

    $$("[data-detail-add-cart]").forEach(button => {
      button.addEventListener("click", () => {
        addToCart(product.id);
      });
    });

    $$("[data-detail-wishlist]").forEach(button => {
      button.dataset.wishlist = product.id;

      button.addEventListener("click", () => {
        toggleWishlist(product.id);
      });
    });
  }

  function renderProductNotFound() {
    const containers = [
      ...$$("[data-product-detail]"),
      ...$$("#productDetail"),
      ...$$(".product-detail")
    ];

    containers.forEach(container => {
      container.innerHTML = `
        <div class="empty-products">
          <h2>Product Not Found</h2>
          <p>This product is no longer available.</p>
          <a href="index.html" class="btn">
            Back to Home
          </a>
        </div>
      `;
    });
  }

  /* ---------------------------------------------------------
     PRODUCT GALLERY
     --------------------------------------------------------- */

  function setupProductGallery(product) {
    const images = getImages(product);

    if (!images.length) return;

    let index = 0;

    const main =
      $("[data-main-product-image]") ||
      $("#mainProductImage") ||
      $(".main-product-image") ||
      $("[data-product-image]");

    const thumbs =
      $$("[data-gallery-thumb]");

    const prev =
      $("[data-gallery-prev]") ||
      $(".gallery-prev");

    const next =
      $("[data-gallery-next]") ||
      $(".gallery-next");

    function showImage(newIndex) {
      if (!images.length) return;

      index =
        (newIndex + images.length) %
        images.length;

      if (main) {
        main.src = images[index];
        main.alt = product.name;
      }

      thumbs.forEach((thumb, thumbIndex) => {
        thumb.classList.toggle(
          "active",
          thumbIndex === index
        );
      });

      const counter =
        $("[data-gallery-counter]");

      if (counter) {
        counter.textContent =
          `${index + 1} / ${images.length}`;
      }
    }

    thumbs.forEach((thumb, thumbIndex) => {
      thumb.addEventListener("click", () => {
        showImage(thumbIndex);
      });
    });

    if (prev) {
      prev.addEventListener("click", () => {
        showImage(index - 1);
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        showImage(index + 1);
      });
    }

    const gallery =
      $("[data-product-gallery]") ||
      $(".product-gallery");

    if (gallery) {
      gallery.addEventListener(
        "keydown",
        event => {
          if (event.key === "ArrowLeft") {
            showImage(index - 1);
          }

          if (event.key === "ArrowRight") {
            showImage(index + 1);
          }
        }
      );

      gallery.tabIndex = 0;
    }

    showImage(0);
  }

  function setupProductImageHover(parent = document) {
    $$(".product-card", parent).forEach(card => {
      const image =
        $("[data-product-image]", card);

      const dots =
        $$(".image-dot", card);

      if (!image || !dots.length) return;

      dots.forEach(dot => {
        dot.addEventListener("click", event => {
          event.preventDefault();
          event.stopPropagation();

          const src = dot.dataset.image;

          if (!src) return;

          image.src = src;

          dots.forEach(item => {
            item.classList.remove("active");
          });

          dot.classList.add("active");
        });
      });
    });
  }

  /* ---------------------------------------------------------
     EVENT DELEGATION
     --------------------------------------------------------- */

  function setupGlobalEvents() {
    document.addEventListener("click", event => {

      const wishlistButton =
        event.target.closest("[data-wishlist]");

      if (wishlistButton) {
        event.preventDefault();

        toggleWishlist(
          wishlistButton.dataset.wishlist
        );

        return;
      }

      const cartButton =
        event.target.closest("[data-add-cart]");

      if (cartButton) {
        event.preventDefault();

        addToCart(
          cartButton.dataset.addCart
        );

        return;
      }

      const openCart =
        event.target.closest(
          "[data-open-cart], #openCart, .open-cart"
        );

      if (openCart) {
        event.preventDefault();
        openCartDrawer();
        return;
      }

      const closeCart =
        event.target.closest(
          "[data-close-cart], #closeCart"
        );

      if (closeCart) {
        event.preventDefault();
        closeCartDrawer();
        return;
      }

      const cartRemove =
        event.target.closest(
          "[data-cart-remove]"
        );

      if (cartRemove) {
        event.preventDefault();

        removeFromCart(
          cartRemove.dataset.cartRemove
        );

        return;
      }
    });
  }
  /* ---------------------------------------------------------
     CART DRAWER
     --------------------------------------------------------- */

  function createCartDrawer() {
    if ($("#eliteCartDrawer")) return;

    const drawer =
      document.createElement("aside");

    drawer.id = "eliteCartDrawer";
    drawer.className = "elite-cart-drawer";

    drawer.innerHTML = `
      <div class="elite-cart-overlay"
           data-close-cart></div>

      <div class="elite-cart-panel">

        <div class="elite-cart-header">
          <div>
            <span class="elite-cart-small">
              YOUR SELECTION
            </span>
            <h2>Your Cart</h2>
          </div>

          <button
            type="button"
            class="elite-cart-close"
            data-close-cart
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div
          class="elite-cart-items"
          id="eliteCartItems"
        ></div>

        <div class="elite-cart-footer">

          <div class="elite-cart-total">
            <span>Items</span>
            <strong id="eliteCartTotal">
              0
            </strong>
          </div>

          <a
            href="#"
            target="_blank"
            rel="noopener"
            class="elite-cart-whatsapp"
            id="eliteCartWhatsApp"
          >
            Order via WhatsApp
          </a>

        </div>

      </div>
    `;

    Object.assign(drawer.style, {
      position: "fixed",
      inset: "0",
      zIndex: "99990",
      pointerEvents: "none"
    });

    document.body.appendChild(drawer);
  }

  function renderCartDrawer() {
    createCartDrawer();

    const container =
      $("#eliteCartItems");

    const total =
      $("#eliteCartTotal");

    const whatsapp =
      $("#eliteCartWhatsApp");

    if (!container) return;

    const cart = getCart();

    const products = cart
      .map(id => getProduct(id))
      .filter(Boolean);

    if (!products.length) {
      container.innerHTML = `
        <div class="elite-cart-empty">
          <div class="elite-cart-empty-icon">
            ♡
          </div>

          <h3>Your cart is empty</h3>

          <p>
            Add your favorite pieces to your cart.
          </p>

          <button
            type="button"
            data-close-cart
          >
            Continue Shopping
          </button>
        </div>
      `;

      if (total) total.textContent = "0";

      if (whatsapp) {
        whatsapp.style.display = "none";
      }

      return;
    }

    container.innerHTML = products
      .map(product => {
        const image =
          getImages(product)[0] ||
          "https://via.placeholder.com/120";

        return `
          <div class="elite-cart-item">

            <img
              src="${escapeHTML(image)}"
              alt="${escapeHTML(product.name)}"
            >

            <div class="elite-cart-item-info">

              <strong>
                ${escapeHTML(product.name)}
              </strong>

              <span>
                ${money(product.price)}
              </span>

              <button
                type="button"
                data-cart-remove="${escapeHTML(product.id)}"
              >
                Remove
              </button>

            </div>

          </div>
        `;
      })
      .join("");

    if (total) {
      total.textContent = String(products.length);
    }

    if (whatsapp) {
      const message =
        `Hello ${CONFIG.brand}, I would like to order these items:\n\n` +
        products
          .map(
            product =>
              `• ${product.name} — ${money(product.price)} (ID: ${product.id})`
          )
          .join("\n") +
        `\n\nPlease confirm availability and ordering details.`;

      whatsapp.href =
        `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

      whatsapp.style.display = "";
    }
  }

  function openCartDrawer() {
    createCartDrawer();
    renderCartDrawer();

    const drawer =
      $("#eliteCartDrawer");

    if (!drawer) return;

    drawer.style.pointerEvents = "auto";

    requestAnimationFrame(() => {
      drawer.classList.add("open");
    });

    document.body.classList.add("cart-open");
  }

  function closeCartDrawer() {
    const drawer =
      $("#eliteCartDrawer");

    if (!drawer) return;

    drawer.classList.remove("open");

    setTimeout(() => {
      drawer.style.pointerEvents = "none";
    }, 350);

    document.body.classList.remove("cart-open");
  }

  /* ---------------------------------------------------------
     MOBILE MENU
     --------------------------------------------------------- */

  function setupMobileMenu() {
    const buttons = [
      ...$$("[data-menu-toggle]"),
      ...$$("#menuToggle"),
      ...$$(".menu-toggle"),
      ...$$(".mobile-menu-toggle")
    ];

    const menus = [
      ...$$("[data-mobile-menu]"),
      ...$$("#mobileMenu"),
      ...$$(".mobile-menu")
    ];

    if (!buttons.length || !menus.length) return;

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        menus.forEach(menu => {
          menu.classList.toggle("open");
        });

        button.classList.toggle("active");
      });
    });

    menus.forEach(menu => {
      $$("a", menu).forEach(link => {
        link.addEventListener("click", () => {
          menus.forEach(item => {
            item.classList.remove("open");
          });

          buttons.forEach(button => {
            button.classList.remove("active");
          });
        });
      });
    });
  }

  /* ---------------------------------------------------------
     HEADER / SCROLL
     --------------------------------------------------------- */

  function setupHeaderScroll() {
    const header =
      $("[data-header]") ||
      $("header");

    if (!header) return;

    const check = () => {
      header.classList.toggle(
        "scrolled",
        window.scrollY > 25
      );
    };

    check();

    window.addEventListener(
      "scroll",
      check,
      { passive: true }
    );
  }

  /* ---------------------------------------------------------
     REVEAL ANIMATION
     --------------------------------------------------------- */

  function setupRevealAnimations() {
    const elements = [
      ...$$(".reveal"),
      ...$$("[data-reveal]")
    ];

    if (!elements.length) return;

    if (
      !("IntersectionObserver" in window)
    ) {
      elements.forEach(element => {
        element.classList.add("visible");
      });

      return;
    }

    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -40px 0px"
        }
      );

    elements.forEach(element => {
      observer.observe(element);
    });
  }

  /* ---------------------------------------------------------
     SMOOTH SCROLL
     --------------------------------------------------------- */

  function setupSmoothScroll() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener("click", event => {
        const href =
          link.getAttribute("href");

        if (
          !href ||
          href === "#" ||
          href.length < 2
        ) {
          return;
        }

        const target =
          document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  }

  /* ---------------------------------------------------------
     WHATSAPP LINKS
     --------------------------------------------------------- */

  function setupWhatsAppLinks() {
    $$("[data-whatsapp]").forEach(link => {
      link.href =
        `https://wa.me/${CONFIG.whatsapp}`;

      link.target = "_blank";
      link.rel = "noopener";
    });

    $$("[data-whatsapp-general]").forEach(link => {
      link.href =
        `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
          `Hello ${CONFIG.brand}, I would like to know more about your collection.`
        )}`;

      link.target = "_blank";
      link.rel = "noopener";
    });
  }

  /* ---------------------------------------------------------
     TIKTOK LINKS
     --------------------------------------------------------- */

  function setupTikTokLinks() {
    $$("[data-tiktok]").forEach(link => {
      link.href = CONFIG.tiktokUrl;
      link.target = "_blank";
      link.rel = "noopener";
    });
  }

  /* ---------------------------------------------------------
     CONTACT INFORMATION
     --------------------------------------------------------- */

  function setupContactInformation() {
    $$("[data-contact-email]").forEach(element => {
      element.textContent = CONFIG.email;

      if (element.tagName === "A") {
        element.href =
          `mailto:${CONFIG.email}`;
      }
    });

    $$("[data-contact-address]").forEach(element => {
      element.textContent = CONFIG.address;
    });

    $$("[data-contact-whatsapp]").forEach(element => {
      element.textContent =
        `+${CONFIG.whatsapp}`;

      if (element.tagName === "A") {
        element.href =
          `https://wa.me/${CONFIG.whatsapp}`;
      }
    });

    $$("[data-shipping-text]").forEach(element => {
      element.textContent =
        CONFIG.shipping;
    });

    $$("[data-delivery-text]").forEach(element => {
      element.textContent =
        CONFIG.delivery;
    });
  }

  /* ---------------------------------------------------------
     GLOBAL PRODUCT COUNT
     --------------------------------------------------------- */

  function updateCatalogCount() {
    $$("[data-product-count]").forEach(element => {
      element.textContent =
        allProducts.length;
    });
  }

  /* ---------------------------------------------------------
     HOME PAGE FEATURED PRODUCTS
     --------------------------------------------------------- */

  function setupFeaturedProducts() {
    const containers =
      $$("[data-featured-products]");

    containers.forEach(container => {
      let limit =
        Number(container.dataset.limit) || 8;

      let products = [...allProducts];

      if (
        container.dataset.category
      ) {
        products =
          products.filter(
            product =>
              normalize(product.category) ===
              normalize(
                container.dataset.category
              )
          );
      }

      products =
        products.slice(0, limit);

      container.innerHTML =
        products.map(productCard).join("");

      setupProductImageHover(container);
    });
  }

  /* ---------------------------------------------------------
     RANDOM / NEW PRODUCTS
     --------------------------------------------------------- */

  function setupNewProducts() {
    $$("[data-new-products]").forEach(container => {
      const limit =
        Number(container.dataset.limit) || 8;

      const products =
        [...allProducts]
          .sort((a, b) =>
            String(b.id).localeCompare(
              String(a.id),
              undefined,
              { numeric: true }
            )
          )
          .slice(0, limit);

      container.innerHTML =
        products.map(productCard).join("");

      setupProductImageHover(container);
    });
  }

  /* ---------------------------------------------------------
     PAGINATION
     --------------------------------------------------------- */

  function renderPagination() {
    const containers =
      $$("[data-pagination]");

    containers.forEach(container => {
      const totalPages =
        Math.ceil(
          currentProducts.length /
          productsPerPage
        );

      if (totalPages <= 1) {
        container.innerHTML = "";
        return;
      }

      let html = "";

      if (currentPage > 1) {
        html += `
          <button
            type="button"
            data-page="${currentPage - 1}"
          >
            Previous
          </button>
        `;
      }

      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        html += `
          <button
            type="button"
            data-page="${page}"
            class="${page === currentPage ? "active" : ""}"
          >
            ${page}
          </button>
        `;
      }

      if (currentPage < totalPages) {
        html += `
          <button
            type="button"
            data-page="${currentPage + 1}"
          >
            Next
          </button>
        `;
      }

      container.innerHTML = html;

      $$("[data-page]", container).forEach(button => {
        button.addEventListener("click", () => {
          currentPage =
            Number(button.dataset.page);

          renderPaginatedProducts();

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        });
      });
    });
  }

  function renderPaginatedProducts() {
    const start =
      (currentPage - 1) *
      productsPerPage;

    const end =
      start + productsPerPage;

    const pageProducts =
      currentProducts.slice(start, end);

    renderProducts(pageProducts);
    renderPagination();
                }
/* ---------------------------------------------------------
     URL CATEGORY SEARCH
     --------------------------------------------------------- */

  function setupUrlSearch() {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const query =
      params.get("search") ||
      params.get("q") ||
      "";

    if (!query) return;

    const input =
      $("[data-search]") ||
      $("#searchInput") ||
      $(".search-input");

    if (input) {
      input.value = query;
    }

    performSearch(
      query,
      detectPageCategory()
    );
  }

  /* ---------------------------------------------------------
     KEYBOARD SHORTCUT
     --------------------------------------------------------- */

  function setupSearchShortcut() {
    document.addEventListener(
      "keydown",
      event => {
        if (
          (event.ctrlKey ||
            event.metaKey) &&
          event.key.toLowerCase() === "k"
        ) {
          event.preventDefault();

          const input =
            $("[data-search]") ||
            $("#searchInput") ||
            $(".search-input");

          if (input) {
            input.focus();
            input.select();
          }
        }
      }
    );
  }

  /* ---------------------------------------------------------
     IMAGE ERROR FALLBACK
     --------------------------------------------------------- */

  function setupImageFallback() {
    document.addEventListener(
      "error",
      event => {
        const image = event.target;

        if (
          image &&
          image.tagName === "IMG" &&
          !image.dataset.fallbackUsed
        ) {
          image.dataset.fallbackUsed = "1";

          image.src =
            "https://via.placeholder.com/800x1000?text=Elite+Bags";
        }
      },
      true
    );
  }

  /* ---------------------------------------------------------
     PAGE LOADER
     --------------------------------------------------------- */

  function hideLoader() {
    const loaders = [
      ...$$("[data-loader]"),
      ...$("#pageLoader")
        ? [$("#pageLoader")]
        : [],
      ...$(".page-loader")
        ? [$(".page-loader")]
        : []
    ];

    [...new Set(loaders)].forEach(loader => {
      loader.classList.add("hidden");

      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    });

    document.body.classList.add(
      "page-loaded"
    );
  }

  /* ---------------------------------------------------------
     BACK TO TOP
     --------------------------------------------------------- */

  function setupBackToTop() {
    const buttons = [
      ...$$("[data-back-top]"),
      ...$("#backToTop")
        ? [$("#backToTop")]
        : [],
      ...$(".back-to-top")
        ? [$(".back-to-top")]
        : []
    ];

    const unique =
      [...new Set(buttons)];

    if (!unique.length) return;

    const check = () => {
      unique.forEach(button => {
        button.classList.toggle(
          "show",
          window.scrollY > 500
        );
      });
    };

    window.addEventListener(
      "scroll",
      check,
      { passive: true }
    );

    check();

    unique.forEach(button => {
      button.addEventListener(
        "click",
        () => {
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        }
      );
    });
  }

  /* ---------------------------------------------------------
     FOOTER YEAR
     --------------------------------------------------------- */

  function setupYear() {
    $$("[data-year]").forEach(element => {
      element.textContent =
        new Date().getFullYear();
    });

    $$("#currentYear").forEach(element => {
      element.textContent =
        new Date().getFullYear();
    });
  }

  /* ---------------------------------------------------------
     INITIALIZE
     --------------------------------------------------------- */

  function init() {
    if (!Array.isArray(window.PRODUCTS)) {
      console.warn(
        "Elite Bags: PRODUCTS array was not found. Make sure products.js loads before app.js."
      );
    }

    allProducts =
      Array.isArray(window.PRODUCTS)
        ? [...window.PRODUCTS]
        : [];

    currentProducts =
      [...allProducts];

    setupGlobalEvents();

    setupSearch();
    setupCategoryFilters();
    setupSort();

    setupMobileMenu();
    setupHeaderScroll();

    setupSmoothScroll();
    setupWhatsAppLinks();
    setupTikTokLinks();
    setupContactInformation();

    setupFeaturedProducts();
    setupNewProducts();

    setupSearchShortcut();
    setupImageFallback();
    setupBackToTop();
    setupYear();

    updateCatalogCount();
    updateCartCount();

    createCartDrawer();

    const isProductPage =
      Boolean(
        getProductIdFromUrl()
      );

    if (isProductPage) {
      renderProductDetail();
    } else {
      initializeCategoryPage();
      setupUrlSearch();
    }

    requestAnimationFrame(() => {
      setupRevealAnimations();
    });

    hideLoader();

    console.log(
      `Elite Bags loaded: ${allProducts.length} products`
    );
  }

  /* ---------------------------------------------------------
     START
     --------------------------------------------------------- */

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

  /* ---------------------------------------------------------
     PUBLIC API
     --------------------------------------------------------- */

  window.EliteBags = {
    products: () => [...allProducts],

    getProduct,

    search: performSearch,

    addToCart,

    removeFromCart,

    getCart,

    getWishlist,

    toggleWishlist,

    money,

    getImages,

    getWhatsAppUrl,

    refresh: () => {
      currentProducts =
        [...allProducts];

      renderProducts(
        currentProducts
      );

      updateCartCount();
      refreshWishlistButtons();
    }
  };

})();
