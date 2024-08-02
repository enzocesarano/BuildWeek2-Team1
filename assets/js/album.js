// Funzione per eseguire la ricerca
const containerArtist = document.getElementById('containerArtist');



let albumDataArray = []
const audio = document.createElement('audio');

let currentIndex;
const sectionControl = document.getElementById('sectionControl')
const sectionPlayer = document.getElementById('sectionPlayer');
const sectionAlbum = document.getElementById('sectionAlbum');
const sectionVolume = document.getElementById('sectionVolume');

let currentSongIndex = 0;

const addressSearchParameters = new URLSearchParams(location.search).get('search');
const addressBarParameters = new URLSearchParams(location.search).get('albumId')


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

if (addressSearchParameters) {
    searchAlbum(addressSearchParameters);
} else {
    fetchAlbumDetails(addressBarParameters)
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
            const centerColumn = document.getElementById('center');
            albumDataArray = []
            const albumHtml = `
        <div class="sfondoDinamico">
            <div class="row row-cols-1 p-3">
                <div class="col d-flex justify-content-between mb-3">
                    <div class="d-flex">
                        <div class="square rounded-circle bg-black text-secondary d-flex justify-content-center align-items-center me-4">
                             <a href="./index.html"> <i class="fa-solid fa-chevron-left text-light align-items-center fs-5"></i></a>
                        </div>
                        <div class="square rounded-circle bg-black text-secondary d-flex justify-content-center align-items-center d-none">
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
            <div class="container-fluid bgCenterAlbum pt-4 px-4 m-0 py-10">
                <div class="row">
                    <div class="col d-flex align-items-center">
                        <div class="me-4 btn-round">
                            <button type="button" id="playAll" class="btn bgSpoty w-100 h-100 rounded-circle me-2">
                                <i class="bi bi-play-fill fs-2 text-center mt-1"></i>
                            </button>
                        </div>
                        <div class="me-4">
                            <i class="bi bi-suit-heart icon-spotify-album"></i>
                        </div>
                        <div class="me-4">
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

                ${album.tracks && album.tracks.data.map((element, index) => {
                const albumData = JSON.stringify(album.tracks.data[index]).replace(/'/g, "&apos;");
                albumDataArray.push(JSON.parse(albumData.replace(/&apos;/g, "'")));
                const trackDurationMinutes = Math.floor(element.duration / 60);
                const trackDurationSeconds = element.duration % 60;
                return ` <div class="row px-4 text-light my-4 fs-6 align-items-center">
                <div class="col-6 d-flex">
                    <div class="col-1 px-0 me-2 mb-0 align-self-center">${index + 1}</div>
                    <div class="col px-0 mb-0 cursorPointer btnPlay" data-preview="${element.preview}" data-artist='${albumData}'>
                        <h4 class="mb-1">${element.title}</h4>
                        <p>${element.artist.name}</p>
                    </div>
                </div>
                <div class="col-3 px-0 text-end">${element.rank}</div>
                <div class="col-3 px-0 text-end">${trackDurationMinutes}:${trackDurationSeconds < 10 ? '0' : ''}${trackDurationSeconds}</div>
            </div>
        `;
            }).join('')}
</div>
</div>
`;

            centerColumn.innerHTML = albumHtml;

            function playAllSongs() {
                if (albumDataArray.length === 0) return;

                currentSongIndex = 0;
                playSong(albumDataArray[currentSongIndex]);
            }


            function playSong(song) {
                sectionControl.classList.remove('d-none');
                audio.src = song.preview;
                audio.play();
                barControlAlbum(song);
                barControl(song)
            }


            const playAllButton = document.getElementById('playAll');
            playAllButton.addEventListener('click', playAllSongs);

            const destra = document.getElementById('destra')
            dropdown.addEventListener('click', function () {
                destra.classList.toggle('display')
            })

            const newPlayAlbum = document.querySelectorAll(`.btnPlay`);

            newPlayAlbum.forEach((element) => {
                const artistData1 = JSON.parse(element.getAttribute('data-artist').replace(/&apos;/g, "'"));
                element.addEventListener('click', function () {
                    audio.src = element.getAttribute('data-preview');
                    audio.play();
                    sectionControl.classList.remove('d-none');
                    barControl(artistData1);
                    barControlAlbum1(artistData1);
                });
            });

            function barControlAlbum1(data) {
                sectionAlbum.innerHTML = `
                                <div class="col d-flex text-secondary align-items-center">
                    <div class="row align-items-center">
                        <div class="col w-25 d-none d-md-flex align-items-center">
                            <img src="${data.album.cover_big}" class="w-100" alt="icona">
                        </div>
                        <div class="col text-start d-flex flex-column nowrap">
                            <p class="text-light fs-small m-0 text-truncate">${data.title_short}</p>
                            <p class="fs-supersmall m-0 text-truncate">${data.artist.name}</p>
                        </div>
                        <div class="col d-none d-md-block">
                            <i id="clickHeart" class="bi bi-suit-heart fs-small fs-5 cursorPointer"></i>
                        </div>
                    </div> 
                </div>`;

                function clickHeart() {
                    const clickHeart = document.getElementById('clickHeart')
                    clickHeart.addEventListener('click', function () {
                        if (clickHeart.classList.contains('bi-suit-heart')) {
                            clickHeart.classList.remove('bi-suit-heart')
                            clickHeart.classList.add('bi-suit-heart-fill')
                            clickHeart.classList.add('textGreen')
                        } else {
                            clickHeart.classList.remove('bi-suit-heart-fill')
                            clickHeart.classList.add('bi-suit-heart')
                            clickHeart.classList.remove('textGreen')
                        }
                    })
                }

                clickHeart()

            }

        })
        .catch(error => console.error('Error:', error));
}







