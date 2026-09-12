/* =========================================================
   ELITE BAGS — MASTER PRODUCT DATABASE
   =========================================================
   IMPORTANT:
   - Product ID must stay unique.
   - Add/edit products ONLY in this file.
   - All pages will use this same database.
   - Image paths are case-sensitive on GitHub Pages.
   ========================================================= */

const ELITE_BAGS_CONFIG = {
  brand: "Elite Bags",

  whatsapp: "+12089034508",
  whatsappDisplay: "+1 208-903-4508",

  email: "luxuriouselitebags@gmail.com",

  tiktokUsername: "@elite.bagss",
  tiktokUrl: "https://www.tiktok.com/@elite.bagss",

  address: "Guang Zhou Shi, Guang Dong Sheng, China",

  shipping: "Free Worldwide Delivery",
  delivery: "9–13 Working Days",

  currency: "USD"
};


/* =========================================================
   PRODUCTS
   ========================================================= */

const PRODUCTS = [

  {
    id: "0001",
    name: "Louis Vuitton Odyssee Monogram Bag",
    category: "Bags",
    subcategory: "Shoulder Bags",
    price: 365,
    currency: "USD",

    sizes: ["One Size"],
    colors: ["Monogram Brown"],

    dimensions: "See product details",
    material: "Monogram Canvas",
    quality: "Premium Quality",
    badge: "FEATURED",

    images: [
      "images/0001.jpg"
    ],

    description:
      "A refined monogram shoulder bag designed for an elegant everyday look, with a spacious silhouette and polished finishing."
  },


  {
    id: "0002",
    name: "Christian Dior Lady Dior Handbag",
    category: "Bags",
    subcategory: "Handbags",
    price: 335,
    currency: "USD",

    sizes: ["One Size"],
    colors: ["Classic"],

    dimensions: "See product details",
    material: "Premium Material",
    quality: "Premium Quality",
    badge: "FEATURED",

    images: [
      "images/0002.jpg"
    ],

    description:
      "An elegant structured handbag with a sophisticated silhouette, designed to complement both day and evening looks."
  },


  {
    id: "0003",
    name: "Chanel Raffia Shopping Tote",
    category: "Bags",
    subcategory: "Tote Bags",
    price: 345,
    currency: "USD",

    sizes: ["One Size"],
    colors: ["Natural"],

    dimensions: "See product details",
    material: "Raffia",
    quality: "Premium Quality",
    badge: "NEW",

    images: [
      "images/0003.jpg.jpg"
    ],

    description:
      "A stylish raffia shopping tote offering a relaxed luxury aesthetic with a practical spacious design."
  },


  {
    id: "0004",
    name: "Louis Vuitton Alma BB Bag",
    category: "Bags",
    subcategory: "Handbags",
    price: 335,
    currency: "USD",

    sizes: ["One Size"],
    colors: ["Classic"],

    dimensions: "See product details",
    material: "Canvas",
    quality: "Premium Quality",
    badge: "POPULAR",

    images: [
      "images/0004.jpg"
    ],

    description:
      "A compact structured handbag with a timeless silhouette, ideal for elegant everyday styling."
  },


  {
    id: "0005",
    name: "Louis Vuitton Neverfull MM in Monogram Empreinte Leather",
    category: "Bags",
    subcategory: "Tote Bags",
    price: 355,
    currency: "USD",

    sizes: ["MM"],
    colors: ["Burgundy"],

    dimensions: "31 × 28 × 14 cm",
    material: "Monogram Empreinte Leather",
    quality: "Premium Quality",
    badge: "FEATURED",

    images: [
      "images/0005.jpg.jpg"
    ],

    description:
      "A spacious everyday tote in burgundy leather with a sophisticated finish and versatile carrying design."
  },


  {
    id: "0006",
    name: "Chanel Caoutchouc CC High Boots",
    category: "Shoes",
    subcategory: "High Boots",
    price: 275,
    currency: "USD",

    sizes: ["Multiple Sizes"],
    colors: ["Black"],

    dimensions: "Available in Multiple Sizes",
    material: "Rubber",
    quality: "Premium Quality",
    badge: "NEW",

    images: [
      "images/0006.jpg"
    ],

    description:
      "A sleek pair of black high boots featuring a clean silhouette and polished fashion detailing."
  },


  {
    id: "0007",
    name: "Chanel Suede Calfskin CC Mules",
    category: "Shoes",
    subcategory: "Mules",
    price: 235,
    currency: "USD",

    sizes: ["Multiple Sizes"],
    colors: ["Suede"],

    dimensions: "Available in Multiple Sizes",
    material: "Suede Calfskin",
    quality: "Premium Quality",
    badge: "NEW",

    images: [
      "images/0007.jpg"
    ],

    description:
      "Elegant suede mules designed with a refined silhouette for effortless luxury styling."
  },


  {
    id: "0008",
    name: "Chanel Short Biker Boots",
    category: "Shoes",
    subcategory: "Short Boots",
    price: 265,
    currency: "USD",

    sizes: ["Multiple Sizes"],
    colors: ["Black"],

    dimensions: "Available in Multiple Sizes",
    material: "Premium Material",
    quality: "Premium Quality",
    badge: "TRENDING",

    images: [
      "images/0008.jpg"
    ],

    description:
      "A modern short biker boot with a strong silhouette, designed for contemporary everyday outfits."
  },


  {
    id: "0009",
    name: "Saint Laurent Le Loafer",
    category: "Shoes",
    subcategory: "Loafers",
    price: 255,
    currency: "USD",

    sizes: ["Multiple Sizes"],
    colors: ["Classic"],

    dimensions: "Available in Multiple Sizes",
    material: "Premium Leather",
    quality: "Premium Quality",
    badge: "FEATURED",

    images: [
      "images/0009.jpg"
    ],

    description:
      "A sophisticated loafer with a clean profile, ideal for polished casual and formal styling."
  },


  {
    id: "0010",
    name: "Gucci x adidas Gazelle 'GG Monogram' Sneakers",
    category: "Shoes",
    subcategory: "Sneakers",
    price: 235,
    currency: "USD",

    sizes: ["Multiple Sizes"],
    colors: ["GG Monogram"],

    dimensions: "Available in Multiple Sizes",
    material: "Premium Material",
    quality: "Premium Quality",
    badge: "TRENDING",

    images: [
      "images/0010.jpg"
    ],

    description:
      "A statement sneaker combining a sporty silhouette with a distinctive monogram-inspired finish."
  },


  {
    id: "0011",
    name: "Louis Vuitton Speedy Soft 30 Dark Monogram Bag",
    category: "Bags",
    subcategory: "Handbags",
    price: 375,
    currency: "USD",

    sizes: ["30"],
    colors: ["Dark Monogram"],

    dimensions: "See product details",
    material: "Monogram Canvas",
    quality: "Premium Quality",
    badge: "FEATURED",

    images: [
      "images/0011.jpg"
    ],

    description:
      "A relaxed yet sophisticated handbag with a spacious interior and timeless monogram styling."
  },


  {
    id: "0012",
    name: "Christian Dior Dusty Ivory Macrocannage Calfskin Dior Groove Bag",
    category: "Bags",
    subcategory: "Dior Groove Bag",
    price: 345,
    currency: "USD",

    sizes: ["One Size"],
    colors: ["Dusty Ivory"],

    dimensions: "See product details",
    material: "Macrocannage Calfskin",
    quality: "Premium Quality",
    badge: "NEW",

    images: [
      "images/0012.jpg"
    ],

    description:
      "A sophisticated ivory handbag featuring a refined textured finish and an elegant structured silhouette."
  },


  {
    id: "0013",
    name: "Hermès Birkin Bag",
    category: "Bags",
    subcategory: "Birkin",
    price: 525,
    currency: "USD",

    sizes: ["Multiple Sizes"],
    colors: ["Black"],

    dimensions: "30 cm",
    material: "Premium Leather",
    quality: "Premium Quality",
    badge: "FEATURED",

    images: [
      "images/0013.jpg"
    ],

    description:
      "A timeless structured handbag with an elegant silhouette, polished hardware and spacious interior."
  },


  {
    id: "0014",
    name: "Louis Vuitton Speedy Bandoulière 20 in Damier Ebène Canvas Bag",
    category: "Bags",
    subcategory: "Speedy Bandoulière",
    price: 335,
    currency: "USD",

    sizes: ["20"],
    colors: ["Damier Ebène"],

    dimensions: "20.5 × 13.5 × 12 cm",
    material: "Damier Ebène Canvas",
    quality: "Premium Quality",
    badge: "FEATURED",

    images: [
      "images/0014.jpg"
    ],

    description:
      "A compact structured handbag with a versatile crossbody design and classic checked canvas finish."
  },


  {
    id: "0015",
    name: "Goyard Goyardine Sac Cap Vert Black Crossbody Bag",
    category: "Bags",
    subcategory: "Crossbody Bags",
    price: 265,
    currency: "USD",

    sizes: ["Standard"],
    colors: ["Black"],

    dimensions: "Standard",
    material: "Goyardine Canvas",
    quality: "Premium Quality",
    badge: "NEW",

    images: [
      "images/0015.jpg"
    ],

    description:
      "A compact crossbody bag designed for everyday convenience with a sleek and versatile silhouette."
  },


  /* =======================================================
     GENERAL COLLECTION ITEMS
     These remain available until their final product
     information/images are entered into the master catalog.
     ======================================================= */

  {
    id: "0016",
    name: "Elegant Flat",
    category: "Shoes",
    subcategory: "Flats",
    price: 149,
    currency: "USD",

    sizes: ["Multiple Sizes"],
    colors: ["Classic"],

    dimensions: "Available in Multiple Sizes",
    material: "Premium Material",
    quality: "Premium Quality",
    badge: "FEATURED",

    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85"
    ],

    description:
      "An elegant flat designed for comfortable everyday styling with a refined fashion finish."
  },


  {
    id: "0017",
    name: "Classic Stiletto",
    category: "Heels",
    subcategory: "Stiletto Heels",
    price: 229,
    currency: "USD",

    sizes: ["Multiple Sizes"],
    colors: ["Classic"],

    dimensions: "Available in Multiple Sizes",
    material: "Premium Material",
    quality: "Premium Quality",
    badge: "FEATURED",

    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85"
    ],

    description:
      "A classic stiletto silhouette designed to add an elegant finish to evening and formal looks."
  },


  {
    id: "0018",
    name: "Block Heel",
    category: "Heels",
    subcategory: "Block Heels",
    price: 199,
    currency: "USD",

    sizes: ["Multiple Sizes"],
    colors: ["Classic"],

    dimensions: "Available in Multiple Sizes",
    material: "Premium Material",
    quality: "Premium Quality",
    badge: "POPULAR",

    images: [
      "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?auto=format&fit=crop&w=1200&q=85"
    ],

    description:
      "A versatile block heel designed to combine elegant styling with a comfortable everyday profile."
  },


  {
    id: "0019",
    name: "Elegant Pump",
    category: "Heels",
    subcategory: "Pumps",
    price: 219,
    currency: "USD",

    sizes: ["Multiple Sizes"],
    colors: ["Classic"],

    dimensions: "Available in Multiple Sizes",
    material: "Premium Material",
    quality: "Premium Quality",
    badge: "NEW",

    images: [
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1200&q=85"
    ],

    description:
      "A polished pump with an elegant silhouette designed for sophisticated everyday and occasion styling."
  }

];


