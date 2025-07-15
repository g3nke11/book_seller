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
function loadBooksFromLocalStorage() {
  const booksJSON = localStorage.getItem("bookShoppeCart"); // Assuming you store your books under the key "books"
  if (booksJSON) {
    try {
      const books = JSON.parse(booksJSON);
      displayBooks(books);
    } catch (e) {
      console.error("Error parsing books from localStorage:", e);
      displayBooks([]); // Display an empty state if parsing fails
    }
  } else {
    displayBooks([]); // Display an empty state if no books are found in localStorage
  }
}

// Call this function when your page loads to display the books
document.addEventListener("DOMContentLoaded", () => {
    loadBooksFromLocalStorage();
    document.getElementById("search").addEventListener("input", e => {
        filterBooks(e.target.value);
      });
    
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
}
);