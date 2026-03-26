/**
 * PRINTX — app.js
 * E-commerce de Impressoras
 * Funcionalidades: catálogo, filtro, sort, carrinho, modal, busca, animações
 */

'use strict';

/* ============================================================
   DATA — CATÁLOGO DE PRODUTOS
   ============================================================ */
const PRODUCTS = [
  {
    id: 1, brand: 'HP', name: 'LaserJet Pro MFP M428fdw',
    category: 'multifuncional', badge: 'top',
    price: 1899.90, oldPrice: 2349.90,
    rating: 4.8, reviews: 312,
    specs: ['40 ppm', 'Wi-Fi', '1200 dpi', 'Duplex'],
    desc: 'Impressora multifuncional laser monocromática com fax, Wi-Fi dual band, duplex automático e alta capacidade de papel. Ideal para escritórios de médio porte.',
    specsFull: { velocidade: '40 ppm', resolucao: '1200 dpi', conectividade: 'Wi-Fi / USB', papel: 'A4 / Carta' }
  },
  {
    id: 2, brand: 'Canon', name: 'PIXMA G6010',
    category: 'inkjet', badge: 'new',
    price: 899.90, oldPrice: null,
    rating: 4.6, reviews: 198,
    specs: ['13 ppm', 'Wi-Fi', '4800 dpi', 'Tank'],
    desc: 'Impressora inkjet com sistema de tanque de tinta de alto rendimento. Perfeita para quem imprime muito e precisa de cores vivas com custo reduzido.',
    specsFull: { velocidade: '13 ppm', resolucao: '4800 dpi', conectividade: 'Wi-Fi / USB', papel: 'A4 até A1' }
  },
  {
    id: 3, brand: 'Epson', name: 'EcoTank ET-4850',
    category: 'multifuncional', badge: 'sale',
    price: 1249.90, oldPrice: 1599.90,
    rating: 4.7, reviews: 445,
    specs: ['15 ppm', 'Wi-Fi', '5760 dpi', 'ADF'],
    desc: 'Multifuncional com tanque EcoTank de altíssima capacidade. Digitalização automática, Wi-Fi e suporte a voz via Alexa e Google Assistant.',
    specsFull: { velocidade: '15 ppm', resolucao: '5760 dpi', conectividade: 'Wi-Fi / Bluetooth', papel: 'A4 / Carta' }
  },
  {
    id: 4, brand: 'Samsung', name: 'Xpress M2020W',
    category: 'laser', badge: null,
    price: 649.90, oldPrice: null,
    rating: 4.3, reviews: 87,
    specs: ['21 ppm', 'Wi-Fi', '1200 dpi', 'Compacta'],
    desc: 'Impressora laser monocromática compacta com Wi-Fi. Ideal para home office com uso moderado. Fácil instalação via aplicativo móvel.',
    specsFull: { velocidade: '21 ppm', resolucao: '1200 dpi', conectividade: 'Wi-Fi / USB', papel: 'A4' }
  },
  {
    id: 5, brand: 'Brother', name: 'HL-L3270CDW',
    category: 'laser', badge: 'new',
    price: 2199.90, oldPrice: null,
    rating: 4.9, reviews: 203,
    specs: ['25 ppm', 'Wi-Fi', '2400 dpi', 'Colorida'],
    desc: 'Impressora laser colorida de alta velocidade com Wi-Fi, duplex automático e bandeja de 250 folhas. Excelente para impressão profissional colorida.',
    specsFull: { velocidade: '25 ppm', resolucao: '2400 dpi', conectividade: 'Wi-Fi / Ethernet', papel: 'A4 / Legal' }
  },
  {
    id: 6, brand: 'Lexmark', name: 'MB2650adwe',
    category: 'multifuncional', badge: null,
    price: 3499.90, oldPrice: 3999.90,
    rating: 4.5, reviews: 56,
    specs: ['50 ppm', 'Ethernet', '1200 dpi', 'ADF 50fls'],
    desc: 'Multifuncional corporativa de alto desempenho com velocidade de 50 ppm, ADF de 50 folhas, digitalização em rede e segurança avançada.',
    specsFull: { velocidade: '50 ppm', resolucao: '1200 dpi', conectividade: 'Wi-Fi / Ethernet', papel: 'A4 / Legal' }
  },
  {
    id: 7, brand: 'HP', name: 'DesignJet T650 36"',
    category: 'grafica', badge: 'top',
    price: 12499.90, oldPrice: 14999.90,
    rating: 4.8, reviews: 34,
    specs: ['A0', 'USB', '2400 dpi', 'Plotter'],
    desc: 'Plotter profissional para impressão técnica e artística até 36 polegadas. Ideal para arquitetos, engenheiros e estúdios criativos.',
    specsFull: { velocidade: 'A1 em 25s', resolucao: '2400 dpi', conectividade: 'USB / Ethernet', papel: 'Até 914mm' }
  },
  {
    id: 8, brand: 'Epson', name: 'SureColor SC-P700',
    category: 'grafica', badge: null,
    price: 8999.90, oldPrice: null,
    rating: 4.7, reviews: 78,
    specs: ['13"', 'Wi-Fi', '5760 dpi', '10 cores'],
    desc: 'Impressora fotográfica profissional com 10 cores UltraChrome PRO10. Perfeita para fotógrafos e estúdios que exigem exatidão de cores.',
    specsFull: { velocidade: 'A4 em 46s', resolucao: '5760 dpi', conectividade: 'Wi-Fi / USB', papel: 'Até 33cm' }
  },
];

