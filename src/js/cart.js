import { handleSearch } from "./search.js";

let allBooksData = [];

async function loadAllBooksData() {
    try {
        const response = await fetch("books.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allBooksData = await response.json();
        console.log("Books data loaded:", allBooksData);
    } catch (error) {
        console.error("Error fetching all books data:", error);
        const cartItemsContainer = document.getElementById('cart-content');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '<p>Could not load book details. Please try again later.</p>';
        }
    }
}

function getCartFromLocalStorage() {
    try {
        const cartString = localStorage.getItem('bookShoppeCart');
        return cartString ? JSON.parse(cartString) : [];
    } catch (error) {
        console.error("Error retrieving or parsing cart from localStorage:", error);
        return [];
    }
}

function displayCart() {
    const cart = getCartFromLocalStorage();
    const cartItemsContainer = document.getElementById('cart-content');

    if (!cartItemsContainer) {
        console.error("Error: '#cart-content' element not found in the DOM.");
        return;
    }

    cartItemsContainer.innerHTML = ''; // Clear existing content

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your shopping cart is currently empty.</p>';
        updateCartTotalDisplay(0);
        updateCartTotalPriceDisplay(0); // Also update total price to 0
        return;
    }

    let totalItemsInCart = 0;
    let totalPrice = 0;

    const fragment = document.createDocumentFragment();

    cart.forEach(cartItem => {
        const fullBookDetails = allBooksData.find(book => book.id.toString() === cartItem.id);

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        if (fullBookDetails) {
            const imageUrl = fullBookDetails.cover || fullBookDetails.image || 'https://placehold.co/150x200/cccccc/333333?text=No+Image';

            itemElement.innerHTML = `
                <div class='book-card'>
                    <img src="${imageUrl}" class="book-cover" alt="${fullBookDetails.title}">
                    <div class="book-info">
                        <h2>${fullBookDetails.title}</h2>
                        <p><strong>Author:</strong> ${fullBookDetails.author || 'N/A'}</p>
                        <p><strong>Genre:</strong> ${fullBookDetails.genre || 'N/A'}</p>
                        <p><strong>Price:</strong> $${fullBookDetails.price ? fullBookDetails.price.toFixed(2) : 'N/A'}</p>
                        <span>Quantity: ${cartItem.quantity}</span>
                        <div class="quantity-buttons">
                            <button class="decrease-btn" data-book-id="${cartItem.id}" aria-label="Decrease quantity of ${fullBookDetails.title}">-</button>
                            <button class="increase-btn" data-book-id="${cartItem.id}" aria-label="Increase quantity of ${fullBookDetails.title}">+</button>
                        </div>
                        <button class="remove-btn" data-book-id="${cartItem.id}" aria-label="Remove ${fullBookDetails.title} from cart">Remove</button>
                    </div>
                </div>
            `;
            totalItemsInCart += cartItem.quantity;
            if (fullBookDetails.price) {
                totalPrice += fullBookDetails.price * cartItem.quantity;
            }
        } else {
            console.warn(`Book with ID ${cartItem.id} not found in allBooksData. Displaying limited info.`);
            itemElement.classList.add('missing-book');
            itemElement.innerHTML = `
                <p><strong>Item ID: ${cartItem.id}</strong></p>
                <p>${cartItem.title} (Quantity: ${cartItem.quantity})</p>
                <p><em>Details unavailable.</em></p>
                <button class="remove-btn" data-book-id="${cartItem.id}">Remove Missing Item</button>
            `;
            totalItemsInCart += cartItem.quantity;
        }
        fragment.appendChild(itemElement);
    });

    cartItemsContainer.appendChild(fragment);

    // --- IMPORTANT: Attach Event Listeners AFTER elements are in the DOM ---

    // Attach listeners for increase quantity buttons
    cartItemsContainer.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const bookId = event.target.dataset.bookId;
            increaseQuantity(bookId);
        });
    });

    // Attach listeners for decrease quantity buttons
    cartItemsContainer.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const bookId = event.target.dataset.bookId;
            decreaseQuantity(bookId);
        });
    });

    // Attach listeners for remove buttons
    cartItemsContainer.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const bookId = event.target.dataset.bookId;
            removeFromCart(bookId);
        });
    });

    updateCartTotalDisplay(totalItemsInCart);
    updateCartTotalPriceDisplay(totalPrice);
    console.log("Shopping cart displayed:", cart);
}

// --- Cart Action Functions (remain largely the same, but now called via event listeners) ---

function removeFromCart(bookId) {
    let cart = getCartFromLocalStorage();
    cart = cart.filter(item => item.id !== bookId);
    localStorage.setItem('bookShoppeCart', JSON.stringify(cart));
    displayCart();
    showMessageBox(`Item removed from cart!`);
}

function increaseQuantity(bookId) {
    let cart = getCartFromLocalStorage();
    const item = cart.find(i => i.id === bookId);
    if (item) {
        item.quantity++;
        localStorage.setItem('bookShoppeCart', JSON.stringify(cart));
        displayCart();
        showMessageBox(`Quantity increased for item!`);
    }
}

function decreaseQuantity(bookId) {
    let cart = getCartFromLocalStorage();
    const itemIndex = cart.findIndex(i => i.id === bookId);
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
            showMessageBox(`Quantity decreased for item!`);
        } else {
            cart.splice(itemIndex, 1);
            showMessageBox(`Item removed from cart!`);
        }
        localStorage.setItem('bookShoppeCart', JSON.stringify(cart));
        displayCart();
    }
}

function updateCartTotalDisplay(total) {
    const totalElement = document.getElementById('cart-total-count');
    if (totalElement) {
        totalElement.textContent = total;
    }
}

function updateCartTotalPriceDisplay(total) {
    const totalElement = document.getElementById('cart-total-price');
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

function showMessageBox(message) {
    let messageBox = document.getElementById('custom-message-box');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'custom-message-box';
        messageBox.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            max-width: 300px;
            text-align: center;
        `;
        document.body.appendChild(messageBox);
    }

    messageBox.textContent = message;
    messageBox.style.opacity = '1';

    setTimeout(() => {
        messageBox.style.opacity = '0';
    }, 3000);
}

document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleSearch();
            }
        });
    }

    await loadAllBooksData();
    displayCart();
});