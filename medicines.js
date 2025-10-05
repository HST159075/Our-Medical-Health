let cart = []; // Global cart array

// Load medicines from JSON
document.addEventListener("DOMContentLoaded", () => {
  fetch("medicine.json")
    .then(response => response.json())
    .then(data => displayMedicines(data))
    .catch(err => console.error(err));

  // Checkout button event
  const checkoutBtn = document.getElementById("checkoutBtn");
  const paymentModal = document.getElementById("paymentModal");
  const closeModal = document.getElementById("closeModal");

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("🛒 Your cart is empty!");
      return;
    }
    updateCartSummary();
    paymentModal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    paymentModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === paymentModal) paymentModal.style.display = "none";
  });

  // Payment method toggle
  const paymentOptions = document.getElementsByName("payMethod");
  const cardForm = document.getElementById("cardForm");
  const mobilePayForm = document.getElementById("mobilePayForm");

  paymentOptions.forEach(opt => {
    opt.addEventListener("change", () => {
      if (document.querySelector('input[name="payMethod"]:checked').value === "card") {
        cardForm.style.display = "block";
        mobilePayForm.style.display = "none";
      } else {
        cardForm.style.display = "none";
        mobilePayForm.style.display = "block";
      }
    });
  });

  // Card Form submit
  cardForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Payment Successful via Card! Total: ৳" + getCartTotal());
    cart = [];
    updateCartSummary();
    cardForm.reset();
    paymentModal.style.display = "none";
  });

  // Mobile Pay Form submit
  mobilePayForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Payment Successful via Mobile! Total: ৳" + getCartTotal());
    cart = [];
    updateCartSummary();
    mobilePayForm.reset();
    paymentModal.style.display = "none";
  });
});

// Display medicines dynamically
function displayMedicines(medicines) {
  const container = document.getElementById("medicine-container");
  container.innerHTML = "";
  medicines.forEach(med => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    const companyOptions = med.companies.map(c => `<option value="${c}">${c}</option>`).join("");
    productDiv.innerHTML = `
      <img src="${med.image}" alt="${med.name}" class="product-img">
      <h3>${med.name}</h3>
      <p>${med.description}</p>
      <label>Select Company:</label>
      <select id="company-${med.name.replace(/\s+/g,'-')}">${companyOptions}</select>
      <button onclick="addToCart('${med.name}', ${med.price}, document.getElementById('company-${med.name.replace(/\s+/g,'-')}').value)">Buy Now</button>
    `;
    container.appendChild(productDiv);
  });
}

// Add to cart
function addToCart(name, price, company) {
  cart.push({ name, price, company });
  alert(`🛒 Added ${name} (${company}) to your cart!`);
  displayCart();
}

// Display cart in main page
function displayCart() {
  const cartList = document.getElementById("cart-items");
  const totalElem = document.getElementById("total");
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} (${item.company}) - ৳${item.price} <button class="remove-btn" onclick="removeFromCart(${index})">X</button>`;
    cartList.appendChild(li);
    total += item.price;
  });
  totalElem.textContent = total;
}

// Remove item
function removeFromCart(index) {
  cart.splice(index, 1);
  displayCart();
}

// Search medicine
function searchMedicine() {
  const input = document.getElementById("searchBar").value.toLowerCase();
  const products = document.querySelectorAll(".product");
  products.forEach(product => {
    const name = product.querySelector("h3").textContent.toLowerCase();
    product.style.display = name.includes(input) ? "inline-block" : "none";
  });
}

// Checkout modal cart summary
function updateCartSummary() {
  const cartItemsList = document.getElementById("cartItems");
  const cartTotalSpan = document.getElementById("cartTotal");
  cartItemsList.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} (${item.company})`;
    const span = document.createElement("span");
    span.textContent = "৳" + item.price;
    li.appendChild(span);
    cartItemsList.appendChild(li);
    total += item.price;
  });
  cartTotalSpan.textContent = total;
}

// Get total
function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

// Go to checkout page (optional)
function goToCheckout() {
  if(cart.length===0){
    alert("Cart is empty!");
    return;
  }
  updateCartSummary();
  document.getElementById("paymentModal").style.display="block";
}