/* ============================================================
   STATE
   ============================================================ */
const state = {
  cart: JSON.parse(localStorage.getItem('px_cart') || '[]'),
  wishlist: new Set(JSON.parse(localStorage.getItem('px_wishlist') || '[]')),
  currentFilter: 'all',
  currentSort: 'default',
  visibleCount: 8,
  searchQuery: '',
};

/* ============================================================
   UTILITY
   ============================================================ */
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];
const fmt = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const stars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

function saveState() {
  localStorage.setItem('px_cart', JSON.stringify(state.cart));
  localStorage.setItem('px_wishlist', JSON.stringify([...state.wishlist]));
}

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer;
function showToast(msg) {
  const el = $('#toast');
  $('#toastMsg').textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

/* ============================================================
   CURSOR CUSTOMIZADO
   ============================================================ */
function initCursor() {
  const cursor = $('#cursor');
  const follower = $('#cursorFollower');
  let fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    fx += (e.clientX - fx) * 0.12;
    fy += (e.clientY - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
  });

  function follow() {
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(follow);
  }
  follow();

  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('a, button, .product-card, .cat-card, select, input, textarea');
    document.body.classList.toggle('cursor-hover', !!el);
  });
}

/* ============================================================
   HEADER — SCROLL & HAMBURGER
   ============================================================ */
function initHeader() {
  const header = $('#header');
  const hamburger = $('#hamburger');
  const nav = $('.nav');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('mobile-open');
  });

  // Fechar nav ao clicar em link
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('mobile-open');
    });
  });
}

/* ============================================================
   SEARCH
   ============================================================ */
function initSearch() {
  const toggle = $('#searchToggle');
  const bar    = $('#searchBar');
  const close  = $('#searchClose');
  const input  = $('#searchInput');

  toggle.addEventListener('click', () => {
    bar.classList.add('open');
    setTimeout(() => input.focus(), 200);
  });

  close.addEventListener('click', closeSearch);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
  });

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.searchQuery = input.value.trim().toLowerCase();
      state.visibleCount = 8;
      renderProducts();
      if (state.searchQuery) {
        document.getElementById('produtos').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  });

  function closeSearch() {
    bar.classList.remove('open');
    input.value = '';
    state.searchQuery = '';
    renderProducts();
  }
}

/* ============================================================
   PRODUCT SVG ICON — gera ícone SVG simples por categoria
   ============================================================ */
