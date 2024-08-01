const dropdown = document.getElementById('dropdown');
const destra = document.getElementById('destra');
const center = document.getElementById('center');

dropdown.addEventListener('click', function () {
    destra.classList.toggle('d-lg-none');
});

const annunci = document.getElementById('annunci');
const sectionPlayer = document.getElementById('sectionPlayer');
const sectionAlbum = document.getElementById('sectionAlbum');
const sectionVolume = document.getElementById('sectionVolume');
const audio = document.createElement('audio');

let songHistory = []; // Array per tenere traccia delle canzoni
let currentSongIndex = -1; // Indice della canzone corrente

function setBackgroundColor(art) {
    if (!art || !art.album || !art.album.cover_big) {
        console.error('Album cover not found');
        return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = art.album.cover_big;

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

        annunci.style.backgroundColor = dominantColor;
    };

    img.onerror = function () {
        console.error('Failed to load image');
    };
}

function fetchArtist() {
    const random = [Math.floor(Math.random() * 2000)];
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${random}/top?limit=50`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('error');
            }
        })
        .then((artist) => {
            console.log(artist.data);
            const randomIndex = Math.floor(Math.random() * artist.data.length);
            const randomArtist = artist.data[randomIndex];
            if (!randomArtist || !randomArtist.album) {
                fetchArtist();
            } else {
                display(randomArtist);
                playNext(randomArtist);
                play(randomArtist);
            }
        })
        .catch((error) => {
            console.log('errore', error);
        });
}

fetchArtist();

function display(art) {
    annunci.innerHTML = `<div class="row justify-content-center text-light bgCenterBlack rounded-2 p-3">
                            <div class="col-2 p-0">
                                <div class="w-100">
                                    <img src=${art.album.cover_big} class="w-100 px-3 py-4" alt="Album Cover">
                                </div>
                            </div>
                            <div class="col-10 d-flex flex-column justify-content-between">
                                <div class="d-flex justify-content-between align-items-center">
                                    <p class="fs-small mb-1">ALBUM</p>
                                    <a href="#" class="fs-supersmall me-5 mt-2 text-secondary p-2 text-decoration-none">NASCONDI ANNUNCI</a>
                                </div>
                                
                                <div>
                                    <p class="fs-8 fw-bold mb-0 text-truncate">${art.title_short}</p>
                                    <p class="lead fs-6 mb-2">${art.artist.name}</p>
                                    <p class="lead fs-6 mb-1">Ascolta il singolo di ${art.artist.name}!</p>
                                </div> 
                                <div> 
                                    <button class="btn bgSpoty btn-lg rounded-5 me-3 py-2 px-4 fw-bold fs-small btnPlay" id=${art.id}>Play</button>
                                    <button class="btn btn-outline-light btn-lg rounded-5 me-3 py-2 px-4 fw-bold fs-small border-secondary">Salva</button>
                                    <a class="text-secondary fs-2 mb-3 text-decoration-none">...</a>
                                </div> 
                            </div>
                        </div>`;

    setBackgroundColor(art);
}

function playNext(song) {
    // Aggiungi la canzone attuale alla cronologia
    songHistory.push(song);
    currentSongIndex++;

    audio.src = song.preview;
    audio.play();
    barControlAlbum(song);
}

function play(song) {
    const btnPlay = document.querySelectorAll('.btnPlay');
    btnPlay.forEach(element => {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            barControl(song);
            audio.play()
            sectionControl.classList.remove('d-none');
        });
    });
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
                            <i class="bi bi-suit-heart fs-small text-light fs-5"></i>
                        </div>
                    </div> 
                </div>`;
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
        const shuffleIcon = document.getElementById('shuffle-icon')
        shuffleIcon.addEventListener('click', function () {
            shuffleIcon.classList.toggle('activeShuffle')
            shuffleIcon.classList.toggle('text-secondary')
        })
    }

    shuffle()

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
        const nextIcon = document.getElementById('next-icon')
        nextIcon.addEventListener('click', function () {
            fetchArtist()
            if (audio.played) {
                play1.classList.remove('bi-play-circle-fill');
                play1.classList.add('bi-pause-circle-fill');
                audio.play();
            } else {
                play1.classList.remove('bi-pause-circle-fill');
                play1.classList.add('bi-play-circle-fill');
                audio.pause();
            }
        })
    }

    nextSong()

    function previousSong() {
        const backIcon = document.getElementById('backward-icon');
        backIcon.addEventListener('click', function () {
            // Controlla se ci sono canzoni precedenti
            if (currentSongIndex > 0) {
                currentSongIndex--; // Torna alla canzone precedente
                const previousSong = songHistory[currentSongIndex];
                audio.src = previousSong.preview; // Aggiorna la sorgente audio con la canzone precedente
                audio.play(); // Riproduci la canzone precedente
                display(previousSong); // Mostra la canzone precedente nella hero
                barControlAlbum(previousSong) // Mostra la canzone precedente nella barra di controllo
            }
        });
    }

    previousSong();

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





