

const containerArtist = document.getElementById('containerArtist')
const colHeroImg = document.getElementById('colHeroImg')
const addressBarParameters = new URLSearchParams(location.search).get('artistId')

function setBackgroundColor(art) {
    if (!art || !art.contributors[0] || !art.contributors[0].picture_xl) {
        console.error('Image cover not found');
        return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = art.contributors[0].picture_xl;

    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r = 0, g = 0, b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }

        const avgR = Math.floor(r / count);
        const avgG = Math.floor(g / count);
        const avgB = Math.floor(b / count);
        const dominantColor = `rgb(${avgR}, ${avgG}, ${avgB})`;

        colHeroImg.style.backgroundColor = dominantColor;
    };

    img.onerror = function () {
        console.error('Failed to load image');
    };
}


const albumDataArray = []
const audio = document.createElement('audio');

let currentIndex;

function fetchArtistDetails(artistId) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=50`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('error');
            }
        })
        .then((artist) => {
            console.log(artist.data)
            colHeroImg.innerHTML = `
                    <div class="row bgCenterDark p-4 pb-0">
                        <div class="col-12 d-flex justify-content-between mb-3">
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
                                    <img src="assets/img/search/image-1.jpeg" class="w-100 rounded-circle" alt="Team 1 Image">
                                </div>
                                <p class="m-0 me-3">Team 1...</p>
                                <i id="dropdown" class="fa-solid fa-caret-down fs-5 align-self-center pe-3"></i>
                            </div>
                        </div>

                        <div class="col-8 mb-3">
                            <div id="colHero" class="row text-light rounded-2 m-2">
                                <div class="col-9 d-flex flex-column justify-content-end">
                                    <div>
                                        <p class="pt-3 fs-small mb-2 d-flex align-items-center">
                                            <span class="icon-container me-2">
                                                <i class="bi bi-patch-check-fill fs-3 icon-background"></i>
                                                <i class="bi bi-patch-check fs-3 icon-foreground"></i>
                                            </span>Artista Verificato
                                        </p>
                                    </div>
                                    <div>
                                        <h1 class="fs-10 fw-bold mb-0 display-1">${artist.data[0].contributors[0].name}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-4">
                            <img src="${artist.data[0].contributors[0].picture_xl}" class="rounded-circle w-60 shadow" alt="Immagine di ${artist.data[0].contributors[0].name}">
                        </div>

                        <div class="col m-0">
                            <div class="row">
                                <div class="col d-flex align-items-center mb-6">
                                    <div class="me-4 btn-round">
                                        <div>
                                            <svg class="bgSpoty play rounded-circle cursorPointer" id="playAll" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#1ED760"/>
                                                <path d="M15.4137 13.059L10.6935 15.8458C9.93371 16.2944 9 15.7105 9 14.7868V9.21316C9 8.28947 9.93371 7.70561 10.6935 8.15419L15.4137 10.941C16.1954 11.4026 16.1954 12.5974 15.4137 13.059Z" fill="black"/>
                                            </svg>
                                        </div>
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
                        </div>

                        <div class="col-12 border border-0 border-bottom border-1 border-secondary mb-3">
                            <div class="row text-light fs-6 align-items-center">
                                <div class="col-12">
                                    <h2 class="text-light fs-2 fw-bold">Popolari</h2>
                                </div>
                                <div class="col-6 d-flex p-0">
                                    <p class="col-1 align-self-center">#</p>
                                    <p class="col align-self-center">TITOLO</p>
                                </div>
                                <div class="col-5 p-0">
                                    <p class="text-end text-center">RIPRODUZIONE</p>
                                </div>
                                <div class="col-1 p-0">
                                    <p class="mb-0 text-end me-3"><i class="bi bi-clock"></i></p>
                                </div>
                            </div>
                        </div>
                    </div>`

            let currentSongIndex = 0;

            function playAllSongs() {
                if (albumDataArray.length === 0) return;

                currentSongIndex = 0;
                playSong(albumDataArray[currentSongIndex]);
            }


            function playSong(song) {
                audio.src = song.preview;
                audio.play();
                sectionControl.classList.remove('d-none');
                barControlAlbum(song);
                barControl(song)
            }


            const playAllButton = document.getElementById('playAll');
            playAllButton.addEventListener('click', playAllSongs);

            const destra = document.getElementById('destra')
            dropdown.addEventListener('click', function () {
                destra.classList.toggle('display')
            })

            setBackgroundColor(artist.data[0])



            artist.data.map((element, index) => {
                if (index < 10) {
                    const albumData = JSON.stringify(artist.data[index])

                    albumDataArray.push(JSON.parse(albumData))

                    const trackDurationMinutes = Math.floor(element.duration / 60);
                    const trackDurationSeconds = element.duration % 60;
                    containerArtist.innerHTML += `
                                            <div class="col-6 d-flex p-0 align-items-center mb-3">
                                            <div class="col-1 align-self-center fs-4">
                                                <span>${index + 1}</span>
                                            </div>
                                            <div class="p-0 cursorPointer btnPlay" data-preview="${element.preview}" data-artist='${albumData.replace(/'/g, "&apos;")}'>
                                                <h4 class="mb-1 fs-6">${element.title}</h4>
                                                <p class="fs-small text-secondary mb-0">${element.artist.name}</p>
                                            </div>
                                        </div>
                                        <div class="col-5">
                                            <p class="text-end mb-0 text-secondary text-center">${element.rank}</p>
                                        </div>
                                        <div class="col-1">
                                            <p class="text-end text-secondary">
                                                ${trackDurationMinutes}:${trackDurationSeconds < 10 ? '0' : ''}${trackDurationSeconds}
                                            </p>
                                        </div>`;

                }

            })


            const newPlayAlbum = document.querySelectorAll(`.btnPlay`);

            newPlayAlbum.forEach((element) => {
                const artistData1 = JSON.parse(element.getAttribute('data-artist'));
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
                                            <img src="${data.album.cover}" class="w-100" alt="icona">
                                        </div>
                                        <div class="col text-start d-flex flex-column nowrap">
                                            <p class="text-light fs-small m-0 text-truncate">${data.title_short}</p>
                                            <p class="fs-supersmall m-0 text-truncate">${data.artist.name}</p>
                                        </div>
                                        <div class="col d-none d-md-block">
                                            <i id="clickHeart" class="bi bi-suit-heart fs-small fs-5 cursorPointer"></i>
                                        </div>
                                    </div> 
                                </div>`

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
        .catch((error) => {
            console.log('errore', error);
        });


}

