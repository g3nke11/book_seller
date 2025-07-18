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

// --- NEW FUNCTIONS FOR EMAIL ---

/**
 * Validates an email address format using a simple regex.
 * @param {string} email The email string to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function isValidEmail(email) {
    // A common regex for email validation. Not exhaustive, but good enough for basic check.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Generates the email body content from the current cart.
 * @returns {string} The formatted text for the email body.
 */
function generateEmailBody() {
    const cart = getCartFromLocalStorage();
    let emailBody = "Dear Customer,\n\n";
    emailBody += "Thank you for your interest in Book Shoppe! Here is a summary of your cart:\n\n";

    if (cart.length === 0) {
        emailBody += "Your cart is currently empty.\n\n";
    } else {
        cart.forEach((cartItem, index) => {
            const fullBookDetails = allBooksData.find(book => book.id.toString() === cartItem.id);
            if (fullBookDetails) {
                emailBody += `${index + 1}. Title: ${fullBookDetails.title}\n`;
                emailBody += `   Author: ${fullBookDetails.author || 'N/A'}\n`;
                emailBody += `   Price: $${fullBookDetails.price ? fullBookDetails.price.toFixed(2) : 'N/A'}\n`;
                emailBody += `   Quantity: ${cartItem.quantity}\n`;
                emailBody += `   Subtotal: $${(fullBookDetails.price * cartItem.quantity).toFixed(2)}\n\n`;
            } else {
                emailBody += `${index + 1}. Item ID: ${cartItem.id}\n`;
                emailBody += `   Title: ${cartItem.title} (Details unavailable)\n`;
                emailBody += `   Quantity: ${cartItem.quantity}\n\n`;
            }
        });

        // Get total price from the display function's logic
        const totalPriceElement = document.getElementById('cart-total-price');
        const totalPrice = totalPriceElement ? totalPriceElement.textContent.replace('$', '') : '0.00';

        emailBody += `--------------------------------------\n`;
        emailBody += `Total Items: ${document.getElementById('cart-total-count').textContent}\n`;
        emailBody += `Total Cart Price: $${totalPrice}\n\n`;
    }

    emailBody += "Thank you for shopping with us!\n";
    emailBody += "Book Shoppe Team";

    // Encode the body for use in a mailto link
    return encodeURIComponent(emailBody);
}


/**
 * Handles the click event for the "Send Cart to Email" button.
 * Validates email and constructs a mailto link.
 */
function sendCartToEmail() {
    const customerEmailInput = document.getElementById('customer-email');
    const emailError = document.getElementById('email-error');
    const customerEmail = customerEmailInput.value.trim();

    if (!isValidEmail(customerEmail)) {
        emailError.style.display = 'block'; // Show error message
        showMessageBox("Please enter a valid email address.");
        return;
    } else {
        emailError.style.display = 'none'; // Hide error message if valid
    }

    const emailSubject = encodeURIComponent("Your Book Shoppe Cart Summary");
    const emailBody = generateEmailBody();

    // Construct the mailto link
    const mailtoLink = `mailto:${customerEmail}?subject=${emailSubject}&body=${emailBody}`;

    // Open the user's default email client
    window.location.href = mailtoLink;

    showMessageBox("Opening your email client with cart details.");
    // Optionally clear the email input after sending
    // customerEmailInput.value = '';
}


// --- Initialization ---
document.addEventListener("DOMContentLoaded", async () => {
    // Initialize search bar functionality if present
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Load all book data first
    await loadAllBooksData();

    // Then display the cart, using the loaded book data
    displayCart();

    // Attach event listener to the "Send Cart to Email" button
    const emailCartButton = document.getElementById('email-cart-btn');
    if (emailCartButton) {
        emailCartButton.addEventListener('click', sendCartToEmail);
    }
});

// document.addEventListener("DOMContentLoaded", async () => {
//     const searchInput = document.querySelector('.search-bar input[type="text"]');
//     if (searchInput) {
//         searchInput.addEventListener('keypress', (event) => {
//             if (event.key === 'Enter') {
//                 handleSearch();
//             }
//         });
//     }

//     await loadAllBooksData();
//     displayCart();
// });