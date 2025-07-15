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
document.addEventListener("DOMContentLoaded", loadBooksFromLocalStorage);

// You'll also need to ensure that when you save books to localStorage, you're doing it correctly.
// For example, when adding or updating books:
function saveBooksToLocalStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}