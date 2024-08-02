const dropdown = document.getElementById('dropdown');
const destra = document.getElementById('destra');
const center = document.getElementById('center');

const albumSection = document.getElementById('albumSection');
const artistContainer = document.getElementById('artistContainer');

dropdown.addEventListener('click', function () {
    destra.classList.toggle('d-lg-none');
});

function performSearch() {
    const searchName = document.getElementById('album-search').value.trim();
    if (searchName) {
        albumSection.innerHTML = '';
        artistContainer.innerHTML = '';
        search(searchName); // Effettua la ricerca
        document.getElementById('album-search').value = ''; // Pulisce il campo di ricerca
    }
}

function loadSearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchList = document.getElementById('search-history-list');
    searchList.innerHTML = '';

    searchHistory.forEach(query => {
        const listItem = document.createElement('li');
        listItem.className = 'mb-2';

        listItem.textContent = query;
        searchList.appendChild(listItem);
    });
}

function handleSearch() {
    const searchInput = document.getElementById('album-search');
    const query = searchInput.value.trim();

    if (query) {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

        if (!searchHistory.includes(query)) {
            searchHistory.push(query);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            loadSearchHistory();
        }
        performSearch();
        searchInput.value = '';
    }
}

document.getElementById('search-button').addEventListener('click', handleSearch);

document.getElementById('album-search').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

window.onload = function () {
    loadSearchHistory();
    loadSearchResults(); // Carica i risultati salvati, se presenti
};

document.addEventListener("DOMContentLoaded", function () {
    const searchContainer = document.getElementById('search-container');
    const albumSearch = document.getElementById('album-search');

    function forceVisibilityAndDisableHover() {
        albumSearch.style.visibility = 'visible';
        albumSearch.style.opacity = '1';
        albumSearch.style.display = 'block';
        albumSearch.style.pointerEvents = 'auto';

        albumSearch.style.backgroundColor = '#242424';
        albumSearch.style.border = '1px solid white';
    }

    forceVisibilityAndDisableHover();

    const observer = new MutationObserver(forceVisibilityAndDisableHover);
    observer.observe(albumSearch, {
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    searchContainer.addEventListener('mouseleave', forceVisibilityAndDisableHover);
    searchContainer.addEventListener('blur', forceVisibilityAndDisableHover, true);

    setInterval(forceVisibilityAndDisableHover, 1000);
});

function search(name) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${name}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Salva i risultati in session storage
            sessionStorage.setItem('searchResults', JSON.stringify(data));

            displayResults(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayResults(data) {
    const artist1 = data.data;
    const addedArtists = new Set();

    artist1.forEach(element => {
        if (!addedArtists.has(element.artist.name)) {
            addedArtists.add(element.artist.name);
            artistContainer.innerHTML += `<div class="col p-0 mb-4">
                <div class="card p-3 bg-dark border-0 text-secondary hover2">
                    <div class="position-relative">
                        <img id="${element.artist.id}" src="${element.artist.picture_big}" class="card-img-top rounded-circle click"
                             alt="${element.artist.name}">
                    </div>
                    <div class="card-body p-0 py-2">
                        <p class="card-title text-light fs-small fw-bold mb-1 text-uppercase text-truncate">${element.artist.name}</p>
                        <p class="card-text fs-small">Artista</p>
                    </div>
                </div>
            </div>`;

            const click = document.querySelectorAll('.click');
            click.forEach(element => {
                element.addEventListener('click', function () {
                    const artistId = element.id;
                    location.assign(`./artist.html?artistId=${artistId}`);
                });
            });
        }
    });

    const addedAlbum = new Set();

    artist1.forEach(element => {
        if (!addedAlbum.has(element.album.title)) {
            addedAlbum.add(element.album.title);
            albumSection.innerHTML += `<div class="col p-0">
                <div id=${element.album.id} class="card p-3 bg-dark border-0 text-secondary hover2 clickAlbum">
                    <div class="w-100 position-relative">
                        <img src="${element.album.cover_big}" class="card-img-top w-100"
                             alt="${element.album.title}">
                    </div>
                    <div class="card-body p-0 py-2">
                        <p class="card-title text-light fs-small fw-bold mb-1 text-uppercase text-truncate">${element.album.title}</p>
                        <p class="card-text fs-small">${element.album.release_date}</p>
                    </div>
                </div>`;

            const clickAlbum = document.querySelectorAll('.clickAlbum');
            clickAlbum.forEach(element => {
                element.addEventListener('click', function () {
                    const albumId = element.id;
                    location.assign(`./album.html?albumId=${albumId}`);
                });
            });
        }
    });
}

function loadSearchResults() {
    const searchResults = JSON.parse(sessionStorage.getItem('searchResults'));
    if (searchResults) {
        displayResults(searchResults);
    }
}