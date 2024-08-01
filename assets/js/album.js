// Funzione per eseguire la ricerca
function performSearch() {
    const albumName = document.getElementById('album-search').value.trim();
    if (albumName) {
        searchAlbum(albumName); // Effettua la ricerca
        document.getElementById('album-search').value = ''; // Pulisce il campo di ricerca
    }
}

// Funzione per cercare l'album usando l'API
function searchAlbum(name) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${name}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.data && data.data.length > 0) {
                const albumId = data.data[0].album.id;
                fetchAlbumDetails(albumId);
            } else {
                console.log('Album not found');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Funzione per ottenere i dettagli dell'album
function fetchAlbumDetails(albumId) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(album => {
            console.log(album);
            displayAlbumDetails(album);
        })
        .catch(error => console.error('Error:', error));
}

// Funzione per visualizzare i dettagli dell'album
function displayAlbumDetails(album) {
    const centerColumn = document.getElementById('center');
    const albumHtml = `
        <div class="sfondoDinamico">
            <div class="row row-cols-1 p-3">
                <div class="col d-flex justify-content-between mb-3">
                    <div class="d-flex">
                        <div class="square rounded-circle bg-black text-secondary d-flex justify-content-center align-items-center me-4">
                            <i class="fa-solid fa-chevron-left fs-5"></i>
                        </div>
                        <div class="square rounded-circle bg-black text-secondary d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-chevron-right fs-5"></i>
                        </div>
                    </div>
                    <div class="d-flex text-light bg-black rounded-5 justify-content-end align-items-center">
                        <div class="square me-3">
                            <img src="${album.cover_medium}" class="w-100 rounded-circle" alt="">
                        </div>
                        <p class="m-0 me-3">${album.artist.name}</p>
                        <i id="dropdown" class="fa-solid fa-caret-down fs-5 align-self-self pe-3"></i>
                    </div>
                </div>
                <div class="col mb-3">
                    <div class="row justify-content-center text-light rounded-2 m-2">
                        <div class="col-3 p-0">
                            <div class="w-100">
                                <img src="${album.cover_medium}" class="album-cover-album w-100" alt="Album Cover">
                            </div>
                        </div>
                        <div class="col-9 d-flex flex-column justify-content-end">
                            <div>
                                <p class="pt-3 fs-small mb-0">ALBUM</p>
                            </div>
                            <div>
                                <h1 class="fs-10 fw-bold mb-0 display-1">${album.title}</h1>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="w-5">
                                    <img src="${album.cover_small}" class="rounded-circle w-100" alt="Img-artista">
                                </div>
                                <div>
                                    <p class="lead fs-6 mb-0 ms-2">${album.artist.name} -
                                        <span>${album.release_date}</span> - <span>${album.nb_tracks} brani,
                                        </span> <span class="text-white-50">${Math.floor(album.duration / 60)} min ${album.duration % 60} sec.</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-fluid bgCenterAlbum pt-4 px-4 m-0">
                <div class="row">
                    <div class="col d-flex align-items-center">
                        <div class="me-4 btn-round">
                            <button type="button" class="btn bgSpoty w-100 h-100 rounded-circle me-2">
                                <i class="bi bi-play-fill fs-2 text-center mt-1"></i>
                            </button>
                        </div>
                        <div class="me-4">
                            <i class="bi bi-suit-heart icon-spotify-album"></i>
                        </div>
                        <div class="me-4">
            <!-- Album actions -->
                            <i class="bi bi-arrow-down-circle icon-spotify-album"></i>
                        </div>
                        <div>
                            <p class="fs-3">...</p>
                        </div>
                    </div>
                </div>
                <div class="row px-4 pb-2 text-light my-4 fs-6 border-bottom border-light-subtle opacity-50 align-items-center">
                    <div class="col-6 d-flex">
                        <div class="col-1 px-0 me-2 mb-0 align-self-center">#</div>
                        <div class="col px-0 mb-0 align-self-center">TITOLO</div>
                    </div>
                    <div class="col-3 px-0">
                        <p class="text-end mb-0">RIPRODUZIONE</p>
                    </div>
                    <div class="col-3 px-0">
                        <p class="mb-0 text-end"><i class="bi bi-clock"></i></p>
                    </div>
                </div>
                <!-- Track listing -->
                ${album.tracks && album.tracks.data.map((track, index) => {
                    const trackDurationMinutes = Math.floor(track.duration / 60);
                    const trackDurationSeconds = track.duration % 60;
                    return `
                        <div class="row px-4 text-light my-4 fs-6 align-items-center">
                            <div class="col-6 d-flex">
                                <div class="col-1 px-0 me-2 mb-0 align-self-center">${index + 1}</div>
                                <div class="col px-0 mb-0">
                                    <h4 class="mb-1">${track.title}</h4>
                                    <p>${track.artist.name}</p>
                                </div>
                            </div>
                            <div class="col-3 px-0 text-end">${track.rank}</div>
                            <div class="col-3 px-0 text-end">${trackDurationMinutes}:${trackDurationSeconds < 10 ? '0' : ''}${trackDurationSeconds}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    centerColumn.innerHTML = albumHtml;
}

