// API URLs
const SEARCH_API_URL = `https://moviesapi.ir/api/v1/movies?q=`;

// DOM Elements Selector
const searchInfo = document.getElementById("search-info");
const moviesContainer = document.getElementById("movies-container");

// Get query from localStorage
const searchQuery = localStorage.getItem("searchQuery");

// If no query exists, redirect to homepage
if (!searchQuery) {
    window.location.href = "index.html";
}

// Display search results
searchInfo.innerHTML = `<h2>Search Results For : "${searchQuery}"</h2>`;

// Fetching search results
async function fetchSearchResults() {
    try {
        const response = await fetch(
            `${SEARCH_API_URL}${encodeURIComponent(searchQuery)}`
        );
        const datas = await response.json();

        displayMovies(datas.data);
    } catch (error) {
        showError("Error fetching results. Please try again.", moviesContainer);
        console.error("Error fetching search results:", error);
    }
}

// Display movies as a list
function displayMovies(movies) {
    if (!movies || movies.length === 0) {
        showError("No results found for your search.", moviesContainer);
        return;
    }

    moviesContainer.innerHTML = "";
    let uniqueMovieTitle = [];
    
    movies.forEach((movie) => {
        // There are some duplicate movies with imdb_rating 0 that I don't want to be displayed on the page.
        if (!uniqueMovieTitle.includes(movie.title) && movie.imdb_rating !== "0") {
            uniqueMovieTitle.push(movie.title);
            const movieCard = document.createElement("div");
            movieCard.className = "movie-card-list";

            const posterPath = movie.poster
                ? `${movie.poster}`
                : "https://via.placeholder.com/500x750/2c3e50/ecf0f1?text=بدون+تصویر";

            const movieGenres = movie.genres
                ? movie.genres
                      .map((genre) => {
                          return `<span class="genre-tag">${genre || "undefined"}</span>`;
                      })
                      .join("")
                : "";

            movieCard.innerHTML = `
                <img src="${posterPath}" alt="${movie.title}" class="movie-poster-list">
                <div class="movie-info-list">
                    <h3 class="movie-title-list">${movie.title}</h3>
                    <div class="movie-genres">
                        ${movieGenres}
                    </div>
                    <div class="movie-details-list">
                        <div class="movie-rating">
                            <span>${movie.imdb_rating}</span>
                            <i class="fas fa-star"></i>
                        </div>
                        <a href="movie-details.html?id=${movie.id}" class="view-info-link">View Info</a>
                    </div>
                </div>
            `;

            moviesContainer.appendChild(movieCard);
        }
    });
}

// Initialize the page
document.addEventListener("DOMContentLoaded", async function() {
    const genresLoaded = await fetchGenres();
    if (genresLoaded) {
        initializeGenreDropdown();
        fetchSearchResults();
    }
});