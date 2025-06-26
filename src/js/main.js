async function homebooks() {
    try {
        // Fetch the books.json file.
        // Ensure 'books.json' is located at the root of your deployed site
        // for this path to work correctly.
        const response = await fetch("books.json");

        // Check if the network request was successful (HTTP status 200-299)
        if (!response.ok) {
            // If the response is not OK, throw an error to be caught by the catch block
            throw new Error(`HTTP error! status: ${response.status} from ${response.url}`);
        }

        // Await the JSON parsing to ensure 'allBooks' is the actual array of book objects.
        // This resolves the 'TypeError: t.filter is not a function' error.
        const allBooks = await response.json();

        // Define the genres you want to display on the home page.
        const genres = ["Fiction", "Non-Fiction", "Young Adult"];

        // Iterate over each genre to filter and display books.
        genres.forEach(genre => {
            // Filter books that belong to the current genre.
            const booksInGenre = allBooks.filter(book => book.genre === genre);
            // Get 3 random books from the filtered list for display.
            const randomBooks = getRandomBooks(booksInGenre, 3);
            // Display these random books in the appropriate section.
            displayBooks(randomBooks, genre);
        });
    } catch (error) {
        // Log any errors that occur during fetching or processing of book data.
        console.error("Error fetching or processing books:", error);
        // You might want to add code here to display a user-friendly message
        // on the webpage if books cannot be loaded.
    }
}

/**
 * Returns a specified number of random items from an array.
 * @param {Array} arr - The array to select random items from.
 * @param {number} num - The number of random items to return.
 * @returns {Array} An array containing 'num' random items from 'arr'.
 */
function getRandomBooks(arr, num) {
    // Create a shallow copy of the array to avoid modifying the original.
    // Sort the copied array randomly using Math.random().
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    // Return a slice of the shuffled array containing the desired number of items.
    return shuffled.slice(0, num);
}

/**
 * Displays a list of books within a specific genre container on the webpage.
 * Each book cover and title will be a clickable link to a book details page.
 * @param {Array} books - An array of book objects to display.
 * @param {string} genre - The genre name, used to identify the target container.
 */
function displayBooks(books, genre) {
    // Construct the ID of the container element for the specific genre.
    // E.g., "fiction-books", "non-fiction-books".
    const containerId = `${genre.toLowerCase().replace(/\s/g, '-')}-books`;
    // Select the specific container where book covers will be placed.
    const container = document.querySelector(`#${containerId} .book-covers-container`);

    // If the container element is not found, log an error and exit.
    if (!container) {
        console.error(`Container not found for genre: ${genre}`);
        return;
    }

    // Iterate over each book in the provided 'books' array.
    books.forEach(book => {
        // Create a div element for each book item.
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-cover-item'); // Add a CSS class for styling.

        // Create an anchor tag (<a>) to make the book clickable.
        const bookLink = document.createElement('a');
        // Set the 'href' attribute for the link.
        // It points to 'base.html' (your book details page) and appends
        // the book's 'id' as a query parameter (e.g., base.html?id=123).
        // IMPORTANT: Ensure your 'books.json' has an 'id' property for each book.
        bookLink.href = `base.html?id=${book.id}`;

        // Create an image element for the book cover.
        const bookImage = document.createElement('img');
        bookImage.src = book.cover; // Set the image source from book data.
        bookImage.alt = book.title; // Set the alt text for accessibility.

        // Create a paragraph element for the book title.
        const bookTitle = document.createElement('p');
        bookTitle.textContent = book.title; // Set the text content to the book title.

        // Append the image and title elements to the anchor tag.
        // This makes both the image and title part of the clickable link.
        bookLink.appendChild(bookImage);
        bookLink.appendChild(bookTitle);

        // Append the entire clickable link (containing image and title) to the book item div.
        bookItem.appendChild(bookLink);

        // Append the completed book item (with its link) to the genre's container.
        container.appendChild(bookItem);
    });
}

// Call the homebooks function to start loading and displaying books when the script runs.
homebooks();
