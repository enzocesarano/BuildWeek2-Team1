const dropdown = document.getElementById('dropdown')
const destra = document.getElementById('destra')
const center = document.getElementById('center')

dropdown.addEventListener('click', function(){
    destra.classList.toggle('display')
})

let progressBar = document.getElementById('progress-bar');
let timeElapsed = document.getElementById('time-elapsed');
let totalDurationElem = document.getElementById('total-duration');
let audioPlayer = document.getElementById('audio-player');

/* let playlist = []; */      // MOMENTANEO
let currentTrack = 0;
let shuffleMode = false;
let repeatMode = false;

                                            // DA CONTROLLARE DA QUI A...

async function fetchPlaylist() {                                                   
    try {
        let response = await fetch('https://api.example.com/getPlaylist'); 
        let data = await response.json();
        playlist = data.tracks; 
        loadTrack(currentTrack);
    } catch (error) {
        console.error('Errore durante il recupero della playlist:', error);
    }
}

function loadTrack(index) {                                                       
    if (playlist.length > 0) {
        audioPlayer.src = playlist[index].url; 
        audioPlayer.load();
    }
}

function updateProgressBar() {
    let currentTime = audioPlayer.currentTime;
    let totalDuration = audioPlayer.duration;
    let progress = (currentTime / totalDuration) * 100;
    progressBar.style.width = progress + '%';

    let minutes = Math.floor(currentTime / 60);
    let seconds = Math.floor(currentTime % 60);
    timeElapsed.textContent = minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);

    if (!audioPlayer.paused) {
        requestAnimationFrame(updateProgressBar);
    }
}


                                                // ... A QUI!

// pulsanti progress bar
// PLAY
document.getElementById('play-icon').addEventListener('click', function() {
    if (audioPlayer.paused)   {
        audioPlayer.play();
        this.classList.remove('bi-play-circle-fill');
        this.classList.add('bi-pause-circle-fill');
        requestAnimationFrame(updateProgressBar);
    } else {
        audioPlayer.pause();
        this.classList.remove('bi.pause-circle.fill');
        this.classList.add('bi.play-circle-fill');    
    }
});

// SHUFFLE
document.getElementById('shuffle-icon').addEventListener('click', function() {
    shuffleMode = !shuffleMode;
    this.classList.toggle('text-success');
    this.parentNode.classList.toggle('active');
});

// REPEAT
document.getElementById('repeat-icon').addEventListener('click', function() {
    repeatMode = !repeatMode;
    this.classList.toggle('text-success');
    this.parentNode.classList.toggle('active');
});

// BACKWARD 
document.getElementById('backward-icon').addEventListener('click', function() {
    if (currentTrack > 0) {
        currentTrack--;
        loadTrack(currentTrack);
        audioPlayer.play();
        document.getElementById('play-icon').classList.remove('bi-play-circle.fill');
        document.getElementById('play-icon').classList.add('bi-pause-circle.fill');
        requestAnimationFrame(updateProgressBar);
    }
});

// FORWARD
document.getElementById('forward-icon').addEventListener('click', function() {
    if (currentTrack < playlist.length - 1) {
        currentTrack ++;
        loadTrack(currentTrack);
        audioPlayer.play();
        document.getElementById('play-icon').classList.remove('bi-play-circle.fill');
        document.getElementById('play-icon').classList.add('bi-pause-circle.fill');
        requestAnimationFrame(updateProgressBar);
    }
});


// VOLUME

document.addEventListener('DOMContentLoaded', function () {
    const volumeBarContainer = document.getElementById('volume-bar-container');
    const volumeBar = document.getElementById('volume-bar');
    const audioElement = document.getElementById('audio-player'); 

    const updateVolume = (e) => {
        const rect = volumeBarContainer.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const newVolume = Math.min(Math.max(offsetX / rect.width, 0), 1); 
        volumeBar.style.width = `${newVolume * 100}%`;

        if (audioElement) {
            audioElement.volume = newVolume;
        }
    };

    volumeBarContainer.addEventListener('click', updateVolume);

    let isDragging = false;

    volumeBarContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateVolume(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateVolume(e);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});