const burgers = [
    { id: 1, name: "Classic Burger", description: "Saftiges Rindfleisch mit Salat, Tomate, Zwiebeln und unserer Spezial-Sauce", price: 12.50, image: "images/hamburger.jpg" },
    { id: 2, name: "Cheese Burger", description: "Unser Classic Burger mit würzigem Cheddar-Käse", price: 13.50, image: "images/cheeseBurger.jpg" },
    { id: 3, name: "Bacon Burger", description: "Classic Burger mit knusprigem Bacon und BBQ-Sauce", price: 15.00, image: "images/baconBurger.avif" },
    { id: 4, name: "Veggie Burger", description: "Hausgemachter Gemüse-Patty mit frischem Gemüse und Kräuter-Dip", price: 12.50, image: "images/veggieBurger.jpg" },
    { id: 5, name: "Double Burger", description: "Für den großen Hunger: Doppeltes Fleisch, doppelter Käse", price: 18.50, image: "images/doubleBurger.jpg" },
    { id: 6, name: "Chili Burger", description: "Mit Jalapeños und scharfer Chili-Sauce für Liebhaber der Schärfe", price: 16.00, image: "images/chilliCheeseBurger.webp" }
];
const sides = [
    { id: 101, name: "Pommes Frites", description: "Knusprige Pommes, perfekt gesalzen", price: 6.00, image: "images/fries.webp" },
    { id: 102, name: "Zwiebelringe", description: "Frische Zwiebelringe in Bierteig", price: 4.50, image: "images/onionRings.jpg" },
    { id: 103, name: "Gemischter Salat", description: "Frischer Salat mit knackigem Gemüse", price: 3.50, image: "images/mixedSalad.jpg" }
];
const drinks = [
    { id: 201, name: "Cola", description: "Erfrischende Cola", price: 4.00, image: "images/coke.jpg" },
    { id: 202, name: "Fanta", description: "Fruchtig erfrischend", price: 4.00, image: "images/fanta.webp" },
    { id: 203, name: "Mineralwasser", description: "Natürliches Mineralwasser", price: 3.50, image: "images/sparklingWater.jpg" }
];
const menuItems = { burgers, sides, drinks };
let currentCategory = 'burgers';
let cart = [];
let orderCounter = 1;

const menuContainer = document.getElementById('menu-container');
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.getElementById('cart-icon');
const closeModal = document.getElementById('close-modal');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalPrice = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const categoryButtons = document.querySelectorAll('.category-button');

function renderMenu(category) {
    menuContainer.innerHTML = '';
    const items = menuItems[category];
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML =
            `<div class="item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <p class="item-price">${item.price.toFixed(2).replace('.', ',')} CHF</p>
                <button class="add-to-cart" data-id="${item.id}" data-category="${category}">In den Warenkorb</button>
            </div>`;
        menuContainer.appendChild(itemCard);
    });
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.getAttribute('data-id'));
            const itemCategory = button.getAttribute('data-category');
            addToCart(itemId, itemCategory);
        });
    });
}

function addToCart(itemId, category) {
    const item = menuItems[category].find(i => i.id === itemId);
    const existingCartItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        cart.push({ id: item.id, name: item.name, price: item.price, quantity: 1 });
    }
    updateCart();
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

function updateCart() {
    renderCartItems();
    updateCartCount();
    updateTotalPrice();
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Dein Warenkorb ist leer.</p>';
        return;
    }
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML =
            `<div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price.toFixed(2).replace('.', ',')} CHF</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn decrease" data-id="${item.id}">–</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item" data-id="${item.id}">🗑️</button>`;
        cartItemsContainer.appendChild(cartItem);
    });
    const decreaseButtons = document.querySelectorAll('.decrease');
    const increaseButtons = document.querySelectorAll('.increase');
    const removeButtons = document.querySelectorAll('.remove-item');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.getAttribute('data-id'));
            decreaseQuantity(itemId);
        });
    });
    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.getAttribute('data-id'));
            increaseQuantity(itemId);
        });
    });
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

function updateTotalPrice() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = total.toFixed(2).replace('.', ',') + ' CHF';
}

function decreaseQuantity(itemId) {
    const cartItem = cart.find(item => item.id === itemId);
    if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
    } else {
        removeFromCart(itemId);
        return;
    }
    updateCart();
}

