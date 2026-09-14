/* =========================================================
   ELITE BAGS — MAIN JAVASCRIPT
   ========================================================= */

(() => {
  "use strict";

  const SITE = window.ELITE_BAGS || {};
  const CONFIG = SITE.config || {};
  const PRODUCTS = Array.isArray(SITE.products) ? SITE.products : [];

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const money = value =>
    `${CONFIG.currency === "USD" ? "$" : ""}${Number(value || 0).toFixed(0)}`;

  const escapeHTML = value =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  /* ---------------------------------------------------------
     CONTACT / SITE INFORMATION
     --------------------------------------------------------- */

  $$("[data-email]").forEach(el => {
    el.textContent = CONFIG.email || "";
    if (el.tagName === "A") {
      el.href = `mailto:${CONFIG.email || ""}`;
    }
  });

  $$("[data-phone]").forEach(el => {
    el.textContent = CONFIG.whatsappDisplay || "";
    if (el.tagName === "A") {
      el.href = CONFIG.whatsapp || "#";
    }
  });

  $$("[data-address]").forEach(el => {
    el.textContent = CONFIG.address || "";
  });

  $$("[data-tiktok]").forEach(el => {
    if (el.tagName === "A") {
      el.href = CONFIG.tiktok || "#";
    }
  });

  $$("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  $$("[data-float-wa]").forEach(el => {
    el.href = CONFIG.whatsapp || "#";
  });

  /* ---------------------------------------------------------
     MOBILE MENU
     --------------------------------------------------------- */

  const menuButton = $("[data-menu]");
  const nav = $("[data-nav]");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      nav.classList.toggle("is-open");
      menuButton.classList.toggle("is-active");
    });

    $$(".nav-link", nav).forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuButton.classList.remove("is-active");
      });
    });
  }

  /* ---------------------------------------------------------
     HEADER SCROLL EFFECT
     --------------------------------------------------------- */

  const header = $(".site-header");

  const updateHeader = () => {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 30);
    }
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ---------------------------------------------------------
     PRODUCT HELPERS
     --------------------------------------------------------- */

  const getProduct = id =>
    PRODUCTS.find(product => String(product.id) === String(id));

  const productImage = product => {
    if (!product) return "";

    if (Array.isArray(product.images) && product.images.length) {
      return product.images[0];
    }

    if (product.image) return product.image;

    return "";
  };

  const productCard = product => {
    const image = productImage(product);

    return `
      <article class="product-card reveal">
        <a class="product-image" href="product.html?id=${encodeURIComponent(product.id)}">
          ${
            image
              ? `<img src="${escapeHTML(image)}"
                      alt="${escapeHTML(product.name)}"
                      loading="lazy"
                      onerror="this.style.display='none';this.parentElement.classList.add('image-missing');">`
              : `<span class="image-placeholder">EB</span>`
          }

          ${
            product.badge
              ? `<span class="product-badge">${escapeHTML(product.badge)}</span>`
              : ""
          }
        </a>

        <div class="product-info">
          <div class="product-category">
            ${escapeHTML(product.category || "")}
          </div>

          <h3>
            <a href="product.html?id=${encodeURIComponent(product.id)}">
              ${escapeHTML(product.name || "")}
            </a>
          </h3>

          <div class="product-bottom">
            <strong>${money(product.price)}</strong>

            <button
              class="add-cart"
              type="button"
              data-add-cart="${escapeHTML(product.id)}">
              Add to Bag
            </button>
          </div>
        </div>
      </article>
    `;
  };

  /* ---------------------------------------------------------
     FEATURED PRODUCTS
     --------------------------------------------------------- */

  const featuredContainer = $("[data-featured]");

  if (featuredContainer) {
    let featured = PRODUCTS.filter(product =>
      ["Featured", "Popular", "Trending", "New"].includes(product.badge)
    );

    if (!featured.length) {
      featured = PRODUCTS;
    }

    featuredContainer.innerHTML = featured
      .slice(0, 8)
      .map(productCard)
      .join("");
  }

  /* ---------------------------------------------------------
     CATEGORY PAGE
     --------------------------------------------------------- */

  const categoryPage = $("[data-category-page]");
  const productGrid = $("[data-product-grid]");

  if (categoryPage && productGrid) {
    const category = categoryPage.dataset.categoryPage
      .trim()
      .toLowerCase();

    const filtered = PRODUCTS.filter(product =>
      String(product.category || "").toLowerCase() === category
    );

    productGrid.innerHTML = filtered.length
      ? filtered.map(productCard).join("")
      : `
        <div class="empty-products">
          <h3>No products found</h3>
          <p>New arrivals will be added soon.</p>
        </div>
      `;
  }

  /* ---------------------------------------------------------
     SEARCH
     --------------------------------------------------------- */

  const homeSearch = $("[data-home-search]");
  const searchResults = $("[data-search-results]");

  const searchProducts = query => {
    const q = query.trim().toLowerCase();

    if (!q) return [];

    return PRODUCTS.filter(product => {
      const text = [
        product.id,
        product.name,
        product.category,
        product.subcategory,
        product.colors,
        product.material,
        product.description
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(q);
    });
  };

  const renderSearch = query => {
    if (!searchResults) return;

    const results = searchProducts(query);

    if (!query.trim()) {
      searchResults.innerHTML = "";
      searchResults.classList.remove("has-results");
      return;
    }

    searchResults.classList.add("has-results");

    searchResults.innerHTML = results.length
      ? results.slice(0, 8).map(productCard).join("")
      : `
        <div class="empty-products">
          <h3>No products found</h3>
          <p>Try another product name or category.</p>
        </div>
      `;
  };

  if (homeSearch) {
    homeSearch.addEventListener("input", event => {
      renderSearch(event.target.value);
    });

    homeSearch.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        homeSearch.value = "";
        renderSearch("");
      }
    });
  }

  /* ---------------------------------------------------------
     CART
     --------------------------------------------------------- */

  const CART_KEY = "elite_bags_cart";

  let cart = [];

  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    cart = [];
  }

  const saveCart = () => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  };

  const addToCart = id => {
    const product = getProduct(id);

    if (!product) return;

    const existing = cart.find(
      item => String(item.id) === String(id)
    );

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        qty: 1
      });
    }

    saveCart();
    renderCart();
    openCart();
  };

  const removeFromCart = id => {
    cart = cart.filter(
      item => String(item.id) !== String(id)
    );

    saveCart();
    renderCart();
  };

  const changeQty = (id, amount) => {
    const item = cart.find(
      item => String(item.id) === String(id)
    );

    if (!item) return;

    item.qty += amount;

    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }

    saveCart();
    renderCart();
  };

  const drawer = $("[data-drawer]");
  const shade = $("[data-shade]");
  const cartList = $("[data-cart-list]");
  const totalElement = $("[data-total]");

  const cartCountElements = $$("[data-cart-count]");

  const renderCart = () => {
    cartCountElements.forEach(el => {
      const count = cart.reduce(
        (sum, item) => sum + item.qty,
        0
      );

      el.textContent = count;
      el.classList.toggle("has-items", count > 0);
    });

    if (!cartList) return;

    if (!cart.length) {
      cartList.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛍</div>
          <h3>Your bag is empty</h3>
          <p>Add something you love.</p>
        </div>
      `;

      if (totalElement) {
        totalElement.textContent = money(0);
      }

      return;
    }

    let total = 0;

    cartList.innerHTML = cart
      .map(item => {
        const product = getProduct(item.id);

        if (!product) return "";

        const subtotal =
          Number(product.price || 0) * item.qty;

        total += subtotal;

        const image = productImage(product);

        return `
          <div class="cart-item">
            <div class="cart-item-image">
              ${
                image
                  ? `<img src="${escapeHTML(image)}"
                           alt="${escapeHTML(product.name)}"
                           onerror="this.style.display='none';">`
                  : `<span>EB</span>`
              }
            </div>

            <div class="cart-item-info">
              <h4>${escapeHTML(product.name)}</h4>

              <strong>${money(product.price)}</strong>

              <div class="cart-quantity">
                <button type="button"
                  data-cart-minus="${escapeHTML(product.id)}">−</button>

                <span>${item.qty}</span>

                <button type="button"
                  data-cart-plus="${escapeHTML(product.id)}">+</button>
              </div>
            </div>

            <button
              class="cart-remove"
              type="button"
              data-cart-remove="${escapeHTML(product.id)}">
              ×
            </button>
          </div>
        `;
      })
      .join("");

    if (totalElement) {
      totalElement.textContent = money(total);
    }
  };

  const openCart = () => {
    if (drawer) drawer.classList.add("is-open");
    if (shade) shade.classList.add("is-open");
    document.body.classList.add("cart-open");
  };

  const closeCart = () => {
    if (drawer) drawer.classList.remove("is-open");
    if (shade) shade.classList.remove("is-open");
    document.body.classList.remove("cart-open");
  };

  $$("[data-open-cart]").forEach(button => {
    button.addEventListener("click", openCart);
  });

  $$("[data-close-cart]").forEach(button => {
    button.addEventListener("click", closeCart);
  });

  if (shade) {
    shade.addEventListener("click", closeCart);
  }

  document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add-cart]");

    if (addButton) {
      addToCart(addButton.dataset.addCart);
      return;
    }

    const removeButton =
      event.target.closest("[data-cart-remove]");

    if (removeButton) {
      removeFromCart(removeButton.dataset.cartRemove);
      return;
    }

    const plusButton =
      event.target.closest("[data-cart-plus]");

    if (plusButton) {
      changeQty(plusButton.dataset.cartPlus, 1);
      return;
    }

    const minusButton =
      event.target.closest("[data-cart-minus]");

    if (minusButton) {
      changeQty(minusButton.dataset.cartMinus, -1);
    }
  });

  renderCart();

})();
/* =========================================================
   ELITE BAGS — CART ORDER + PRODUCT PAGE + ANIMATIONS
   ========================================================= */

(() => {
  "use strict";

  const SITE = window.ELITE_BAGS || {};
  const CONFIG = SITE.config || {};
  const PRODUCTS = Array.isArray(SITE.products) ? SITE.products : [];

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const escapeHTML = value =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const money = value =>
    `${CONFIG.currency === "USD" ? "$" : ""}${Number(value || 0).toFixed(0)}`;

  const getProduct = id =>
    PRODUCTS.find(product => String(product.id) === String(id));

  /* ---------------------------------------------------------
     CART WHATSAPP ORDER
     --------------------------------------------------------- */

  const orderButton = $("[data-cart-order]");

  if (orderButton) {
    orderButton.addEventListener("click", () => {
      let cart = [];

      try {
        cart =
          JSON.parse(localStorage.getItem("elite_bags_cart")) || [];
      } catch {
        cart = [];
      }

      if (!cart.length) {
        alert("Your shopping bag is empty.");
        return;
      }

      let message =
        "Hello Elite Bags! I would like to order:%0A%0A";

      let total = 0;

      cart.forEach(item => {
        const product = getProduct(item.id);

        if (!product) return;

        const subtotal =
          Number(product.price || 0) * item.qty;

        total += subtotal;

        message +=
          `${encodeURIComponent(product.name)} x${item.qty} — ${encodeURIComponent(money(subtotal))}%0A`;
      });

      message +=
        `%0ATotal: ${encodeURIComponent(money(total))}`;

      message +=
        `%0A%0APlease send me the order details and payment information.`;

      const whatsapp =
        CONFIG.whatsapp ||
        "https://wa.me/12089034508";

      window.open(
        `${whatsapp}?text=${message}`,
        "_blank",
        "noopener"
      );
    });
  }

  /* ---------------------------------------------------------
     PRODUCT DETAIL PAGE
     --------------------------------------------------------- */

  const productPage = $("[data-product-page]");

  if (productPage) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const product = getProduct(id);

    if (!product) {
      productPage.innerHTML = `
        <div class="empty-products">
          <h2>Product not found</h2>
          <p>The product you are looking for is unavailable.</p>
          <a class="btn btn-primary" href="index.html">
            Back to Home
          </a>
        </div>
      `;
    } else {
      const images =
        Array.isArray(product.images) && product.images.length
          ? product.images
          : product.image
          ? [product.image]
          : [];

      const firstImage = images[0] || "";

      productPage.innerHTML = `
        <div class="product-detail">

          <div class="product-gallery">

            <div class="product-main-image">
              ${
                firstImage
                  ? `<img
                      id="mainProductImage"
                      src="${escapeHTML(firstImage)}"
                      alt="${escapeHTML(product.name)}"
                    >`
                  : `<div class="image-placeholder large">EB</div>`
              }
            </div>

            ${
              images.length > 1
                ? `
                  <div class="product-thumbs">
                    ${images
                      .map(
                        (image, index) => `
                          <button
                            type="button"
                            class="product-thumb ${
                              index === 0 ? "active" : ""
                            }"
                            data-product-image="${escapeHTML(image)}">
                            <img
                              src="${escapeHTML(image)}"
                              alt="${escapeHTML(product.name)} ${index + 1}"
                            >
                          </button>
                        `
                      )
                      .join("")}
                  </div>
                `
                : ""
            }

          </div>

          <div class="product-details">

            ${
              product.badge
                ? `<span class="product-detail-badge">
                    ${escapeHTML(product.badge)}
                   </span>`
                : ""
            }

            <div class="product-detail-category">
              ${escapeHTML(product.category || "")}
            </div>

            <h1>${escapeHTML(product.name)}</h1>

            <div class="product-detail-price">
              ${money(product.price)}
            </div>

            ${
              product.description
                ? `<p class="product-description">
                    ${escapeHTML(product.description)}
                   </p>`
                : ""
            }

            <div class="product-specs">

              ${
                product.color
                  ? `<div>
                      <span>Color</span>
                      <strong>${escapeHTML(product.color)}</strong>
                    </div>`
                  : ""
              }

              ${
                product.colors
                  ? `<div>
                      <span>Colors</span>
                      <strong>${escapeHTML(product.colors)}</strong>
                    </div>`
                  : ""
              }

              ${
                product.sizes
                  ? `<div>
                      <span>Size</span>
                      <strong>${escapeHTML(product.sizes)}</strong>
                    </div>`
                  : ""
              }

              ${
                product.material
                  ? `<div>
                      <span>Material</span>
                      <strong>${escapeHTML(product.material)}</strong>
                    </div>`
                  : ""
              }

              ${
                product.dimensions
                  ? `<div>
                      <span>Dimensions</span>
                      <strong>${escapeHTML(product.dimensions)}</strong>
                    </div>`
                  : ""
              }

              ${
                product.quality
                  ? `<div>
                      <span>Quality</span>
                      <strong>${escapeHTML(product.quality)}</strong>
                    </div>`
                  : ""
              }

              <div>
                <span>Shipping</span>
                <strong>Free Worldwide Delivery</strong>
              </div>

              <div>
                <span>Delivery</span>
                <strong>${escapeHTML(
                  product.delivery ||
                    CONFIG.delivery ||
                    "9–13 Working Days"
                )}</strong>
              </div>

            </div>

            <div class="product-actions">

              <button
                type="button"
                class="btn btn-primary"
                data-product-add="${escapeHTML(product.id)}">
                Add to Bag
              </button>

              <a
                class="btn btn-outline"
                href="${
                  CONFIG.whatsapp ||
                  "https://wa.me/12089034508"
                }?text=${encodeURIComponent(
                  `Hello Elite Bags! I am interested in ${product.name} (${money(product.price)}). Please send me more details.`
                )}"
                target="_blank"
                rel="noopener">
                Order on WhatsApp
              </a>

            </div>

          </div>

        </div>
      `;

      const mainImage = $("#mainProductImage");

      document.addEventListener("click", event => {
        const thumb =
          event.target.closest("[data-product-image]");

        if (thumb && mainImage) {
          mainImage.src = thumb.dataset.productImage;

          document
            .querySelectorAll(".product-thumb")
            .forEach(item => item.classList.remove("active"));

          thumb.classList.add("active");
        }

        const add =
          event.target.closest("[data-product-add]");

        if (add) {
          let cart = [];

          try {
            cart =
              JSON.parse(
                localStorage.getItem("elite_bags_cart")
              ) || [];
          } catch {
            cart = [];
          }

          const existing = cart.find(
            item =>
              String(item.id) === String(add.dataset.productAdd)
          );

          if (existing) {
            existing.qty += 1;
          } else {
            cart.push({
              id: add.dataset.productAdd,
              qty: 1
            });
          }

          localStorage.setItem(
            "elite_bags_cart",
            JSON.stringify(cart)
          );

          add.textContent = "Added ✓";

          setTimeout(() => {
            add.textContent = "Add to Bag";
          }, 1400);
        }
      });
    }
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL
     --------------------------------------------------------- */

  const revealItems =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.08
        }
      );

    revealItems.forEach(item =>
      observer.observe(item)
    );
  } else {
    revealItems.forEach(item =>
      item.classList.add("visible")
    );
  }

  /* ---------------------------------------------------------
     ESC KEY
     --------------------------------------------------------- */

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    const drawer =
      document.querySelector("[data-drawer]");

    const shade =
      document.querySelector("[data-shade]");

    if (drawer) drawer.classList.remove("is-open");
    if (shade) shade.classList.remove("is-open");

    document.body.classList.remove("cart-open");
  });

})();
