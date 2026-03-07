// Menu Data
const menuItems = [
    { id: 1, name: "Paneer Butter Masala", price: 250, image: "https://picsum.photos/seed/paneerbutter/400/300" },
    { id: 2, name: "Kadhai Paneer", price: 240, image: "https://picsum.photos/seed/kadhaipaneer/400/300" },
    { id: 3, name: "Aloo Dum", price: 180, image: "https://picsum.photos/seed/aloodum/400/300" },
    { id: 4, name: "Matar Aloo", price: 160, image: "https://picsum.photos/seed/mataraloo/400/300" },
    { id: 5, name: "Plain Rice", price: 90, image: "https://picsum.photos/seed/plainrice/400/300" },
    { id: 6, name: "Tawa Roti", price: 15, image: "https://picsum.photos/seed/tawaroti/400/300" },
    { id: 7, name: "Tawa Paratha", price: 30, image: "https://picsum.photos/seed/tawaparatha/400/300" },
    { id: 8, name: "Pani Puri", price: 50, image: "https://picsum.photos/seed/panipuri/400/300" }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('krishna_cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Render Menu if on menu page
    const menuContainer = document.getElementById('menu-container');
    if (menuContainer) {
        renderMenu();
    }
    
    // Render Cart if on cart page
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer) {
        renderCart();
        
        // Handle Checkout Form
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', handleCheckout);
        }
    }
});

// Render Menu Items
function renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" referrerPolicy="no-referrer">
            <h3>${item.name}</h3>
            <div class="price">₹${item.price}</div>
            <button class="btn" onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        menuContainer.appendChild(menuItem);
    });
}

// Add to Cart
function addToCart(id) {
    const item = menuItems.find(m => m.id === id);
    if (item) {
        const existingItem = cart.find(c => c.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        alert(`${item.name} added to cart!`);
    }
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
    updateCartCount();
    renderCart();
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('krishna_cart', JSON.stringify(cart));
}

// Update Cart Count in Header
function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = totalItems;
    }
}

// Render Cart Items
function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">Your cart is empty. <br><br><a href="menu.html" class="btn">Go to Menu</a></div>';
        totalElement.textContent = '₹0';
        return;
    }
    
    container.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">₹${item.price} x ${item.quantity} = ₹${itemTotal}</div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        container.appendChild(cartItem);
    });
    
    totalElement.textContent = `₹${total}`;
}

// Handle Checkout
function handleCheckout(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    let total = 0;
    let orderDetails = `*New Order - Krishna Food*%0A%0A`;
    orderDetails += `*Customer Details:*%0A`;
    orderDetails += `Name: ${name}%0A`;
    orderDetails += `Phone: ${phone}%0A`;
    orderDetails += `Address: ${address}%0A%0A`;
    orderDetails += `*Order Items:*%0A`;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderDetails += `- ${item.name} (${item.quantity} x ₹${item.price}) = ₹${itemTotal}%0A`;
    });
    
    orderDetails += `%0A*Total Amount: ₹${total}*`;
    
    // Replace with actual WhatsApp number
    const whatsappNumber = "919876543210"; 
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${orderDetails}`;
    
    // Clear cart after order
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
}