function increaseQuantity(itemId) {
    const cartItem = cart.find(item => item.id === itemId);
    cartItem.quantity += 1;
    updateCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

function openCartModal() {
    cartModal.classList.add('active');
    overlay.classList.add('active');
}

function closeCartModal() {
    cartModal.classList.remove('active');
    overlay.classList.remove('active');
}

function getCurrentDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function createEmployeeOrderView(orderData) {
    let orderView = `Bestellnummer: #${orderData.order_number}\n`;
    orderView += `Tisch: ${orderData.table_number}\n`;
    orderView += `Bestellzeit: ${orderData.order_time}\n`;
    orderView += `Bestellung:\n`;
    orderData.order_items.forEach(item => {
        orderView += `${item.quantity}x ${item.name} - ${(item.price * item.quantity).toFixed(2).replace('.', ',')} CHF\n`;
    });
    const total = orderData.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderView += `\nGesamt: ${total.toFixed(2).replace('.', ',')} CHF`;
    return orderView;
}

function saveOrder(tableNumber) {
    if (cart.length === 0) {
        alert('Der Warenkorb ist leer.');
        return null;
    }
    const orderData = {
        order_number: orderCounter++,
        table_number: tableNumber,
        order_time: getCurrentDateTime(),
        order_items: [...cart]
    };
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    return orderData;
}

function showOrderDialog() {
    if (cart.length === 0) {
        alert('Dein Warenkorb ist leer.');
        return;
    }
    const tableNumber = prompt('Bitte geben Sie die Tischnummer ein:', '1');
    if (tableNumber === null) return;
    const orderData = saveOrder(tableNumber);
    if (orderData) {
        const employeeOrderView = createEmployeeOrderView(orderData);
        alert('Bestellung wurde aufgenommen:\n\n' + employeeOrderView);
        startProcess(orderData);
        cart = [];
        updateCart();
        closeCartModal();
    }
}

function startProcess(orderData) {
    const urlProcessEngine = "http://localhost:8080/engine-rest/process-definition/key/guest_food_consumption/start";
    const orderItemsText = orderData.order_items.map(item => {
        return `${item.quantity}x ${item.name} (${(item.price * item.quantity).toFixed(2)} CHF)`;
    }).join(', ');
    const payload = {
        variables: {
            orderNumber: { value: orderData.order_number, type: "Integer" },
            tableNumber: { value: orderData.table_number, type: "String" },
            orderTime: { value: orderData.order_time, type: "String" },
            orderItems: { value: orderItemsText, type: "String" }
        }
    };
    fetch(urlProcessEngine, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP-Fehler: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("Camunda-Prozess gestartet:", data);
            alert("Camunda-Prozess erfolgreich gestartet!");
        })
        .catch(error => {
            console.error("Fehler beim Starten des Prozesses:", error);
            alert("Fehler beim Starten des Camunda-Prozesses.");
        });
}

cartIcon.addEventListener('click', openCartModal);
closeModal.addEventListener('click', closeCartModal);
overlay.addEventListener('click', closeCartModal);
checkoutBtn.addEventListener('click', showOrderDialog);

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length > 0) {
        orderCounter = Math.max(...orders.map(order => order.order_number)) + 1;
    }
}

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentCategory = button.getAttribute('data-category');
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        renderMenu(currentCategory);
    });
});

function viewAllOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length === 0) {
        alert('Keine Bestellungen vorhanden.');
        return;
    }
    let allOrdersView = 'Alle Bestellungen:\n\n';
    orders.forEach(order => {
        allOrdersView += createEmployeeOrderView(order) + '\n\n' + '-'.repeat(30) + '\n\n';
    });
    alert(allOrdersView);
}

function addEmployeeSection() {
    const employeeButton = document.createElement('button');
    employeeButton.textContent = 'Mitarbeiterbereich';
    employeeButton.className = 'employee-button';
    employeeButton.addEventListener('click', () => {
        const password = prompt('Bitte geben Sie das Mitarbeiterpasswort ein:');
        if (password === 'admin123') {
            viewAllOrders();
        } else {
            alert('Falsches Passwort.');
        }
    });
    document.querySelector('nav').appendChild(employeeButton);
}

function init() {
    renderMenu(currentCategory);
    loadCart();
    addEmployeeSection();
}

init();
