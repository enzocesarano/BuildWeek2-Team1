const annunci = document.getElementById('annunci')
const sectionPlayer = document.getElementById('sectionPlayer')



function fetchArtist() {
    const random = [Math.floor(Math.random() * 2000)]
    console.log(random)
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${random}/top?limit=50`)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('error')
            }
        })

        .then((artist) => {
            console.log(artist.data)
            const randomIndex = Math.floor(Math.random() * artist.data.length);
            const randomArtist = artist.data[randomIndex];
            if (!randomArtist || !randomArtist.album) {
                fetchArtist();
            } else {
                display(randomArtist)
                play()  
            }
        })

        .catch((error) => {
            console.log('errore', error)
        })
}

fetchArtist();

function display(art) {
    annunci.innerHTML = `<div class="row justify-content-center text-light bgCenterBlack rounded-2">
                                <div class="col-2 p-0">
                                    <div class="w-100">
                                        <img src=${art.album.cover_big} class="album-cover w-100 px-3 py-4"
                                            alt="Album Cover">
                                    </div>
                                </div>
                                <div class="col-10">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <p class="pt-3 fs-small mb-1">ALBUM</p>
                                        <a href="#"
                                            class="fs-supersmall me-5 mt-2 text-secondary p-2 text-decoration-none">NASCONDI
                                            ANNUNCI</a>
                                    </div>

                                    <p class="fs-8 fw-bold mb-0">${art.title_short}</p>
                                    <p class="lead fs-6 mb-2">${art.artist.name}</p>
                                    <p class="lead fs-6 mb-1">Ascolta il singolo di ${art.artist.name}!</p>
                                    <button
                                        class="btn bgSpoty btn-lg rounded-5 me-3 py-2 px-4 fw-bold fs-small btnPlay" id=${art.id}>Play</button>
                                    <button
                                        class="btn btn-outline-light btn-lg rounded-5 me-3 py-2 px-4 fw-bold fs-small border-secondary">Salva</button>
                                    <a class="text-secondary fs-2 mb-3 text-decoration-none">...</a>
                                </div>
                            </div>`

                                        
}


function play() {
    const btnPlay = document.querySelectorAll('.btnPlay')
    btnPlay.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault()
            sectionPlayer.innerHTML = `<div class="container-fluid bg-dark border border-0 border-top border-1 border-light p-0">
            <div class="row text-center">
                <div class="col-2 text-start">
                    <img src="assets/img/main/image-1.jpg" class="w-25 m-2" alt="icona">
                </div>
                <div class="col-8 text-center">
                    <div class="row">
                        <div class="col-12 d-flex justify-content-center align-items-center">
                            <div class="m-2 mx-3">
                                <i id="shuffle-icon" class="bi bi-shuffle text-light fs-5"></i>
                            </div>
                            <div class="m-2">
                                <i class="bi bi-skip-backward-fill text-light fs-5"></i>
                            </div>
                            <div class="m-2 mx-4">
                                <i id="play" class="bi bi-play-circle-fill text-light fs-2"></i>
                            </div>
                            <div class="m-2">
                                <i class="bi bi-skip-forward-fill text-light fs-5"></i>
                            </div>
                            <div class="m-2 mx-3">
                                <i id="repeat-icon" class="bi bi-repeat text-light fs-5"></i>
                            </div>
                        </div>
                        <div class="col">
                            <div class="progress m-2" style="height: 5px; background-color: #444;">
                                <div id="progress-bar" class="progress-bar bg-light" role="progressbar" style="width: 0%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-2">
                </div>
            </div>
        </div>`

        })
    })
}    


