// get genre id from url
const urlParams = new URLSearchParams(window.location.search);
const urlGenreId = urlParams.get("genre_id");
const urlGenreName = urlParams.get("genre_name");

// Global variables
let currentGenreId = urlGenreId;
let currentGenreName = urlGenreName;

// DOM Elements
const genreTitle = document.getElementById("genreTitle");
const moviesCount = document.getElementById("moviesCount");
const moviesContainer = document.getElementById("moviesContainer");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.getElementById("sidebar");
const genreLinks = document.querySelectorAll(".genre-link");

// Initialize the page
document.addEventListener("DOMContentLoaded", function() {
    // Load movies for the default genre and active related genre in sidebar
    genreLinks.forEach((l) => l.classList.remove("active"));
    genreLinks.forEach((link) => {
        if (link.getAttribute("data-genre-id") == currentGenreId) {
            link.classList.add("active");
        }
    });
    fetchMoviesByGenre(currentGenreId, currentGenreName);

    // Add event listeners to genre links
    genreLinks.forEach((link) => {
        link.addEventListener("click", function(e) {
            e.preventDefault();

            // Remove active class from all links
            genreLinks.forEach((l) => l.classList.remove("active"));

            // Add active class to clicked link
            this.classList.add("active");

            // Get genre ID and name from data attributes & Update current genre
            currentGenreId = parseInt(this.getAttribute("data-genre-id"));
            currentGenreName = this.getAttribute("data-genre-name");

            // Fetch movies for the selected genre
            fetchMoviesByGenre(currentGenreId, currentGenreName);

            // Close sidebar on mobile after selection
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove("active");
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Mobile menu management
    mobileMenuBtn.addEventListener("click", function() {
        sidebar.classList.toggle("active");

        if (sidebar.classList.contains("active")) {
            this.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            this.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Fetch movies by genre from TMDB API
async function fetchMoviesByGenre(genreId, genreName) {
    try {
        // Show loading state
        moviesContainer.innerHTML = `
            <div class="loader">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading ${genreName} movies...</p>
            </div>
        `;

        // Update page title
        genreTitle.textContent = `${genreName} Movies`;
        moviesCount.textContent = "Total: Loading...";

        // Fetch movies from API
        const response = await fetch(
            `https://moviesapi.ir/api/v1/genres/${genreId}/movies?page=1`
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const datas = await response.json();

        // Update movie count
        moviesCount.textContent = `Total: ${datas.metadata.total_count} movies`;

        displayMovies(datas.data, genreName);
    } catch (error) {
        showError("Failed to load movies. Please try again later.", moviesContainer);
        console.error("Error fetching movies:", error);
    }
}

// Display movies in the UI
function displayMovies(movies, genreName) {
    if (movies.length === 0) {
        showError(`No ${genreName} movies found.`, moviesContainer);
        return;
    }

    let moviesHTML = "";

    movies.forEach((movie) => {
        const movieGenres = movie.genres
                ? movie.genres
                      .map((genre) => {
                          return `<span class="genre-tag">${genre || "undefined"}</span>`;
                      })
                      .join("")
                : "";
        const posterUrl = movie.poster
            ? movie.poster
            : "https://via.placeholder.com/140x200/2c3e50/ecf0f1?text=No+Image";

        moviesHTML += `
            <div class="movie-card">
                <img src="${posterUrl}" alt="${movie.title}" class="movie-poster">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-genres">${movieGenres}</div>
                    
                    <div class="movie-rating">
                            <i class="fas fa-star"></i>
                            <span>${movie.imdb_rating}</span>
                    </div>
                    
                </div>
            </div>
        `;
    });

    moviesContainer.innerHTML = moviesHTML;
}

// Initialize the page with common functionality
document.addEventListener("DOMContentLoaded", async function() {
    const genresLoaded = await fetchGenres();
    if (genresLoaded) {
        initializeGenreDropdown();
    }
});