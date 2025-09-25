// get movie id from url
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

// If no movie ID is found, redirect to the homepage.
if (!movieId) {
    window.location.href = "index.html";
}

const BASE_URL = `https://moviesapi.ir/api/v1/movies/${movieId}`;

// DOM selector elements
const movieDetails = document.getElementById("movie-details");
const movieTitle = document.getElementById("movie-title");
const moviePoster = document.getElementById("movie-poster");
const releaseDate = document.getElementById("release-date");
const runtime = document.getElementById("runtime");
const country = document.getElementById("country");
const voteAverage = document.getElementById("vote-average");
const voteCount = document.getElementById("vote-count");
const overview = document.getElementById("overview");
const genresContainer = document.getElementById("movie-genres");
const director = document.getElementById("director");
const writer = document.getElementById("writer");
const actors = document.getElementById("actor");
const imagesContainer = document.getElementById("images");

// get movie info from API
async function fetchMovieDetails() {
    try {
        // fetch movie info
        const response = await fetch(`${BASE_URL}`);
        const movie = await response.json();

        // show movie info
        movieTitle.textContent = movie.title || movie.original_title;
        moviePoster.src = movie.poster;
        moviePoster.alt = movie.title || movie.original_title;
        releaseDate.textContent = movie.released;
        runtime.textContent = movie.runtime;
        country.textContent = movie.country;
        voteAverage.textContent = movie.imdb_rating;
        voteCount.textContent = movie.imdb_votes;
        overview.textContent = movie.plot || "No summary is available for this movie.";

        // show genres
        genresContainer.innerHTML = "";
        movie.genres.forEach((genre) => {
            const genreElement = document.createElement("span");
            genreElement.className = "genre-tag";
            genreElement.textContent = genre;
            genresContainer.appendChild(genreElement);
        });

        director.textContent = movie.director ? movie.director : "undefined";
        writer.textContent = movie.writer ? movie.writer : "undefined";
        actors.textContent = movie.actors ? movie.actors : "undefined";

        // movie images
        imagesContainer.innerHTML = "";

        if (movie.images) {
            const backdrops = movie.images;
            backdrops.forEach((image) => {
                const imageItem = document.createElement("div");
                imageItem.className = "image-item";

                imageItem.innerHTML = `<img src="${image}" alt="movie scene">`;
                imagesContainer.appendChild(imageItem);
            });
        }
    } catch (error) {
        showError("Error fetching movie details.", movieDetails);
        console.error("Error fetching movie details:", error);
    }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", async function() {
    const genresLoaded = await fetchGenres();
    if (genresLoaded) {
        initializeGenreDropdown();
        fetchMovieDetails();
    }
});