const randomAlbum = [325940967, 597941372, 302867697, 577200911, 80513002, 1709754]

function fetchAlbum() {
    randomAlbum.forEach(element => {
        fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${element}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('error');
                }
            })
            .then((album) => {
                const albumSection = document.getElementById('albumSection')
                albumSection.innerHTML += `<div class="col p-0 mb-10">
                                    <div id=${album.id} class="card p-3 bg-dark border-0 text-secondary hover2">
                                        <div class="w-100 position-relative">
                                            <img src="${album.cover_big}" class="card-img-top w-100"
                                                alt="${album.title}">
                                            <div>
                                            <svg id="playAlbum"  class="w-30 position-absolute top-75 start-70 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#1ED760"/>
                                                <path d="M15.4137 13.059L10.6935 15.8458C9.93371 16.2944 9 15.7105 9 14.7868V9.21316C9 8.28947 9.93371 7.70561 10.6935 8.15419L15.4137 10.941C16.1954 11.4026 16.1954 12.5974 15.4137 13.059Z" fill="black"/>
                                                </svg>
                                            </div>
    
                                        </div>
                                        <div class="card-body p-0 py-2">
                                            <p class="card-title text-light fs-small fw-bold mb-1 text-uppercase text-truncate">${album.title}</p>
                                            <p class="card-text fs-small">${album.artist.name}</p>
                                        </div>
                                    </div>
                                </div>`

            })
            .catch((error) => {
                console.log('errore', error);
            });
    })
}

fetchAlbum()




const randomArtistDetails = [48975581, 64816, 564, 27, 8706544, 542]

function fetchArtistDetails() {
    randomArtistDetails.forEach(element => {
        fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${element}/top?limit=1`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('error');
                }
            })
            .then((artist) => {
                const artistData = artist.data[0]
                console.log(artist.data[0]); // Ottieni i dati dell'artista
                const artistContainer = document.getElementById('artistContainer');
                artistContainer.innerHTML += `<div class="col p-0 mb-4">
                    <div class="card p-3 bg-dark border-0 text-secondary hover2">
                        <div class="position-relative">
                            <img src="${artistData.contributors[0].picture_big}" class="card-img-top rounded-circle"
                                 alt="${artistData.contributors[0].name}">
                            <div>
                                <svg class="w-30 position-absolute top-75 start-70 playArtist" data-preview="${artistData.preview}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#1ED760"/>
                                    <path d="M15.4137 13.059L10.6935 15.8458C9.93371 16.2944 9 15.7105 9 14.7868V9.21316C9 8.28947 9.93371 7.70561 10.6935 8.15419L15.4137 10.941C16.1954 11.4026 16.1954 12.5974 15.4137 13.059Z" fill="black"/>
                                </svg>
                            </div>
                        </div>
                        <div class="card-body p-0 py-2">
                            <p class="card-title text-light fs-small fw-bold mb-1 text-uppercase text-truncate">${artistData.contributors[0].name}</p>
                            <p class="card-text fs-small">Artista</p>
                        </div>
                    </div>
                </div>`;

                // Aggiungi l'event listener qui per ogni playArtist
                const playArtist = document.querySelectorAll(`.playArtist`);
                function qualunque(qualcosa) {
                    playArtist.forEach(element => {
                        element.addEventListener('click', function () {
                            audio.src = element.getAttribute('data-preview'); // Ottieni il preview dall'attributo
                            audio.play();
                            sectionControl.classList.remove('d-none');
                            barControl(qualcosa); // Passa l'intero oggetto artista
                            barControlAlbum(qualcosa); // Puoi passare l'oggetto artista se serve
                        });
                    })
                }
                qualunque(artistData)
                
            })
            .catch((error) => {
                console.log('errore', error);
            });
    });
}

fetchArtistDetails()