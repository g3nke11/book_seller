const books = [
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
];

let cart = [];

function displayBooks(data) {
  const list = document.getElementById("book-list");
  list.innerHTML = "";
  data.forEach(book => {
    const div = document.createElement("div");

    div.innerHTML = `
      <img src="${book.image}" alt="${book.title}">
      <h2>${book.title}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong> Genre:</strong> ${book.genre}</p>
      <p>${book.description}</p>
      <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
      <button onclick="addToCart(${book.id})">Add to Cart</button>
      <hr>
    `;

    list.appendChild(div);
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
  displayBooks(books);

  document.getElementById("search").addEventListener("input", e => {
    filterBooks(e.target.value);
  });

  document.getElementById("sort-low").addEventListener("click", () => sortBooks("low"));
  document.getElementById("sort-high").addEventListener("click", () => sortBooks("high"));
});