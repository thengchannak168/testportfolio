// --- Database of Products ---
const products = [
  {
    id: 1,
    name: "អាវយឺតដៃខ្លី Cotton Premium",
    category: "clothing",
    price: 15.00,
    rating: 4.8,
    reviews: 120,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    name: "កាសស្តាប់ត្រចៀក Wireless Pro",
    category: "electronics",
    price: 49.99,
    rating: 4.9,
    reviews: 85,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    name: "ស្បែកជើងរត់ Sneaker Running",
    category: "shoes",
    price: 55.00,
    rating: 4.7,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    name: "នាឡិកាឆ្លាតវៃ Smart Fitness Watch",
    category: "electronics",
    price: 39.50,
    rating: 4.6,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 5,
    name: "វ៉ែនតាការពារកម្ដៅថ្ងៃ Classic",
    category: "accessories",
    price: 18.00,
    rating: 4.5,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 6,
    name: "កាបូបស្ពាយខ្នង Travel Backpack",
    category: "accessories",
    price: 32.00,
    rating: 4.8,
    reviews: 73,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60"
  }
];

// App State
let cart = [];
let currentCategory = "all";
let searchQuery = "";

// DOM Elements
const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");
const categoryContainer = document.getElementById("categoryContainer");
const searchInput = document.getElementById("searchInput");

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartBadge = document.getElementById("cartBadge");
const cartItemList = document.getElementById("cartItemList");
const subtotalPriceEl = document.getElementById("subtotalPrice");
const taxPriceEl = document.getElementById("taxPrice");
const totalPriceEl = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");

const checkoutModal = document.getElementById("checkoutModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const checkoutForm = document.getElementById("checkoutForm");
const toast = document.getElementById("toastNotification");
const toastMessage = document.getElementById("toastMessage");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupEventListeners();
});

// Category Label Helper
function getCategoryLabel(category) {
  const map = {
    clothing: "សម្លៀកបំពាក់",
    electronics: "អេឡិចត្រូនិក",
    shoes: "ស្បែកជើង",
    accessories: "គ្រឿងអលង្ការ"
  };
  return map[category] || category;
}

// Render Products
function renderProducts() {
  const filtered = products.filter(item => {
    const matchCategory = currentCategory === "all" || item.category === currentCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  productCount.textContent = `បង្ហាញ ${filtered.length} មុខ`;

  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 12px; display: block;"></i>
        មិនមានទំនិញដែលអ្នកកំពុងស្វែងរកឡើយ!
      </div>
    `;
    return;
  }

  productGrid.innerHTML = filtered.map(item => `
    <div class="card">
      <div class="card-image-box">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <span class="card-category">${getCategoryLabel(item.category)}</span>
      </div>
      <div class="card-content">
        <h3 class="card-title">${item.name}</h3>
        <div class="card-rating">
          <i class="fa-solid fa-star"></i> ${item.rating} (${item.reviews})
        </div>
        <div class="card-footer">
          <span class="price">$${item.price.toFixed(2)}</span>
          <button class="btn-add" onclick="addToCart(${item.id})" title="បន្ថែមទៅកន្ត្រក">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// Cart Logic
window.addToCart = function(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`បានបន្ថែម "${product.name}" ទៅក្នុងកន្ត្រក`);
};

function updateQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = totalCount;

  if (cart.length === 0) {
    cartItemList.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-arrow-down"></i>
        <p>កន្ត្រកទំនិញរបស់អ្នកនៅទំនេរនៅឡើយ</p>
      </div>
    `;
    subtotalPriceEl.textContent = "$0.00";
    taxPriceEl.textContent = "$0.00";
    totalPriceEl.textContent = "$0.00";
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;

  cartItemList.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  subtotalPriceEl.textContent = `$${subtotal.toFixed(2)}`;
  taxPriceEl.textContent = `$${tax.toFixed(2)}`;
  totalPriceEl.textContent = `$${total.toFixed(2)}`;
}

// Toast System
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Event Listeners
function setupEventListeners() {
  // Drawer open/close
  openCartBtn.addEventListener("click", () => {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
  });

  const closeCart = () => {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
  };

  closeCartBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  // Search input filter
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  // Category filter tabs
  categoryContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("pill-btn")) {
      document.querySelectorAll(".pill-btn").forEach(btn => btn.classList.remove("active"));
      e.target.classList.add("active");
      currentCategory = e.target.dataset.category;
      renderProducts();
    }
  });

  // Modal handlers
  checkoutBtn.addEventListener("click", () => {
    closeCart();
    checkoutModal.classList.add("active");
  });

  closeModalBtn.addEventListener("click", () => {
    checkoutModal.classList.remove("active");
  });

  // Checkout submission
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    checkoutModal.classList.remove("active");
    showToast("🎉 ការបញ្ជាទិញទទួលបានជោគជ័យ! យើងនឹងទាក់ទងលោកអ្នកភ្លាមៗ។");
    cart = [];
    updateCartUI();
    checkoutForm.reset();
  });
}