// Funzione per caricare le ricerche salvate da localStorage e aggiornare la lista
function loadSearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchList = document.getElementById('search-history-list');
    searchList.innerHTML = ''; // Pulisce la lista esistente

    searchHistory.forEach(query => {
        const listItem = document.createElement('li');
        listItem.className = 'mb-2';
    // Set the innerHTML of the center column to the album HTML
        listItem.textContent = query;
        searchList.appendChild(listItem);
    });
}

// Funzione per gestire l'invio della ricerca
function handleSearch() {
    const searchInput = document.getElementById('album-search');
    const query = searchInput.value.trim();

    if (query) {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

        // Aggiungi la nuova ricerca e rimuovi i duplicati
        if (!searchHistory.includes(query)) {
            searchHistory.push(query);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            loadSearchHistory(); 
        }

        searchAlbum(query);

        searchInput.value = '';
    }
}

// Aggiungi un gestore di eventi al pulsante di ricerca
document.getElementById('search-button').addEventListener('click', handleSearch);

// Aggiungi un gestore di eventi per la pressione del tasto 'Enter'
document.getElementById('album-search').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// Carica la cronologia delle ricerche all'avvio della pagina
window.onload = loadSearchHistory;

document.addEventListener("DOMContentLoaded", function() {
    const searchContainer = document.getElementById('search-container');
    const albumSearch = document.getElementById('album-search');

    // Funzione per forzare la visibilità dell'input e annullare l'hover
    function forceVisibilityAndDisableHover() {
        albumSearch.style.visibility = 'visible';
        albumSearch.style.opacity = '1';
        albumSearch.style.display = 'block';
        albumSearch.style.pointerEvents = 'auto';

        // Annulla l'effetto hover
        albumSearch.style.backgroundColor = '#242424'; // Mantiene il colore di sfondo fisso
        albumSearch.style.border = '1px solid white'; // Mantiene i bordi bianchi
    }

    // Esegui la funzione all'inizializzazione
    forceVisibilityAndDisableHover();

    // Aggiungi un osservatore di mutazione per rilevare cambiamenti di stile
    const observer = new MutationObserver(forceVisibilityAndDisableHover);
    observer.observe(albumSearch, {
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // Aggiungi un evento per rilevare quando l'input viene nascosto
    searchContainer.addEventListener('mouseleave', forceVisibilityAndDisableHover);
    searchContainer.addEventListener('blur', forceVisibilityAndDisableHover, true);

    // Esegui la funzione periodicamente come fallback
    setInterval(forceVisibilityAndDisableHover, 1000); // Ogni secondo
});