// API URLs
const GENRE_API_URL = `https://moviesapi.ir/api/v1/genres`;

// Global variables
let selectedGenreId = null;
let genres = {};

// Common function to handle search
function handleSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        localStorage.setItem('searchQuery', query);
        window.location.href = 'search-results.html';
    }
}

// Common function to initialize genre dropdown
function initializeGenreDropdown() {
    const genreDropdown = document.getElementById('genre-dropdown');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Event listener for genre dropdown
    if (genreDropdown) {
        genreDropdown.addEventListener('change', function() {
            if (this.value) {
                selectedGenreId = this.value;
                window.location.href = `genre.html?genre_id=${selectedGenreId}&genre_name=${genres[selectedGenreId]}`;
            }
        });
    }

    // Event listener for search
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
}

// Common function to fetch genres
async function fetchGenres() {
    try {
        const response = await fetch(GENRE_API_URL);
        const data = await response.json();

        if (data && data.length > 0) {
            data.forEach((genre) => {
                genres[genre.id] = genre.name;
            });
            return true;
        } else {
            console.error('No genres found');
            return false;
        }
    } catch (error) {
        console.error('Error fetching genres:', error);
        return false;
    }
}

// Common function to show error
function showError(message, container) {
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    }
}