function printerIcon(category) {
  const colors = {
    laser: '#e63946',
    inkjet: '#3a86ff',
    multifuncional: '#2ecc71',
    grafica: '#f7b731',
  };
  const c = colors[category] || '#e63946';
  return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="22" width="64" height="36" rx="8" fill="${c}" opacity="0.12" stroke="${c}" stroke-width="1.5"/>
    <rect x="18" y="10" width="44" height="16" rx="6" fill="${c}" opacity="0.15" stroke="${c}" stroke-width="1.5"/>
    <rect x="22" y="57" width="36" height="14" rx="4" fill="white" opacity="0.08" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
    <rect x="26" y="55" width="28" height="16" rx="3" fill="white" opacity="0.7"/>
    <circle cx="18" cy="38" r="4" fill="${c}"/>
    <rect x="28" y="35" width="28" height="4" rx="2" fill="${c}" opacity="0.4"/>
    <rect x="28" y="43" width="20" height="3" rx="1.5" fill="${c}" opacity="0.25"/>
    <rect x="52" y="26" width="14" height="10" rx="3" fill="${c}" opacity="0.3" stroke="${c}" stroke-width="1"/>
    <ellipse cx="40" cy="74" rx="22" ry="4" fill="${c}" opacity="0.1"/>
  </svg>`;
}

/* ============================================================
   RENDER PRODUCTS
   ============================================================ */
function getFilteredSorted() {
  let list = [...PRODUCTS];

  // Filter by category
  if (state.currentFilter !== 'all') {
    list = list.filter(p => p.category === state.currentFilter);
  }

  // Filter by search
  if (state.searchQuery) {
    const q = state.searchQuery;
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.specs.some(s => s.toLowerCase().includes(q))
    );
  }

  // Sort
  switch (state.currentSort) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
  }

  return list;
}

function createProductCard(product, idx) {
  const isWished = state.wishlist.has(product.id);
  const badgeMap = { sale: ['badge-sale', 'OFERTA'], new: ['badge-new', 'NOVO'], top: ['badge-top', 'TOP'] };
  const [bClass, bLabel] = product.badge ? badgeMap[product.badge] : ['', ''];
  const discPct = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  const li = document.createElement('div');
  li.className = 'product-card';
  li.dataset.id = product.id;
  li.style.animationDelay = `${idx * 0.06}s`;

  li.innerHTML = `
    <div class="pc-image">
      <div class="pc-img-inner">${printerIcon(product.category)}</div>
      ${product.badge ? `<span class="pc-badge ${bClass}">${bLabel}${discPct ? ' -' + discPct + '%' : ''}</span>` : ''}
      <button class="pc-wishlist ${isWished ? 'active' : ''}" data-id="${product.id}" aria-label="Favoritar">
        <svg width="16" height="16" fill="${isWished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <div class="pc-overlay">
        <button class="btn btn-primary" data-action="quickview" data-id="${product.id}">Ver detalhes</button>
      </div>
    </div>
    <div class="pc-body">
      <span class="pc-brand">${product.brand}</span>
      <span class="pc-name">${product.name}</span>
      <div class="pc-specs">
        ${product.specs.map(s => `<span class="pc-spec">${s}</span>`).join('')}
      </div>
      <div class="pc-rating">
        <span class="stars">${stars(product.rating)}</span>
        <small>(${product.reviews})</small>
      </div>
    </div>
    <div class="pc-footer">
      <div class="pc-price-wrap">
        ${product.oldPrice ? `<span class="pc-price-old">${fmt(product.oldPrice)}</span>` : ''}
        <span class="pc-price">${fmt(product.price)}</span>
      </div>
      <button class="pc-add" data-action="addcart" data-id="${product.id}" aria-label="Adicionar ao carrinho">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
  `;

  return li;
}

function renderProducts() {
  const grid = $('#productGrid');
  const list = getFilteredSorted();
  const visible = list.slice(0, state.visibleCount);

  grid.innerHTML = '';

  if (visible.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--white-30)">
      <p style="font-size:18px;margin-bottom:8px">Nenhum produto encontrado</p>
      <p style="font-size:13px;font-family:var(--font-mono)">Tente outros termos ou filtros</p>
    </div>`;
  } else {
    visible.forEach((p, i) => grid.appendChild(createProductCard(p, i)));
  }

  // Load more button
  const loadMoreBtn = $('#loadMore');
  loadMoreBtn.style.display = list.length > state.visibleCount ? 'inline-flex' : 'none';
}

/* ============================================================
   FILTERS & SORT
   ============================================================ */
function initFilters() {
  const tabs = $('#filterTabs');
  tabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.filter-tab');
    if (!tab) return;
    $$('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.currentFilter = tab.dataset.filter;
    state.visibleCount = 8;
    renderProducts();
  });

  // Category cards also filter
  $$('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
      const filter = card.dataset.filter;
      state.currentFilter = filter;
      state.visibleCount = 8;
      $$('.filter-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.filter === filter);
      });
      renderProducts();
      document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
    });
  });

  $('#sortSelect').addEventListener('change', (e) => {
    state.currentSort = e.target.value;
    renderProducts();
  });

  $('#loadMore').addEventListener('click', () => {
    state.visibleCount += 4;
    renderProducts();
  });
}