function barControlAlbum(song) {
    sectionAlbum.innerHTML = `
                <div class="col d-flex text-secondary align-items-center">
                    <div class="row align-items-center">
                        <div class="col w-25 d-none d-md-flex align-items-center">
                            <img src="${song.album.cover}" class="w-100" alt="icona">
                        </div>
                        <div class="col text-start d-flex flex-column nowrap">
                            <p class="text-light fs-small m-0 text-truncate">${song.title_short}</p>
                            <p class="fs-supersmall m-0 text-truncate">${song.artist.name}</p>
                        </div>
                        <div class="col d-none d-md-block">
                            <i id="clickHeart" class="bi bi-suit-heart fs-small fs-5 cursorPointer"></i>
                        </div>
                    </div> 
                </div>`;


    function clickHeart() {
        const clickHeart = document.getElementById('clickHeart')
        clickHeart.addEventListener('click', function () {
            if (clickHeart.classList.contains('bi-suit-heart')) {
                clickHeart.classList.remove('bi-suit-heart')
                clickHeart.classList.add('bi-suit-heart-fill')
                clickHeart.classList.add('textGreen')
            } else {
                clickHeart.classList.remove('bi-suit-heart-fill')
                clickHeart.classList.add('bi-suit-heart')
                clickHeart.classList.remove('textGreen')
            }
        })
    }

    clickHeart()
}

