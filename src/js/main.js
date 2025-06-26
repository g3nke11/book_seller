// document.addEventListener('DOMContentLoaded', homebooks)
async function homebooks() {
    // Placeholder for your book data (books.json)
    // In a real scenario, you would fetch this from a JSON file using `fetch('data/books.json')`
    const response = await fetch("books.json");
    const allBooks = await response.json();
    const genres = ["Fiction", "Non-Fiction", "Young Adult"];
    genres.forEach(genre => {
        const booksInGenre = allBooks.filter(book => book.genre === genre);
        const randomBooks = getRandomBooks(booksInGenre, 3);
        displayBooks(randomBooks, genre);
    });
}
function getRandomBooks(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}
function displayBooks(books, genre) {
    const containerId = `${genre.toLowerCase().replace(/\s/g, '-')}-books`;
    const container = document.querySelector(`#${containerId} .book-covers-container`);
    if (!container) {
        console.error(`Container not found for genre: ${genre}`);
        return;
    }
    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-cover-item');
        const bookImage = document.createElement('img');
        bookImage.src = book.cover;
        bookImage.alt = book.title;
        const bookTitle = document.createElement('p');
        bookTitle.textContent = book.title;
        bookItem.appendChild(bookImage);
        bookItem.appendChild(bookTitle);
        container.appendChild(bookItem);
    });
}

homebooks()