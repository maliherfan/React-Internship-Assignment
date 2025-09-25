// API URLs
const MOVIE_LIST_API_URL = `https://moviesapi.ir/api/v1/movies?page=`;

// Global variables
let currentSlide = 0;
let slideInterval;
let currentPage = 1;
let totalPages = 1;
let slideMovies = [];

//DOM Elements Selector
const slidesContainer = document.getElementById("slides-container");
const sliderNav = document.getElementById("slider-nav");
const moviesContainer = document.getElementById("movies-container");
const paginationContainer = document.getElementById("pagination");
const loader = document.getElementById("loader");

//update page
function changePage(page) {
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    fetchMovies(currentPage);
}

//create pagination buttons
function createPaginationButtons() {
    paginationContainer.innerHTML = "";

    //prev button
    const prevButton = document.createElement("button");
    prevButton.innerHTML = "&lt;";
    prevButton.addEventListener("click", () => changePage(currentPage - 1));
    prevButton.disabled = currentPage === 1;
    paginationContainer.appendChild(prevButton);

    //page buttons
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.toggle("active", i === currentPage);
        pageButton.addEventListener("click", () => changePage(i));
        paginationContainer.appendChild(pageButton);
    }

    // next button
    const nextButton = document.createElement("button");
    nextButton.innerHTML = "&gt;";
    nextButton.addEventListener("click", () => changePage(currentPage + 1));
    nextButton.disabled = currentPage === totalPages;
    paginationContainer.appendChild(nextButton);
}

//fetch movie info from API
async function fetchMovies(page = 1) {
    try {
        moviesContainer.innerHTML = `
            <div class="loader">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Fetching Movies from API ...</p>
            </div>
        `;

        const response = await fetch(`${MOVIE_LIST_API_URL}${page}`);
        const datas = await response.json();

        //limit totall page to 25 based on sample
        totalPages = datas.metadata.page_count > 25 ? 25 : datas.metadata.page_count;
        currentPage = parseInt(datas.metadata.current_page);

        slideMovies = datas.data.slice(0, 5);
        createSlideshow();
        displayMovies(datas.data);
        createPaginationButtons();
    } catch (error) {
        showError("Error in Fetching. Plz Try Again Later ...", moviesContainer);
        console.error("Error fetching movies:", error);
    }
}

// Cresting slideshow
function createSlideshow() {
    // hiding loader
    if (loader) loader.style.display = "none";

    slidesContainer.innerHTML = "";
    sliderNav.innerHTML = "";

    slideMovies.forEach((movie, index) => {
        // create slide
        const slide = document.createElement("div");
        slide.className = "slide";
        if (index === 0) slide.classList.add("active");

        // movie poster url
        const backdropUrl = movie.poster
            ? movie.poster
            : "https://via.placeholder.com/1280x720/2c3e50/ecf0f1?text=No+Image";

        const genreTags = movie.genres
            ? movie.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')
            : '<span class="genre-tag">No genres</span>';

        const slideContent = `
            <img src="${backdropUrl}" alt="${movie.title}" class="slide-image">
            <div class="slide-overlay">
                <div class="slide-content">
                    <h2 class="slide-title">${movie.title}</h2>
                    <div class="slide-genres">
                        ${genreTags}
                    </div>
                    <div class="slide-date">year: ${movie.year}</div>
                </div>
            </div>
        `;

        slide.innerHTML = slideContent;
        slidesContainer.appendChild(slide);

        // create nav button
        const dot = document.createElement("div");
        dot.className = "slider-dot";
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(index));
        sliderNav.appendChild(dot);
    });

    // automatic start slideshow
    startSlideInterval();
}

// change slide
function goToSlide(index) {
    // disable current slide
    document.querySelectorAll(".slide").forEach((slide) => {
        slide.classList.remove("active");
    });

    document.querySelectorAll(".slider-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });

    // move to new slide
    currentSlide = index;

    // active new slide
    setTimeout(() => {
        document.querySelectorAll(".slide")[currentSlide].classList.add("active");
    }, 50);

    // reset interval
    clearInterval(slideInterval);
    startSlideInterval();
}

// next slide
function nextSlide() {
    const next = (currentSlide + 1) % slideMovies.length;
    goToSlide(next);
}

// set interval for slideshow
function startSlideInterval() {        
    slideInterval = setInterval(nextSlide, 3000);
}

//show movies list
function displayMovies(movies) {
    moviesContainer.innerHTML = "";

    if (movies.length === 0) {
        moviesContainer.innerHTML = '<p class="loader">no movies found</p>';
        return;
    }

    movies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.className = "movie-card";

        const posterPath = movie.poster
            ? `${movie.poster}`
            : "https://via.placeholder.com/500x750/2c3e50/ecf0f1?text=بدون+تصویر";

        const movieGenres = movie.genres
            .slice(0, 2)
            .map((genre) => {
                return `<span class="genre-tag">${genre || "نامشخص"}</span>`;
            })
            .join("");

        movieCard.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-genres">
                    ${movieGenres}
                </div>
                <div class="movie-rating-details">
                    <div class="movie-rating">
                        <span>${parseFloat(movie.imdb_rating).toFixed(1)}</span>
                        <i class="fas fa-star"></i>
                    </div>
                    <a href="movie-details.html?id=${movie.id}" class="view-info-link">View Info</a>
                </div>
            </div>
        `;

        moviesContainer.appendChild(movieCard);
    });
}

// Initialize the page
document.addEventListener("DOMContentLoaded", async function() {
    const genresLoaded = await fetchGenres();
    if (genresLoaded) {
        initializeGenreDropdown();
        fetchMovies();
    }
});