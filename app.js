(function(){
  "use strict";
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const PRODUCTS=Array.isArray(window.PRODUCTS)?window.PRODUCTS:[];
  const STORE=window.STORE||{};
  const CATEGORIES=Array.isArray(window.CATEGORIES)?window.CATEGORIES:["Bags","Shoes","Watches","Accessories"];
  const money=v=>new Intl.NumberFormat("en-US",{style:"currency",currency:STORE.currency||"USD",maximumFractionDigits:0}).format(Number(v)||0);
  const esc=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  const getProduct=id=>PRODUCTS.find(p=>String(p.id)===String(id));
  const getCategoryProducts=cat=>PRODUCTS.filter(p=>String(p.category||"").toLowerCase()===String(cat||"").toLowerCase());

  function storageGet(key,fallback){try{return JSON.parse(localStorage.getItem(key)||"")??fallback}catch{return fallback}}
  function cart(){return Array.isArray(storageGet("eliteBagsCart",[]))?storageGet("eliteBagsCart",[]):[]}
  function saveCart(items){try{localStorage.setItem("eliteBagsCart",JSON.stringify(items))}catch{}; updateCartCount(items); renderCart(items)}
  function updateCartCount(items=cart()){$$('[data-cart-count]').forEach(el=>el.textContent=String(items.reduce((s,i)=>s+Math.max(1,Number(i.quantity)||1),0)))}
  function addCart(product){const items=cart(),found=items.find(i=>String(i.id)===String(product.id));if(found)found.quantity=(Number(found.quantity)||1)+1;else items.push({id:product.id,name:product.name,price:Number(product.price)||0,image:product.images?.[0]||"",quantity:1});saveCart(items);toast("Added to your bag")}
  function removeCart(id){saveCart(cart().filter(i=>String(i.id)!==String(id)))}
  function setQuantity(id,delta){const items=cart();const item=items.find(i=>String(i.id)===String(id));if(!item)return;item.quantity=Math.max(1,(Number(item.quantity)||1)+delta);saveCart(items)}
  function openWhatsApp(message){window.open(`${STORE.whatsappLink||"https://wa.me/12089034508"}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer")}
  function productMessage(product){return `Hello Elite Bags 👋\n\nI am interested in:\n${product.name}\n\nProduct ID: ${product.id}\nPrice: ${money(product.price)}\n\nPlease send me the ordering details and availability.`}

  function initHeader(){
    const toggle=$("[data-menu-toggle]"),menu=$("[data-mobile-menu]"),searchToggle=$("[data-search-toggle]"),panel=$("[data-search-panel]"),input=$("[data-search-input]"),results=$("[data-search-results]");
    const header=$(".site-header");
    const scroll=()=>header?.classList.toggle("scrolled",window.scrollY>8);scroll();window.addEventListener("scroll",scroll,{passive:true});
    if(toggle&&menu){toggle.addEventListener("click",()=>{const open=menu.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open))});$$("a",menu).forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("open");toggle.setAttribute("aria-expanded","false")}))}
    if(searchToggle&&panel&&input){searchToggle.addEventListener("click",()=>{const open=panel.classList.toggle("open");searchToggle.setAttribute("aria-expanded",String(open));if(open)setTimeout(()=>input.focus(),20)});document.addEventListener("keydown",e=>{if(e.key==="Escape"){panel.classList.remove("open");searchToggle.setAttribute("aria-expanded","false")}})}
    if(input&&results){input.addEventListener("input",()=>{const q=input.value.trim().toLowerCase();if(!q){results.innerHTML="";results.classList.remove("show");return}const matches=PRODUCTS.filter(p=>[p.id,p.name,p.category,p.subcategory,p.colors,p.material,p.description].filter(Boolean).join(" ").toLowerCase().includes(q)).slice(0,8);results.innerHTML=matches.length?matches.map(p=>`<a class="search-result" href="product.html?id=${encodeURIComponent(p.id)}"><span class="search-result-image">${p.images?.[0]?`<img src="${esc(p.images[0])}" alt="" loading="lazy">`:`<span>EB</span>`}</span><span class="search-result-copy"><strong>${esc(p.name)}</strong><small>${esc(p.category)} · ${esc(p.subcategory||"Collection")}</small></span><b>${money(p.price)}</b></a>`).join(""):`<div class="search-empty"><strong>No products found</strong><span>Try another product name or category.</span></div>`;results.classList.add("show")});document.addEventListener("click",e=>{if(!e.target.closest("[data-search-panel]")&&!e.target.closest("[data-search-toggle]"))results.classList.remove("show")})}
  }

  function renderProductGrid(grid,list){if(!grid)return;if(!list.length){grid.innerHTML=`<div class="product-grid-empty"><strong>No products in this collection yet.</strong><span>New pieces will be added here as they become available.</span></div>`;return}grid.innerHTML=list.map((p,i)=>{const img=p.images?.[0];return `<article class="product-card reveal-up stagger-${Math.min(i+1,4)}"><a class="product-card-media" href="product.html?id=${encodeURIComponent(p.id)}">${p.badge?`<span class="product-badge">${esc(p.badge)}</span>`:""}${img?`<img src="${esc(img)}" alt="${esc(p.name)}" loading="lazy" decoding="async">`:`<div class="product-placeholder"><span>EB</span></div>`}</a><div class="product-card-body"><span class="product-category">${esc(p.category)}</span><h3><a href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a></h3><div class="product-card-footer"><strong class="product-price">${money(p.price)}</strong><button class="quick-order" type="button" data-quick-order="${esc(p.id)}">WhatsApp</button></div></div></article>`}).join("");
    $$("[data-quick-order]",grid).forEach(btn=>btn.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();const p=getProduct(btn.dataset.quickOrder);if(p)openWhatsApp(productMessage(p))}));requestAnimationFrame(()=>$$('.reveal-up',grid).forEach(el=>el.classList.add('is-visible')));
    $$('img',grid).forEach(img=>img.addEventListener('error',()=>{img.style.display='none';const box=img.parentElement;box.insertAdjacentHTML('beforeend','<div class="product-placeholder"><span>EB</span></div>')},{once:true}));
  }

  function initHome(){
    if(document.body.dataset.page!=="home")return;
    const grid=$("[data-featured-grid]");
    if(grid)renderProductGrid(grid,PRODUCTS.filter(p=>p.featured).slice(0,8));
  }

  function initCategory(){
    const page=$("[data-category-page]");if(!page)return;const cat=page.dataset.category;const grid=$("[data-category-grid]");renderProductGrid(grid,getCategoryProducts(cat));
    const count=$("[data-category-count]");if(count)count.textContent=String(getCategoryProducts(cat).length);
    $$('[data-category-name]').forEach(el=>el.textContent=cat);
    document.title=`${cat} | Elite Bags`;
  }

  function initCart(){
    const drawer=$("[data-cart-drawer]"),overlay=$("[data-cart-overlay]");if(!drawer||!overlay)return;
    const open=()=>{drawer.classList.add("open");overlay.classList.add("open");document.body.classList.add("drawer-open");drawer.setAttribute("aria-hidden","false")};
    const close=()=>{drawer.classList.remove("open");overlay.classList.remove("open");document.body.classList.remove("drawer-open");drawer.setAttribute("aria-hidden","true")};
    $$('[data-cart-open]').forEach(b=>b.addEventListener('click',open));$$('[data-cart-close]').forEach(b=>b.addEventListener('click',close));overlay.addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    document.addEventListener('click',e=>{const add=e.target.closest('[data-add-cart]');if(add){const p=getProduct(add.dataset.addCart);if(p){addCart(p);open()}}});
    document.addEventListener('click',e=>{const a=e.target.closest('[data-cart-action]');if(!a)return;const id=a.dataset.id;const action=a.dataset.cartAction;if(action==='plus')setQuantity(id,1);if(action==='minus')setQuantity(id,-1);if(action==='remove')removeCart(id)});
    document.addEventListener('click',e=>{const b=e.target.closest('[data-checkout-open]');if(!b)return;const items=cart();if(!items.length){toast('Your bag is empty');return}openCheckout(items)});
    updateCartCount();renderCart(cart());
  }

  function renderCart(items){const body=$("[data-cart-items]"),total=$("[data-cart-total]");if(!body||!total)return;if(!items.length){body.innerHTML=`<div class="cart-empty"><div class="cart-empty-icon">EB</div><h3>Your bag is empty</h3><p>Add a product from the collection to see it here.</p><a class="btn btn-red" href="index.html#collections">Explore Collections</a></div>`;total.textContent=money(0);return}body.innerHTML=items.map(i=>`<div class="cart-item"><div class="cart-item-media">${i.image?`<img src="${esc(i.image)}" alt="${esc(i.name)}" loading="lazy">`:`<span>EB</span>`}</div><div class="cart-item-main"><strong>${esc(i.name)}</strong><span>${money(i.price)}</span><div class="cart-item-controls"><button type="button" data-cart-action="minus" data-id="${esc(i.id)}">−</button><b>${Math.max(1,Number(i.quantity)||1)}</b><button type="button" data-cart-action="plus" data-id="${esc(i.id)}">+</button><button type="button" class="remove-link" data-cart-action="remove" data-id="${esc(i.id)}">Remove</button></div></div><strong class="cart-line-total">${money((Number(i.price)||0)*(Math.max(1,Number(i.quantity)||1)))}</strong></div>`).join("");const subtotal=items.reduce((s,i)=>s+(Number(i.price)||0)*(Math.max(1,Number(i.quantity)||1)),0);total.textContent=money(subtotal)}

  function openCheckout(items){const modal=$("[data-checkout-modal]"),summary=$("[data-checkout-summary]");if(!modal||!summary)return;const subtotal=items.reduce((s,i)=>s+(Number(i.price)||0)*(Math.max(1,Number(i.quantity)||1)),0);summary.innerHTML=`<div class="checkout-summary-row"><span>Items</span><strong>${items.reduce((s,i)=>s+Math.max(1,Number(i.quantity)||1),0)}</strong></div><div class="checkout-summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="checkout-note">Select a payment preference below. The website does not collect or store card details; payment instructions are confirmed during your order conversation.</div>`;modal.classList.add('open');modal.setAttribute('aria-hidden','false');$$('[data-payment-method]').forEach(btn=>{btn.onclick=()=>{const method=btn.dataset.paymentMethod;$$('[data-payment-method]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const lines=items.map(i=>`• ${i.name} × ${Math.max(1,Number(i.quantity)||1)} — ${money((Number(i.price)||0)*(Math.max(1,Number(i.quantity)||1)))}`).join('\n');openWhatsApp(`Hello Elite Bags 👋\n\nI would like to place an order:\n${lines}\n\nSubtotal: ${money(subtotal)}\nPayment preference: ${method}\n\nPlease send me the next steps and availability.`)}})}
  function initCheckoutClose(){const modal=$("[data-checkout-modal]");if(!modal)return;const close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')};$$('[data-checkout-close]').forEach(b=>b.addEventListener('click',close));modal.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()})}

  function initProductPage(){
    const page=$("[data-product-page]");if(!page)return;const id=new URLSearchParams(location.search).get('id');const product=getProduct(id);const title=$("[data-product-title]");
    if(!product){document.title='Product Not Found | Elite Bags';if(title)title.textContent='Product Not Found';const desc=$("[data-product-description]");if(desc)desc.textContent='This product is not available in the current catalog. Return to the collection and choose another piece.';return}
    document.title=`${product.name} | Elite Bags`;$("[data-product-category]").textContent=product.category;$("[data-product-price]").textContent=money(product.price);title.textContent=product.name;$("[data-product-subtitle]").textContent=`${product.category} · ${product.subcategory||'Collection'}`;$("[data-product-description]").textContent=product.description;$("[data-product-id]").textContent=product.id;$("[data-breadcrumb-product]").textContent=product.name;
    const specs={specCategory:product.category,specStyle:product.subcategory||'—',specColor:product.colors||'—',specSize:product.sizes||'—',specMaterial:product.material||'—',specDimensions:product.dimensions||'—',specQuality:STORE.quality||'Master Quality'};Object.entries(specs).forEach(([k,v])=>{const el=$(`[data-spec="${k}"]`);if(el)el.textContent=v});
    $$('[data-product-category-link]').forEach(l=>{l.href=`${product.category.toLowerCase()}.html`});
    const main=$("[data-main-image]"),ph=$("[data-image-placeholder]"),thumbs=$("[data-thumbs]"),prev=$("[data-gallery-prev]"),next=$("[data-gallery-next]"),count=$("[data-gallery-count]"),images=(product.images||[]).filter(Boolean);let current=0;
    const placeholder=()=>{if(main)main.style.display='none';if(ph)ph.style.display='grid';if(prev)prev.hidden=true;if(next)next.hidden=true;if(count)count.textContent='No image'};
    const show=index=>{if(!images.length){placeholder();return}current=(index+images.length)%images.length;if(main){main.src=images[current];main.alt=product.name;main.style.display='block';main.onerror=placeholder}if(ph)ph.style.display='none';if(prev)prev.hidden=images.length<2;if(next)next.hidden=images.length<2;if(count)count.textContent=`${current+1} / ${images.length}`;$$('[data-thumb-index]',thumbs).forEach(t=>t.classList.toggle('active',Number(t.dataset.thumbIndex)===current))};
    if(thumbs){thumbs.innerHTML=images.map((src,i)=>`<button class="product-thumb${i===0?' active':''}" type="button" data-thumb-index="${i}" aria-label="View image ${i+1}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join('');$$('[data-thumb-index]',thumbs).forEach(t=>t.addEventListener('click',()=>show(Number(t.dataset.thumbIndex))))}if(prev)prev.addEventListener('click',()=>show(current-1));if(next)next.addEventListener('click',()=>show(current+1));show(0);
    const order=$("[data-product-order]");if(order)order.href=`${STORE.whatsappLink}?text=${encodeURIComponent(productMessage(product))}`;const add=$("[data-product-add]");if(add)add.dataset.addCart=product.id;
    const related=$("[data-related-grid]");if(related)renderProductGrid(related,PRODUCTS.filter(p=>p.category===product.category&&p.id!==product.id).slice(0,4));
    const share=$("[data-product-share]");if(share)share.addEventListener('click',async()=>{try{if(navigator.share){await navigator.share({title:product.name,text:`${product.name} | Elite Bags`,url:location.href});toast('Product shared')}else{await navigator.clipboard.writeText(location.href);toast('Product link copied')}}catch{}});
    initZoom(main,images,()=>current);
  }
  function initZoom(main,images,getCurrent){const modal=$("[data-image-zoom]"),img=$("[data-zoom-image]"),closeBtn=$("[data-zoom-close]");if(!main||!modal||!img)return;main.addEventListener('click',()=>{if(!images.length)return;img.src=images[getCurrent()];modal.classList.add('open');modal.setAttribute('aria-hidden','false')});const close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')};closeBtn?.addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()})}

  function initReveal(){const items=$$('.reveal,.reveal-up,.reveal-left');if(!items.length)return;if(!('IntersectionObserver' in window)){items.forEach(e=>e.classList.add('is-visible'));return}const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -30px 0px'});items.forEach(e=>obs.observe(e))}
  function initFAQ(){$$('[data-faq] details').forEach(d=>d.addEventListener('toggle',()=>{if(!d.open)return;$$('details',d.parentElement).forEach(o=>{if(o!==d)o.open=false})}))}
  function initBackTop(){const b=$("[data-back-top]");if(!b)return;const update=()=>b.classList.toggle('show',scrollY>600);update();addEventListener('scroll',update,{passive:true});b.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}))}
  function initFooter(){const y=new Date().getFullYear();$$('[data-year]').forEach(el=>el.textContent=y)}
  function toast(message){const t=$("[data-toast]");if(!t)return;t.textContent=message;t.classList.add('show');clearTimeout(window.__eliteToast);window.__eliteToast=setTimeout(()=>t.classList.remove('show'),2200)}

  document.addEventListener('DOMContentLoaded',()=>{initHeader();initHome();initCategory();initCart();initCheckoutClose();initProductPage();initReveal();initFAQ();initBackTop();initFooter();updateCartCount()});
})();
