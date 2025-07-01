import { handleSearch } from "./search.js"

// This function will be the main entry point for the book details/search results page.
async function initBookDetailsPage() {
    // Get a reference to the container where book details or search results will be displayed.
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    if (searchInput) {
        // Listen for the 'Enter' key press in the search input field.
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleSearch();
            }
        });
        // If you have a dedicated search button, you would add an event listener to it here.
        // Example: const searchButton = document.querySelector('.search-bar button');
        // if (searchButton) { searchButton.addEventListener('click', handleSearch); }
    }


    const detailsContainer = document.getElementById('content');

    // If the container is not found, log an error and exit.
    if (!detailsContainer) {
        console.error("Book details container with ID 'content' not found.");
        return;
    }

    // Display a loading message while data is being fetched.
    detailsContainer.innerHTML = '<p>Loading book information...</p>';

    let allBooks = []; // This will store all books fetched from books.json

    try {
        // Fetch the books.json file.
        // Ensure 'books.json' is accessible from this page's context (e.g., at the root).
        const response = await fetch("books.json");

        // Check if the network request was successful.
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} from ${response.url}`);
        }

        // Parse the JSON response into an array of book objects.
        allBooks = await response.json();

    } catch (error) {
        // Log any errors during fetching and display an error message to the user.
        console.error("Error fetching books data:", error);
        detailsContainer.innerHTML = `
            <h1>Error Loading Books</h1>
            <p>We encountered an issue loading book information. Please try again later.</p>
            <p><a href="index.html">Back to Home</a></p>
        `;
        return; // Stop execution if books data can't be loaded.
    }

    // Get URL parameters to determine if we're showing a single book or search results.
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');       // Parameter for single book details
    const searchQuery = urlParams.get('query'); // Parameter for search results

    // --- Logic for displaying content based on URL parameters ---

    if (bookId) {
        // If an 'id' parameter is present, display details for that specific book.
        displaySingleBook(bookId, allBooks, detailsContainer);
    } else if (searchQuery) {
        // If a 'query' parameter is present, filter and display search results.
        displaySearchResults(searchQuery, allBooks, detailsContainer);
    } else {
        // If neither 'id' nor 'query' is present, display a default message.
        detailsContainer.innerHTML = `
            <h1>Welcome to the Book Details Page!</h1>
            <p>You can view individual book details by clicking on a book from the <a href="index.html">home page</a>, or by using the search bar.</p>
        `;
    }
}

/**
 * Displays the details of a single book.
 * @param {string} bookId - The ID of the book to display.
 * @param {Array} allBooks - The array containing all book objects.
 * @param {HTMLElement} container - The HTML element to render the book details into.
 */
function displaySingleBook(bookId, allBooks, container) {
    // Find the book in the 'allBooks' array that matches the provided ID.
    // Ensure type consistency: bookId from URL is a string, so convert book.id to string for comparison.
    const book = allBooks.find(b => b.id.toString() === bookId);

    // If the book is found, render its details.
    if (book) {
        container.innerHTML = `
            <div class="book-detail-card">
                <img src="${book.cover || book.image}" alt="${book.title}" class="book-detail-cover">
                <div class="book-info">
                    <h1>${book.title}</h1>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Genre:</strong> ${book.genre}</p>
                    <p>${book.description}</p>
                    <p><strong>Price:</strong> $${book.price ? book.price.toFixed(2) : 'N/A'}</p>
                    <button class="add-to-cart-btn" data-book-title="${book.title}" data-book-id="${book.id}">Add to Cart</button>
                    <p><a href="index.html">Back to Home</a></p>
                </div>
            </div>
        `;
        // Attach event listener to the "Add to Cart" button after it's rendered.
        const addToCartButton = container.querySelector('.add-to-cart-btn');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', (event) => {
                const title = event.target.dataset.bookTitle;
                const id = event.target.dataset.bookId;
                addToCart(title, id);
            });
        }
    } else {
        // If the book is not found, display an error message.
        container.innerHTML = `
            <h1>Book Not Found</h1>
            <p>No book with ID: "${bookId}" was found. Please check the <a href="index.html">home page</a>.</p>
        `;
    }
}

/**
 * Filters books based on a search query and displays the results.
 * @param {string} query - The search query string.
 * @param {Array} allBooks - The array containing all book objects.
 * @param {HTMLElement} container - The HTML element to render the search results into.
 */
function displaySearchResults(query, allBooks, container) {
    // Convert query to lowercase for case-insensitive matching.
    const lowerCaseQuery = query.toLowerCase();

    // Filter all books based on the search query.
    // Checks title, author, genre, and description fields.
    const filteredBooks = allBooks.filter(book =>
        (book.title && book.title.toLowerCase().includes(lowerCaseQuery)) ||
        (book.author && book.author.toLowerCase().includes(lowerCaseQuery)) ||
        (book.genre && book.genre.toLowerCase().includes(lowerCaseQuery)) ||
        (book.description && book.description.toLowerCase().includes(lowerCaseQuery))
    );

    // Clear previous content in the container.
    container.innerHTML = '';

    // Display the search results heading.
    const heading = document.createElement('h1');
    heading.textContent = `Search Results for "${query}"`;
    container.appendChild(heading);

    // Create a div to hold the grid of search result cards.
    const resultsGrid = document.createElement('div');
    resultsGrid.classList.add('search-results-grid'); // Add a class for CSS styling (e.g., grid layout)
    container.appendChild(resultsGrid);

    if (filteredBooks.length > 0) {
        // If books are found, iterate and display each one as a card.
        filteredBooks.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('book-card'); // Use the same class as bestsellers for consistent styling.

            // Construct the link for individual book details.
            const bookLink = document.createElement('a');
            bookLink.href = `base.html?id=${book.id}`;

            // Use 'book.cover' if available, otherwise fallback to 'book.image' (from bestseller.js example)
            const imageUrl = book.cover || book.image || 'https://placehold.co/150x200/cccccc/333333?text=No+Image';

            card.innerHTML = `
                <img src="${imageUrl}" class="book-cover" alt="${book.title}">
                <div class="book-info">
                    <h2>${book.title}</h2>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Genre:</strong> ${book.genre}</p>
                    <p><strong>Price:</strong> $${book.price ? book.price.toFixed(2) : 'N/A'}</p>
                    <button class="add-to-cart-btn" data-book-title="${book.title}" data-book-id="${book.id}">Add to Cart</button>
                </div>
            `;
            // Append the card's content to the link
            bookLink.appendChild(card);
            resultsGrid.appendChild(bookLink); // Append the entire clickable card to the grid.

            // Attach event listener to the "Add to Cart" button for each card.
            // Note: We need to query within the 'card' to get the specific button.
            const addToCartButton = card.querySelector('.add-to-cart-btn');
            if (addToCartButton) {
                addToCartButton.addEventListener('click', (event) => {
                    // Prevent the link from being followed when clicking the button
                    event.preventDefault();
                    event.stopPropagation(); // Stop event from bubbling up to the link
                    const title = event.target.dataset.bookTitle;
                    const id = event.target.dataset.bookId;
                    addToCart(title, id);
                });
            }
        });
    } else {
        // If no books match the search query, display a message.
        resultsGrid.innerHTML = `<p>No books found matching "${query}".</p>`;
    }
    // Add a back to home link after search results
    const backLink = document.createElement('p');
    backLink.innerHTML = '<a href="index.html">Back to Home</a>';
    container.appendChild(backLink);
}

/**
 * Adds a book title to the shopping cart stored in localStorage.
 * @param {string} bookTitle - The title of the book to add.
 * @param {string} bookId - The ID of the book to add.
 */
function addToCart(bookTitle, bookId) {
    // Retrieve the current cart from localStorage.
    // If no cart exists, initialize it as an empty array.
    let cart = JSON.parse(localStorage.getItem('bookShoppeCart')) || [];

    // Check if the book (by ID) is already in the cart to avoid duplicates.
    const existingItem = cart.find(item => item.id === bookId);

    if (existingItem) {
        // If it exists, increment its quantity.
        existingItem.quantity = (existingItem.quantity || 1) + 1;
        showMessageBox(`"${bookTitle}" quantity updated in cart!`);
    } else {
        // If it's a new item, add it with a quantity of 1.
        cart.push({ id: bookId, title: bookTitle, quantity: 1 });
        showMessageBox(`"${bookTitle}" added to cart!`);
    }

    // Save the updated cart back to localStorage.
    localStorage.setItem('bookShoppeCart', JSON.stringify(cart));
    console.log("Current Cart in localStorage:", cart);
}

/**
 * Displays a custom message box instead of alert().
 * @param {string} message - The message to display.
 */
function showMessageBox(message) {
    // Create or find the message box element
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
    messageBox.style.opacity = '1'; // Fade in

    // Hide after 3 seconds
    setTimeout(() => {
        messageBox.style.opacity = '0'; // Fade out
    }, 3000);
}


// Ensure the script runs only after the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', initBookDetailsPage);