fetchArtistDetails(addressBarParameters);





const sectionControl = document.getElementById('sectionControl')
const sectionPlayer = document.getElementById('sectionPlayer');
const sectionAlbum = document.getElementById('sectionAlbum');
const sectionVolume = document.getElementById('sectionVolume');


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




function fetchAlbum(artist) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artist}/albums`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('error');
            }
        })
        .then((album) => {
            const array = album.data
            array.forEach(element => {
                const albumSection = document.getElementById('albumSection');

                albumSection.innerHTML += `<div class="col p-0">
                                <div id=${element.id} class="card p-3 bg-dark border-0 text-secondary hover2 click">
                                    <div class="w-100 position-relative">
                                        <img src="${element.cover_big}" class="card-img-top w-100"
                                            alt="${element.title}">
                                        <div>
                                    </div>
                                    <div class="card-body p-0 py-2">
                                        <p class="card-title text-light fs-small fw-bold mb-1 text-uppercase text-truncate">${element.title}</p>
                                        <p class="card-text fs-small">${element.release_date}</p>
                                    </div>
                                </div>`
            })

            const click = document.querySelectorAll('.click')
            click.forEach(element => {
                element.addEventListener('click', function () {
                    const albumId = element.id;
                    location.assign(`./album.html?albumId=${albumId}`)
                })
            })
        })
        .catch((error) => {
            console.log('errore', error);
        });
}

fetchAlbum(addressBarParameters);



function performSearch() {
    const albumName = document.getElementById('album-search').value.trim();
    if (albumName) {
        location.assign(`./album.html?search=${albumName}`); // Effettua la ricerca
        document.getElementById('album-search').value = ''; // Pulisce il campo di ricerca
    }
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

        performSearch()

        searchInput.value = '';
    }
}

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