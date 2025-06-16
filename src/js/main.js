document.addEventListener('DOMContentLoaded', () => {
    // Placeholder for your book data (books.json)
    // In a real scenario, you would fetch this from a JSON file using `fetch('data/books.json')`
    const allBooks = [
        {
            "id": "1",
            "title": "The Midnight Library",
            "author": "Matt Haig",
            "genre": "Fiction",
            "cover": "images/book covers/midnight-library.jpg",
            "tags": ["contemporary", "fantasy", "life", "philosophical"]
        },
        {
            "id": "2",
            "title": "Educated",
            "author": "Tara Westover",
            "genre": "Non-Fiction",
            "cover": "images/book covers/educated.jpg",
            "tags": ["memoir", "biography", "education", "inspirational"]
        },
        {
            "id": "3",
            "title": "The Hate U Give",
            "author": "Angie Thomas",
            "genre": "Young Adult",
            "cover": "images/book covers/the-hate-u-give.jpg",
            "tags": ["social issues", "contemporary", "racism", "young adult"]
        },
        {
            "id": "4",
            "title": "Project Hail Mary",
            "author": "Andy Weir",
            "genre": "Fiction",
            "cover": "images/book covers/project-hail-mary.jpg",
            "tags": ["sci-fi", "space", "adventure", "humor"]
        },
        {
            "id": "5",
            "title": "Sapiens: A Brief History of Humankind",
            "author": "Yuval Noah Harari",
            "genre": "Non-Fiction",
            "cover": "images/book covers/sapiens.jpg",
            "tags": ["history", "science", "philosophy", "evolution"]
        },
        {
            "id": "6",
            "title": "One of Us Is Lying",
            "author": "Karen M. McManus",
            "genre": "Young Adult",
            "cover": "images/book covers/one-of-us-is-lying.jpg",
            "tags": ["mystery", "thriller", "high school"]
        },
        {
            "id": "7",
            "title": "Where the Crawdads Sing",
            "author": "Delia Owens",
            "genre": "Fiction",
            "cover": "images/book covers/where-the-crawdads-sing.jpg",
            "tags": ["mystery", "nature", "southern fiction"]
        },
        {
            "id": "8",
            "title": "Atomic Habits",
            "author": "James Clear",
            "genre": "Non-Fiction",
            "cover": "images/book covers/atomic-habits.jpg",
            "tags": ["self-help", "productivity", "habits"]
        },
        {
            "id": "9",
            "title": "Crescent City: House of Earth and Blood",
            "author": "Sarah J. Maas",
            "genre": "Fiction",
            "cover": "images/book covers/crescent-city.jpg",
            "tags": ["fantasy", "romance", "urban fantasy"]
        },
        {
            "id": "10",
            "title": "Becoming",
            "author": "Michelle Obama",
            "genre": "Non-Fiction",
            "cover": "images/book covers/becoming.jpg",
            "tags": ["memoir", "politics", "biography"]
        },
        {
            "id": "11",
            "title": "The Hunger Games",
            "author": "Suzanne Collins",
            "genre": "Young Adult",
            "cover": "images/book covers/hunger-games.jpg",
            "tags": ["dystopian", "adventure", "sci-fi"]
        },
        {
            "id": "12",
            "title": "Circe",
            "author": "Madeline Miller",
            "genre": "Fiction",
            "cover": "images/book covers/circe.jpg",
            "tags": ["mythology", "historical fiction", "fantasy"]
        },
        {
            "id": "13",
            "title": "Factfulness",
            "author": "Hans Rosling",
            "genre": "Non-Fiction",
            "cover": "images/book covers/factfulness.jpg",
            "tags": ["data", "global issues", "statistics"]
        },
        {
            "id": "14",
            "title": "A Good Girl's Guide to Murder",
            "author": "Holly Jackson",
            "genre": "Young Adult",
            "cover": "images/book covers/a-good-girls-guide-to-murder.jpg",
            "tags": ["mystery", "thriller", "detective"]
        },
        {
            "id": "15",
            "title": "The Vanishing Half",
            "author": "Brit Bennett",
            "genre": "Fiction",
            "cover": "images/book covers/the-vanishing-half.jpg",
            "tags": ["historical fiction", "contemporary", "family saga"]
        },
        {
            "id": "16",
            "title": "The Body Keeps the Score",
            "author": "Bessel van der Kolk",
            "genre": "Non-Fiction",
            "cover": "images/book covers/the-body-keeps-the-score.jpg",
            "tags": ["psychology", "trauma", "self-help"]
        },
        {
            "id": "17",
            "title": "To Kill a Mockingbird",
            "author": "Harper Lee",
            "genre": "Fiction",
            "cover": "images/book covers/to-kill-a-mockingbird.jpg",
            "tags": ["classic", "southern gothic", "social commentary"]
        },
        {
            "id": "18",
            "title": "The Diary of a Young Girl",
            "author": "Anne Frank",
            "genre": "Non-Fiction",
            "cover": "images/book covers/the-diary-of-a-young-girl.jpg",
            "tags": ["memoir", "history", "biography"]
        },
        {
            "id": "19",
            "title": "Divergent",
            "author": "Veronica Roth",
            "genre": "Young Adult",
            "cover": "images/book covers/divergent.jpg",
            "tags": ["dystopian", "sci-fi", "adventure"]
        },
        {
            "id": "20",
            "title": "The Martian",
            "author": "Andy Weir",
            "genre": "Fiction",
            "cover": "images/book covers/the-martian.jpg",
            "tags": ["sci-fi", "adventure", "survival"]
        },
        {
            "id": "21",
            "title": "Thinking, Fast and Slow",
            "author": "Daniel Kahneman",
            "genre": "Non-Fiction",
            "cover": "images/book covers/thinking-fast-and-slow.jpg",
            "tags": ["psychology", "economics", "decision-making"]
        },
        {
            "id": "22",
            "title": "The Fault in Our Stars",
            "author": "John Green",
            "genre": "Young Adult",
            "cover": "images/book covers/the-fault-in-our-stars.jpg",
            "tags": ["romance", "contemporary", "illness"]
        }
    ];

    const genres = ["Fiction", "Non-Fiction", "Young Adult"];

    genres.forEach(genre => {
        const booksInGenre = allBooks.filter(book => book.genre === genre);
        const randomBooks = getRandomBooks(booksInGenre, 3);
        displayBooks(randomBooks, genre);
    });

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
});