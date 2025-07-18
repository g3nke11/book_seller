import { handleSearch } from "./search.js"

function displayBooks(data) {
  const list = document.getElementById("cart-content");
  list.innerHTML = ""; // Clear existing content

  if (!data || data.length === 0) {
    list.innerHTML = "<p>No books to display.</p>";
    return;
  }

  data.forEach(book => {
    const card = document.createElement("div");
    card.classList.add("book-card");

    card.innerHTML = `
      <img src="${book.cover}" class="book-cover" alt="${book.title}">
      <div class="book-info">
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p>${book.description}</p>
        <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
        <button onclick="addToCart(${book.id})">Add to Cart</button>
      </div>
    `;
    list.appendChild(card);
  });
}

// Function to load books from localStorage
// function loadBooksFromLocalStorage() {
//   const booksJSON = localStorage.getItem("bookShoppeCart"); // Assuming you store your books under the key "books"
//   if (booksJSON) {
//     try {
//       const books = JSON.parse(booksJSON);
//       displayBooks(books);
//     } catch (e) {
//       console.error("Error parsing books from localStorage:", e);
//       displayBooks([]); // Display an empty state if parsing fails
//     }
//   } else {
//     displayBooks([]); // Display an empty state if no books are found in localStorage
//   }
// }

function getCartFromLocalStorage() {
    try {
        // Attempt to retrieve the cart string from localStorage
        const cartString = localStorage.getItem('bookShoppeCart');

        // If a cart string exists, parse it back into a JavaScript array/object
        if (cartString) {
            return JSON.parse(cartString);
        } else {
            // If no cart string is found, return an empty array to signify an empty cart
            return [];
        }
    } catch (error) {
        // Handle potential errors, e.g., malformed JSON in localStorage
        console.error("Error retrieving or parsing cart from localStorage:", error);
        // In case of an error, it's safer to return an empty array
        return [];
    }
}

function displayCart() {
    const cart = getCartFromLocalStorage(); // Pull the cart data

    const cartItemsContainer = document.getElementById('cart-content'); // Assuming you have a div/ul for cart items
    if (!cartItemsContainer) {
        console.error("Cart items container not found!");
        return;
    }

    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        console.log("Cart is empty.");
        return;
    }

    let totalItems = 0;
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item'); // Add a class for styling
        itemElement.innerHTML = `
                <img src="{imageUrl}" class="book-cover" alt="${item.title}">
                <div class="book-info">
                    <h2>${item.title}</h2>
                    <p><strong>Author:</strong> ${item.author}</p>
                    <p><strong>Price:</strong> ${book.price ? book.price.toFixed(2) : 'N/A'}</p>
                </div>
            <span>Quantity: ${item.quantity}</span>
            <button onclick="removeFromCart('${item.id}')">Remove</button>
            <button onclick="increaseQuantity('${item.id}')">+</button>
            <button onclick="decreaseQuantity('${item.id}')">-</button>
        `;
        cartItemsContainer.appendChild(itemElement);
        totalItems += item.quantity;
    });

    // You might also want to display total items or total price
    document.getElementById('total-items-in-cart').textContent = `Total Items: ${totalItems}`; // Assuming an element for this
    console.log("Displaying cart:", cart);
}

function filterBooks(keyword) {
  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(keyword.toLowerCase()) ||
    b.author.toLowerCase().includes(keyword.toLowerCase())
  );
  displayBooks(filtered);
}

// Call this function when your page loads to display the books
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector('.search-bar input[type="text"]');
  if (searchInput) {
    // Listen for the 'Enter' key press in the search input field.
    searchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    });
  }
  // loadBooksFromLocalStorage();
  displayCart();
}
);