function barControl(song) {
    sectionPlayer.innerHTML = `
                        <div class="col-12 d-flex justify-content-center align-items-center hover">
                            <div class="m-2 mx-3">
                                <i id="shuffle-icon" class="bi bi-shuffle text-secondary fs-5 d-none d-md-inline"></i>
                            </div>
                            <div class="m-2">
                                <i id="backward-icon" class="bi bi-skip-backward-fill text-secondary fs-5"></i>
                            </div>
                            <div class="m-2 mx-4">
                                <i id="play1" class="bi bi-pause-circle-fill text-secondary fs-2"></i>
                            </div>
                            <div class="m-2">
                                <i id="next-icon" class="bi bi-skip-forward-fill text-secondary fs-5"></i>
                            </div>
                            <div class="m-2 mx-3">
                                <i id="repeat-icon" class="bi bi-repeat text-secondary fs-5 d-none d-md-inline"></i>
                            </div>
                        </div>
                        <div class="col d-none d-md-flex justify-content-center align-items-center">
                            <p class="fs-small mb-0 text-light" id="minutesCurrent">00</p>
                            <p class="fs-small mb-0 text-light">:</p>
                            <p class="fs-small mb-0 text-light" id="secondsCurrent">00</p>
                            <div id="progress-bar-container" class="progress m-2 position-relative w-50"
                                style="height: 5px; background-color: #444;">
                                <div id="progress-bar" class="progress-bar bg-light" role="progressbar" style="width: 0%; transition: none;">
                                </div>
                            </div>
                            <p class="fs-small mb-0 text-light" id="minutesDuration">00</p>
                            <p class="fs-small mb-0 text-light">:</p>
                            <p class="fs-small mb-0 text-light" id="secondsDuration">00</p>
                         </div>`;

    sectionVolume.innerHTML = `
                        <div class="row d-none d-md-flex">
                            <div class="col-12 d-flex justify-content-center align-items-center">
                                <div class="m-2">
                                    <i class="bi bi-mic-fill text-secondary fs-6"></i>
                                </div>
                                <div class="m-2">
                                    <i class="bi bi-archive text-secondary fs-6"></i>
                                </div>
                                <div class="m-2">
                                    <i class="bi bi-music-player text-secondary fs-6"></i>
                                </div>
                                <div class="m-2">
                                    <i id="btnVolume" class="bi bi-volume-up text-secondary fs-4"></i>
                                </div>
                                <div class="m-2" style="flex-grow: 1;">
                                    <div id="volume-bar-container" class="progress" style="height: 5px; cursor: pointer;">
                                        <input type="range" id="volume-bar" class="volume-range" min="0" max="100" value="50">
                                    </div>
                                </div>
                                <div class="m-2">
                                    <i class="bi bi-arrows-angle-expand text-light fs-"></i>
                                </div>
                            </div>
                        </div>`;

    const play1 = document.getElementById('play1');

    if (play1) {
        play1.addEventListener('click', function () {
            if (audio.paused) {
                play1.classList.remove('bi-play-circle-fill');
                play1.classList.add('bi-pause-circle-fill');
                audio.play();
            } else {
                play1.classList.remove('bi-pause-circle-fill');
                play1.classList.add('bi-play-circle-fill');
                audio.pause();
            }
        });
    }

    const progressBarContainer = document.getElementById('progress-bar-container');
    const progressBar = document.getElementById('progress-bar');
    let isDragging = false;

    if (progressBarContainer) {
        progressBarContainer.addEventListener('mousedown', function (e) {
            isDragging = true;
            updateProgress(e);
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                updateProgress(e);
            }
        });

        document.addEventListener('mouseup', function () {
            isDragging = false;
        });

        progressBarContainer.addEventListener('click', function (e) {
            updateProgress(e);
        });

        function updateProgress(e) {
            const rect = progressBarContainer.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const totalWidth = rect.width;
            const percentage = Math.max(0, Math.min(1, offsetX / totalWidth));
            progressBar.style.width = (percentage * 100) + '%';
            audio.currentTime = percentage * audio.duration;
        }
    }

    function updateProgressBar() {
        let currentTime = audio.currentTime;
        let totalDuration = audio.duration;
        let progress = (currentTime / totalDuration) * 100;
        progressBar.style.width = progress + '%';

        const secondsCurrent = document.getElementById('secondsCurrent')
        secondsCurrent.innerText = currentTime < 10 ? `0${parseInt(currentTime)}` : parseInt(currentTime);

        const secondsDuration = document.getElementById('secondsDuration')
        secondsDuration.innerText = parseInt(totalDuration) || '00'

        let minutes = Math.floor(currentTime / 60);
        let seconds = Math.floor(currentTime % 60);
        const timeElapsed = document.getElementById('time-elapsed');
        if (timeElapsed) {
            timeElapsed.textContent = minutes + ':' + (seconds < 10 ? `0${seconds}` : seconds);
        }

        if (!audio.paused) {
            requestAnimationFrame(updateProgressBar);
        }
    }

    function shuffle() {
        const shuffleIcon = document.getElementById('shuffle-icon');

        shuffleIcon.addEventListener('click', function () {
            shuffleIcon.classList.toggle('activeShuffle');
            shuffleIcon.classList.toggle('text-secondary');
        });

        audio.addEventListener('ended', function () {

            if (shuffleIcon.classList.contains('activeShuffle')) {
                let currentIndex = albumDataArray.findIndex(element => element.preview === audio.src);

                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * albumDataArray.length);
                } while (newIndex === currentIndex);

                const nextElement = albumDataArray[newIndex];
                barControlAlbum(nextElement);
                audio.src = nextElement.preview;
                audio.play();

                const play1 = document.getElementById('play1');
                if (audio.paused) {
                    play1.classList.remove('bi-pause-circle-fill');
                    play1.classList.add('bi-play-circle-fill');
                } else {
                    play1.classList.remove('bi-play-circle-fill');
                    play1.classList.add('bi-pause-circle-fill');
                }
            }
        });
    }

    shuffle();

    function repeat() {
        const repeatIcon = document.getElementById('repeat-icon')
        repeatIcon.addEventListener('click', function () {
            repeatIcon.classList.toggle('activeShuffle')
            repeatIcon.classList.toggle('text-secondary')
        })

        audio.addEventListener('ended', function () {
            if (repeatIcon.classList.contains('activeShuffle')) {
                audio.play();
            }
        })
    }

    repeat()


    function nextSong() {
        const nextIcon = document.getElementById('next-icon');
        nextIcon.addEventListener('click', function () {
            let currentIndex = albumDataArray.findIndex(element => element.preview === audio.src);
            currentIndex = (currentIndex + 1) % albumDataArray.length;

            const nextElement = albumDataArray[currentIndex];
            barControlAlbum(nextElement);
            audio.src = nextElement.preview;
            audio.play();

            if (audio.played) {
                play1.classList.remove('bi-play-circle-fill');
                play1.classList.add('bi-pause-circle-fill');
            } else {
                play1.classList.remove('bi-pause-circle-fill');
                play1.classList.add('bi-play-circle-fill');
            }

        });
    }

    nextSong();

    const volumeBarContainer = document.getElementById('volume-bar-container');
    const volumeBar = document.getElementById('volume-bar');
    const btnVolume = document.getElementById('btnVolume')

    volumeBarContainer.addEventListener('click', function (event) {
        const rect = volumeBarContainer.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const volume = offsetX / rect.width;
        audio.volume = volume;
    });

    btnVolume.addEventListener('click', () => {
        audio.muted = !audio.muted;
        if (audio.muted) {
            btnVolume.classList.remove('bi-volume-up');
            btnVolume.classList.add('bi-volume-mute');
            volumeBar.setAttribute('disabled', true)
        } else {
            btnVolume.classList.remove('bi-volume-mute');
            btnVolume.classList.add('bi-volume-up');
            volumeBar.removeAttribute('disabled')
        }
        volumeBar.value = audio.muted ? 0 : audio.volume * 100;
        btnVolume.classList.toggle('text-light')
    });

    audio.addEventListener('ended', function () {
        const play1 = document.getElementById('play1');

        const shuffleIcon = document.getElementById('shuffle-icon');
        const repeatIcon = document.getElementById('repeat-icon');

        if (shuffleIcon.classList.contains('activeShuffle')) {
            fetchArtist();
        } else if (repeatIcon.classList.contains('activeShuffle')) {
            audio.currentTime = 0;
            audio.play();
            play1.classList.remove('bi-play-circle-fill');
            play1.classList.add('bi-pause-circle-fill');
        } else {
            play1.classList.remove('bi-pause-circle-fill');
            play1.classList.add('bi-play-circle-fill');
        }
    });

    audio.addEventListener('timeupdate', updateProgressBar);
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
document.getElementById('album-search').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// Carica la cronologia delle ricerche all'avvio della pagina
window.onload = loadSearchHistory;

document.addEventListener("DOMContentLoaded", function () {
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
