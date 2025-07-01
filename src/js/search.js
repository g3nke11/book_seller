export function handleSearch() {
    // Get a reference to the search input element.
    // Assuming your search input has the class 'search-bar' and is an <input> tag.
    const searchInput = document.querySelector('.search-bar input[type="text"]');

    // If the search input element is not found, log an error and exit.
    if (!searchInput) {
        console.error("Search input element not found.");
        return;
    }

    // Get the trimmed value from the search input.
    const query = searchInput.value.trim();

    // If the query is not empty, construct the URL and navigate.
    if (query) {
        // Encode the query to handle special characters in the URL.
        const encodedQuery = encodeURIComponent(query);
        // Redirect to 'base.html' (or your dedicated search results page)
        // with the search query as a parameter.
        window.location.href = `base.html?query=${encodedQuery}`;
    } else {
        // Optionally, provide feedback to the user if the search bar is empty.
        console.log("Search bar is empty. Please enter a query.");
        // You could also display a temporary message on the UI.
    }
}