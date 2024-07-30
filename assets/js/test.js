const annunci = document.getElementById('annunci')




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
                                        class="btn bgSpoty btn-lg rounded-5 me-3 py-2 px-4 fw-bold fs-small">Play</button>
                                    <button
                                        class="btn btn-outline-light btn-lg rounded-5 me-3 py-2 px-4 fw-bold fs-small border-secondary">Salva</button>
                                    <a class="text-secondary fs-2 mb-3 text-decoration-none">...</a>
                                </div>
                            </div>`

}