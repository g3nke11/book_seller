import { handleSearch } from "./search.js"; // Assuming this is still needed for your search bar

// Declare a variable to hold all book data, making it accessible globally within this module
let allBooksData = [];

/**
 * Fetches the books.json data and stores it.
 * This should be called once when the page loads.
 */
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
        // Handle gracefully, maybe disable cart display or show an error message
        const cartItemsContainer = document.getElementById('cart-content');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '<p>Could not load book details. Please try again later.</p>';
        }
    }
}

/**
 * Retrieves the shopping cart from localStorage.
 * @returns {Array} An array of cart items, or an empty array if no cart is found or an error occurs.
 */
function getCartFromLocalStorage() {
    try {
        const cartString = localStorage.getItem('bookShoppeCart');
        return cartString ? JSON.parse(cartString) : [];
    } catch (error) {
        console.error("Error retrieving or parsing cart from localStorage:", error);
        return [];
    }
}

/**
 * Displays the current shopping cart in the specified HTML container,
 * fetching full book details from the loaded 'allBooksData'.
 */
function displayCart() {
    const cart = getCartFromLocalStorage(); // Get the cart data from localStorage

    const cartItemsContainer = document.getElementById('cart-content');
    if (!cartItemsContainer) {
        console.error("Error: '#cart-content' element not found in the DOM.");
        return;
    }

    cartItemsContainer.innerHTML = ''; // Clear any existing content

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your shopping cart is currently empty.</p>';
        updateCartTotalDisplay(0);
        return;
    }

    let totalItemsInCart = 0;
    let totalPrice = 0; // To calculate total price

    // Create a DocumentFragment for efficient DOM manipulation
    const fragment = document.createDocumentFragment();

    cart.forEach(cartItem => {
        // Find the full book details using the ID from the cart item
        const fullBookDetails = allBooksData.find(book => book.id.toString() === cartItem.id);

        if (fullBookDetails) {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item'); // Add a class for CSS styling

            // Fallback for image URL if 'cover' is not present
            const imageUrl = fullBookDetails.cover || fullBookDetails.image || 'https://placehold.co/150x200/cccccc/333333?text=No+Image';

            // Populate the item's content with full details from `fullBookDetails`
            itemElement.innerHTML = `
              <div class='book-card'>
                <img src="${imageUrl}" class="book-cover" alt="${fullBookDetails.title}">
                <div class="book-info">
                    <h2>${fullBookDetails.title}</h2>
                    <p><strong>Author:</strong> ${fullBookDetails.author || 'N/A'}</p>
                    <p><strong>Genre:</strong> ${fullBookDetails.genre || 'N/A'}</p>
                    <p><strong>Price:</strong> $${fullBookDetails.price ? fullBookDetails.price.toFixed(2) : 'N/A'}</p>
                </div>
                <div class="cart-item-controls">
                    <span>Quantity: ${cartItem.quantity}</span>
                    <div class="quantity-buttons">
                        <button onclick="decreaseQuantity('${cartItem.id}')" aria-label="Decrease quantity of ${fullBookDetails.title}">-</button>
                        <button onclick="increaseQuantity('${cartItem.id}')" aria-label="Increase quantity of ${fullBookDetails.title}">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${cartItem.id}')" aria-label="Remove ${fullBookDetails.title} from cart">Remove</button>
                </div>
              </div>
            `;
            fragment.appendChild(itemElement);

            totalItemsInCart += cartItem.quantity;
            if (fullBookDetails.price) {
                totalPrice += fullBookDetails.price * cartItem.quantity;
            }

        } else {
            // Handle case where book details are not found (e.g., book removed from JSON, or ID mismatch)
            console.warn(`Book with ID ${cartItem.id} not found in allBooksData. Displaying limited info.`);
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item', 'missing-book');
            itemElement.innerHTML = `
                <p><strong>Item ID: ${cartItem.id}</strong></p>
                <p>${cartItem.title} (Quantity: ${cartItem.quantity})</p>
                <p><em>Details unavailable.</em></p>
                <button class="remove-btn" onclick="removeFromCart('${cartItem.id}')">Remove Missing Item</button>
            `;
            fragment.appendChild(itemElement);
            totalItemsInCart += cartItem.quantity; // Still count towards total items
        }
    });

    cartItemsContainer.appendChild(fragment); // Append all items at once

    updateCartTotalDisplay(totalItemsInCart);
    updateCartTotalPriceDisplay(totalPrice); // New function to display total price
    console.log("Shopping cart displayed:", cart);
}

// --- Placeholder Functions for Cart Actions (Implement these fully) ---

function removeFromCart(bookId) {
    let cart = getCartFromLocalStorage();
    cart = cart.filter(item => item.id !== bookId);
    localStorage.setItem('bookShoppeCart', JSON.stringify(cart));
    displayCart(); // Re-render the cart
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
            // If quantity is 1 and we decrease, remove the item
            cart.splice(itemIndex, 1);
            showMessageBox(`Item removed from cart!`);
        }
        localStorage.setItem('bookShoppeCart', JSON.stringify(cart));
        displayCart();
    }
}

/**
 * Updates a display element for the total number of items in the cart.
 * @param {number} total The total number of items.
 */
function updateCartTotalDisplay(total) {
    const totalElement = document.getElementById('cart-total-count');
    if (totalElement) {
        totalElement.textContent = total;
    }
}

/**
 * New function: Updates a display element for the total price of items in the cart.
 * @param {number} total The total price.
 */
function updateCartTotalPriceDisplay(total) {
    const totalElement = document.getElementById('cart-total-price'); // Assuming an element with this ID
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}


/**
 * Displays a custom message box instead of alert().
 * This function is copied from your other file for convenience in cart.js.
 * Ideally, this would be in a shared utility file.
 * @param {string} message - The message to display.
 */
function showMessageBox(message) {
    let messageBox = document.getElementById('custom-message-box');
    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'custom-message-box';
        messageBox.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50; /* Green */
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


// --- Initialization ---
// Make sure to call loadAllBooksData BEFORE displayCart
document.addEventListener("DOMContentLoaded", async () => {
    // If you have a search bar on your cart page, keep this:
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Load the book data first
    await loadAllBooksData();

    // Then display the cart, using the loaded book data
    displayCart();
});

// Export functions if other modules need to call them
// export { displayCart, getCartFromLocalStorage, showMessageBox }; // You might export these