/* ============================================================
   PRODUCT GRID DELEGATION (Add to Cart, Quick View, Wishlist)
   ============================================================ */
function initProductGrid() {
  $('#productGrid').addEventListener('click', (e) => {
    const addBtn    = e.target.closest('[data-action="addcart"]');
    const qvBtn     = e.target.closest('[data-action="quickview"]');
    const wishBtn   = e.target.closest('.pc-wishlist');
    const cardEl    = e.target.closest('.product-card');

    if (addBtn) {
      const id = +addBtn.dataset.id;
      addToCart(id);
      return;
    }
    if (qvBtn) {
      openModal(+qvBtn.dataset.id);
      return;
    }
    if (wishBtn) {
      toggleWishlist(+wishBtn.dataset.id, wishBtn);
      return;
    }
    if (cardEl && !e.target.closest('button')) {
      openModal(+cardEl.dataset.id);
    }
  });
}

/* ============================================================
   CART
   ============================================================ */
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = state.cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id, qty: 1, name: product.name, price: product.price, category: product.category });
  }
  saveState();
  renderCart();
  showToast(`${product.brand} ${product.name.split(' ').slice(0, 2).join(' ')} adicionado ao carrinho`);

  // Bump animation on cart count
  const countEl = $('#cartCount');
  countEl.classList.remove('bump');
  void countEl.offsetWidth;
  countEl.classList.add('bump');
  setTimeout(() => countEl.classList.remove('bump'), 400);
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  saveState();
  renderCart();
}

function changeQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveState();
  renderCart();
}