/* =========================================================
   MASTER HELPERS
   ========================================================= */

function getProductById(id) {
  return PRODUCTS.find(product => product.id === String(id)) || null;
}


function getProductsByCategory(category) {
  return PRODUCTS.filter(
    product =>
      product.category.toLowerCase() === String(category).toLowerCase()
  );
}


function searchProducts(query, category = "") {
  const q = String(query || "").trim().toLowerCase();

  return PRODUCTS.filter(product => {

    const categoryMatch =
      !category ||
      category.toLowerCase() === "all" ||
      product.category.toLowerCase() === category.toLowerCase();

    if (!categoryMatch) return false;

    if (!q) return true;

    const searchableText = [
      product.id,
      product.name,
      product.category,
      product.subcategory,
      product.price,
      ...(product.sizes || []),
      ...(product.colors || []),
      product.material,
      product.description
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(q);
  });
}


function getProductImages(product) {
  if (!product || !Array.isArray(product.images)) return [];

  return product.images.filter(Boolean);
}


function getWhatsAppLink(product) {

  if (!product) {
    return "https://wa.me/" + ELITE_BAGS_CONFIG.whatsapp;
  }

  const message =
    "Hello Elite Bags!\n\n" +
    "I am interested in this product:\n" +
    product.name + "\n\n" +
    "Product ID: " + product.id + "\n" +
    "Price: $" + product.price + "\n" +
    "Category: " + product.category + "\n" +
    "Style: " + product.subcategory + "\n" +
    "Color: " + (product.colors || []).join(", ") + "\n" +
    "Size: " + (product.sizes || []).join(", ") + "\n\n" +
    "Please share availability and ordering details.";

  return (
    "https://wa.me/" +
    ELITE_BAGS_CONFIG.whatsapp +
    "?text=" +
    encodeURIComponent(message)
  );
}


function getProductUrl(product) {
  return "product.html?id=" + encodeURIComponent(product.id);
}


function getCategoryUrl(category) {

  const pages = {
    Bags: "bags.html",
    Shoes: "shoes.html",
    Heels: "heels.html",
    Watches: "watches.html",
    Accessories: "accessories.html"
  };

  return pages[category] || "index.html";
}
