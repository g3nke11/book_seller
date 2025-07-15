import { handleSearch } from "./search.js"

/*const books = [
  {
    id: 1,
    title: "Onyx Storm",
    author: "Rebecca Yarros",
    genre: "Fiction",
    price: 14.99,
    image: "https://m.media-amazon.com/images/I/81dY-4XtCXL._UF1000,1000_QL80_.jpg",
    description: "The third installment in The Empyrean series, following Violet Sorrengail as she faces escalating challenges in a world of dragon riders and political intrigue."
  },
  {
    id: 2,
    title: "Broken Country",
    author: "Clare Leslie Hall",
    genre: "Fiction",
    price: 25.99,
    image: "https://m.media-amazon.com/images/I/81565rjI6fL.jpg",
    description: "A narrative exploring themes of love, loss, and resilience in a rural setting, delving into the lives of its complex characters."
  },
  {
    id: 3,
    title: "Careless People",
    author: "Sarah Wynn-Williams",
    genre: "Nonfiction",
    price: 27.99,
    image: "https://m.media-amazon.com/images/I/61qV0ieP64L.jpg",
    description: "A memoir detailing the author's experiences working at Facebook, offering insights into the tech industry's culture."
  },
  {
    id: 4,
    title: "Resolute",
    author: "Benjamin Hall",
    genre: "Nonfiction",
    price: 28.00,
    image: "https://m.media-amazon.com/images/I/71++dQPbYGL.jpg",
    description: " A personal account of the author's recovery after being injured while reporting in Ukraine."
  }
];*/



const bookList = document.getElementById('book-list');
const searchInput = document.getElementById('search');

async function fetchBooks (query = 'bestseller') {
  // const url = `https://openLibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`;
  const url = 'books.json';

  try{
    const response = await fetch(url);
    const data = await response.json();
  
    displayBooks(data)
    // displayBooks(data.docs);
  } catch (error) {
    console.error('Error fetching books:', error);
    bookList.innerHTML = '<p>Failed to load books. Please try again later.</p>';
  }
}

// function displayBooks(books) {
//   bookList.innerHTML = books.map(book => {
//     const title = book.title || 'No Title';
//     const author = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
//     const coverId = book.cover_id;
//     const coverUrl = coverId
//     ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
//     : 'https://via.placeholder.com/128x193?text=No+Cover';

//     return `
//     <div class="book">
//       <img src="${coverUrl}" alt="${title}">
//       <h3>${title}</h3>
//       <p>by ${author}</p>
//     </div>`;
//   }).join('');
// }

searchInput.addEventListener('input', () =>{
  const query = searchInput.value.trim();
  fetchBooks(query || 'bestseller');
});

fetchBooks();

let cart = [];

function displayBooks(data) {
  const list = document.getElementById("book-list");
  list.innerHTML = "";
  data.forEach(book => {
    const card = document.createElement("div");
    card.classList.add("book-card")

    card.innerHTML = `
      <img src="${book.image}" class="book-cover" alt="${book.title}">
      <div class="book-info">
      <h2>${book.title}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong> Genre:</strong> ${book.genre}</p>
      <p>${book.description}</p>
      <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
      <button onclick="addToCart(${book.id})">Add to Cart</button>
      </div>
    `;

    list.appendChild(card);
  });
}

function addToCart(id) {
  const book = books.find(b => b.id === id);
  cart.push(book);
  alert(`"${book.title}" added to cart!`);
  console.log("Cart:", cart);
}

function filterBooks(keyword) {
  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(keyword.toLowerCase()) ||
    b.author.toLowerCase().includes(keyword.toLowerCase())
  );
  displayBooks(filtered);
}

function sortBooks(order) {
  const sorted = [...books].sort((a, b) =>
    order === "low" ? a.price - b.price : b.price - a.price
  );
  displayBooks(sorted);
}

document.addEventListener("DOMContentLoaded", () => {
  // displayBooks(books);

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

  document.getElementById("sort-low").addEventListener("click", () => sortBooks("low"));
  document.getElementById("sort-high").addEventListener("click", () => sortBooks("high"));
});