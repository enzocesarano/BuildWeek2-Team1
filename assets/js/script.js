const dropdown = document.getElementById('dropdown');
const destra = document.getElementById('destra');
const center = document.getElementById('center');

dropdown.addEventListener('click', function () {
    destra.classList.toggle('display');
});

const annunci = document.getElementById('annunci');
const sectionPlayer = document.getElementById('sectionPlayer');
const sectionAlbum = document.getElementById('sectionAlbum');
const sectionVolume = document.getElementById('sectionVolume');
const sectionControl = document.getElementById('sectionControl');

function setBackgroundColor(art) {
    if (!art || !art.album || !art.album.cover_big) {
        console.error('Album cover not found');
        return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = art.album.cover_big;

    img.onload = function() {
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

    img.onerror = function() {
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

const audio = document.createElement('audio');

function playNext(song) {
    audio.src = song.preview;
    audio.play();
    barControllAlbum(song);
}

function play(song) {
    const btnPlay = document.querySelectorAll('.btnPlay');
    btnPlay.forEach(element => {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            playNext(song);
            barControll(song);
            sectionControl.classList.remove('d-none');
        });
    });
}


function barControllAlbum(song) {
    sectionAlbum.innerHTML = `
                <div class="col d-flex text-secondary align-items-center">
                    <div class="row align-items-center">
                        <div class="col w-25 d-flex align-items-center">
                            <img src="${song.album.cover}" class="w-100" alt="icona">
                        </div>
                        <div class="col text-start d-flex flex-column nowrap">
                            <p class="text-light fs-small m-0 text-truncate">${song.title_short}</p>
                            <p class="fs-supersmall m-0 text-truncate">${song.artist.name}</p>
                        </div>
                        <div class="col">
                            <i class="bi bi-suit-heart fs-small text-light fs-5"></i>
                        </div>
                    </div> 
                </div>`
}


function barControll(song) {
    sectionPlayer.innerHTML = `
                        <div class="col-12 d-flex justify-content-center align-items-center hover">
                            <div class="m-2 mx-3">
                                <i id="shuffle-icon" class="bi bi-shuffle text-secondary fs-5"></i>
                            </div>
                            <div class="m-2">
                                <i class="bi bi-skip-backward-fill text-secondary fs-5"></i>
                            </div>
                            <div class="m-2 mx-4">
                                <i id="play1" class="bi bi-pause-circle-fill text-secondary fs-2"></i>
                            </div>
                            <div class="m-2">
                                <i id="next-icon" class="bi bi-skip-forward-fill text-secondary fs-5"></i>
                            </div>
                            <div class="m-2 mx-3">
                                <i id="repeat-icon" class="bi bi-repeat text-secondary fs-5"></i>
                            </div>
                        </div>
                        <div class="col d-flex justify-content-center align-items-center">
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
    <div class="row">
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
        secondsDuration.innerText = parseInt(totalDuration)

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

        audio.addEventListener('ended', function () {
            if (shuffleIcon.classList.contains('activeShuffle')) {
                fetchArtist();
            }
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
            playNext(song)
            if (audio.played) {
                play1.classList.remove('bi-play-circle-fill');
                play1.classList.add('bi-pause-circle-fill');
                audio.play();
            } else {
                play1.classList.remove('bi-pause-circle-fill');
                play1.classList.add('bi-play-circle-fill');
                audio.pause();
            }
            barControllAlbum(song)
        })
    }

    nextSong()

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

    audio.addEventListener('timeupdate', updateProgressBar);
}