function renderCart() {
  const count = state.cart.reduce((a, i) => a + i.qty, 0);
  const total = state.cart.reduce((a, i) => a + i.qty * i.price, 0);

  $('#cartCount').textContent = count;
  $('#cartTotal').textContent = fmt(total);

  const itemsEl = $('#cartItems');
  const emptyEl = $('#cartEmpty');
  const footerEl = $('#csFooter');

  itemsEl.innerHTML = '';

  if (state.cart.length === 0) {
    emptyEl.classList.add('show');
    footerEl.classList.remove('show');
  } else {
    emptyEl.classList.remove('show');
    footerEl.classList.add('show');
    state.cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="ci-thumb">${printerIcon(item.category)}</div>
        <div class="ci-meta">
          <strong>${item.name}</strong>
          <small>${fmt(item.price)}</small>
        </div>
        <div class="ci-qty">
          <button data-action="qty-down" data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button data-action="qty-up" data-id="${item.id}">+</button>
        </div>
        <button class="ci-remove" data-action="remove" data-id="${item.id}" aria-label="Remover">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      `;
      itemsEl.appendChild(li);
    });
  }
}

function initCart() {
  const cartBtn     = $('#cartBtn');
  const cartClose   = $('#cartClose');
  const cartOverlay = $('#cartOverlay');
  const cartSidebar = $('#cartSidebar');
  const cartShopLink = $('#cartShopLink');
  const checkoutBtn = $('#checkoutBtn');

  function openCart()  { cartSidebar.classList.add('open'); cartOverlay.classList.add('show'); }
  function closeCart() { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('show'); }

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  cartShopLink && cartShopLink.addEventListener('click', closeCart);

  // Delegation for qty + remove inside cart
  $('#cartItems').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = +btn.dataset.id;
    if (btn.dataset.action === 'qty-up')   changeQty(id, 1);
    if (btn.dataset.action === 'qty-down') changeQty(id, -1);
    if (btn.dataset.action === 'remove')   removeFromCart(id);
  });

  checkoutBtn.addEventListener('click', () => {
    if (state.cart.length === 0) return;
    showToast('Funcionalidade de checkout em breve! 🚀');
  });

  // Keyboard shortcut: C to open cart
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'c' || e.key === 'C') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      cartSidebar.classList.contains('open') ? closeCart() : openCart();
    }
  });

  renderCart();
}

/* ============================================================
   WISHLIST
   ============================================================ */
function toggleWishlist(id, btn) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  if (state.wishlist.has(id)) {
    state.wishlist.delete(id);
    btn.classList.remove('active');
    btn.querySelector('path').setAttribute('fill', 'none');
    showToast('Removido dos favoritos');
  } else {
    state.wishlist.add(id);
    btn.classList.add('active');
    btn.querySelector('path').setAttribute('fill', 'currentColor');
    showToast(`${product.brand} adicionado aos favoritos ♥`);
  }
  saveState();
}

/* ============================================================
   MODAL — QUICK VIEW
   ============================================================ */
function openModal(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const overlay = $('#modalOverlay');
  const body    = $('#modalBody');

  body.innerHTML = `
    <div class="modal-img">${printerIcon(product.category)}</div>
    <div class="modal-info">
      <p class="modal-brand">${product.brand} · ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
      <h2 class="modal-name">${product.name}</h2>
      <div class="modal-rating">
        <span class="stars">${stars(product.rating)}</span>
        <small style="font-family:var(--font-mono);font-size:11px;color:var(--white-30)">${product.rating} (${product.reviews} avaliações)</small>
      </div>
      <p class="modal-desc">${product.desc}</p>
      <div class="modal-specs-grid">
        ${Object.entries(product.specsFull).map(([k, v]) => `
          <div class="modal-spec-item">
            <small>${k.charAt(0).toUpperCase() + k.slice(1)}</small>
            <span>${v}</span>
          </div>
        `).join('')}
      </div>
      <div class="modal-footer">
        <div>
          ${product.oldPrice ? `<small>${fmt(product.oldPrice)}</small>` : ''}
          <p class="modal-price">${fmt(product.price)}</p>
        </div>
        <button class="btn btn-primary" id="modalAddCart" data-id="${product.id}">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  $('#modalAddCart').addEventListener('click', () => {
    addToCart(product.id);
    closeModal();
  });
}

function closeModal() {
  $('#modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function initModal() {
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalOverlay').addEventListener('click', (e) => {
    if (e.target === $('#modalOverlay')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ============================================================
   SCROLL ANIMATIONS — IntersectionObserver
   ============================================================ */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $$('.fade-in').forEach(el => observer.observe(el));

  // Add fade-in to section headers
  $$('.section-header, .cat-card, .sv-counter, .ci-item, .sobre-list li').forEach((el, i) => {
    if (!el.classList.contains('fade-in')) {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${(i % 4) * 0.1}s`;
      observer.observe(el);
    }
  });
}

/* ============================================================
   COUNTERS — animação dos números
   ============================================================ */
function initCounters() {
  const counters = $$('.counter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1800;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString('pt-BR');
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = $('#contactForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'nome',     min: 3,   msg: 'Informe seu nome (mín. 3 caracteres)' },
      { id: 'email',    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'E-mail inválido' },
      { id: 'mensagem', min: 10,  msg: 'Mensagem muito curta (mín. 10 caracteres)' },
    ];

    fields.forEach(({ id, min, regex, msg }) => {
      const input = document.getElementById(id);
      const errorEl = document.getElementById(id + 'Error');
      const group = input.closest('.form-group');
      const val = input.value.trim();

      let err = '';
      if (!val) {
        err = 'Campo obrigatório';
      } else if (min && val.length < min) {
        err = msg;
      } else if (regex && !regex.test(val)) {
        err = msg;
      }

      if (err) {
        valid = false;
        group.classList.add('error');
        errorEl.textContent = err;
      } else {
        group.classList.remove('error');
        errorEl.textContent = '';
      }
    });

    if (valid) {
      const btn = $('#submitBtn');
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Enviando...';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Enviar Mensagem';
        showToast('Mensagem enviada com sucesso! ✓');
      }, 1500);
    }
  });

  // Clear errors on input
  $$('.contact-form input, .contact-form textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('error');
    });
  });
}

/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   ACTIVE NAV LINK (Scroll Spy)
   ============================================================ */
function initScrollSpy() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + entry.target.id
            ? 'var(--white)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initHeader();
  initSearch();
  initFilters();
  renderProducts();
  initProductGrid();
  initCart();
  initModal();
  initScrollAnimations();
  initCounters();
  initContactForm();
  initSmoothScroll();
  initScrollSpy();

  console.log('%cPRINTX 🖨️', 'font-family:monospace;font-size:20px;color:#e63946;font-weight:bold');
  console.log('%cE-commerce de Impressoras — Desenvolvido com ♥', 'color:#aaa;font-size:12px');
});
