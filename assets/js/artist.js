

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
            console.log(artist)
            colHeroImg.innerHTML = `
                        <div class="col-12 d-flex justify-content-between mb-3">
                            <div class="d-flex">
                                <div
                                    class="square rounded-circle bg-black text-secondary d-flex justify-content-center align-items-center me-4">
                                    <i class="fa-solid fa-chevron-left fs-5"></i>
                                </div>

                                <div
                                    class="square rounded-circle bg-black text-secondary d-flex justify-content-center align-items-center">
                                    <i class="fa-solid fa-chevron-right fs-5"></i>
                                </div>
                            </div>
                            <div class="d-flex text-light bg-black rounded-5 justify-content-end align-items-center">
                                <div class="square me-3">
                                    <img src="assets/img/search/image-1.jpeg" class="w-100 rounded-circle" alt="">
                                </div>
                                <p class="m-0 me-3">Team 1...</p>
                                <i id="dropdown" class="fa-solid fa-caret-down fs-5 align-self-self pe-3"></i>
                            </div>
                        </div>

                        <div class="col-8 mb-3">
                            <div id="colHero" class="row text-light rounded-2 m-2">

                                <div class="col-9 d-flex flex-column justify-content-end">
                                    <div>
                                        <p class="pt-3 fs-small mb-2 d-flex align-items-center">
                                            <span class=" icon-container me-2">
                                                <i class="bi bi-patch-check-fill fs-3 icon-background"></i>
                                                <i class="bi bi-patch-check fs-3 icon-foreground"></i>
                                            </span>Artist Verificato
                                        </p>
                                    </div>
                                    <div>
                                        <h1 class="fs-10 fw-bold mb-0 display-1">${artist.data[0].contributors[0].name}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-4">
                            <img src="${artist.data[0].contributors[0].picture_xl}" class="rounded-circle w-60 shadow" alt="">
                        </div>`

            containerArtist.innerHTML = `
                            <div class="row">
                                <div class="col m-0">
                                    <div class="row">
                                        <div class="col d-flex align-items-center">
                                            <div class="me-4 btn-round">
                                                <div>
                                                    <svg class="bgSpoty rounded-circle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                <div class="col-12">
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
                                </div>

                                ${artist.data.map((element, index) => {
                                    const trackDurationMinutes = Math.floor(element.duration / 60);
                                    const trackDurationSeconds = element.duration % 60;
                                    return `
                                            <div class="col-12 d-flex">
                                                <div class="row px-4 text-light my-4 fs-6 align-items-center">
                                                    <div class="col-1 px-0 me-2 mb-0 align-self-center">${index + 1}</div>
                                                    <div class="col px-0 mb-0">
                                                        <h4 class="mb-1">${element.title}</h4>
                                                        <p>${element.artist.name}</p>
                                                    </div>
                                                </div>
                                                <div class="col-3 px-0 text-end">${element.rank}</div>
                                                <div class="col-3 px-0 text-end">${trackDurationMinutes}:${trackDurationSeconds < 10 ? '0' : ''}${trackDurationSeconds}</div>
                                            </div>
                                        `;
                                }).join('')}

                             </div>`;

            const destra = document.getElementById('destra')
            dropdown.addEventListener('click', function () {
                destra.classList.toggle('display')
            })

            setBackgroundColor(artist.data[0])
        })
        .catch((error) => {
            console.log('errore', error);
        });

}

fetchArtistDetails(addressBarParameters);

function heroDisplay(hero) {

}



/* ${artist.data[0].contributors[0].picture_xl} */

/* ${artist.data.map((element, index) => {
    const trackDurationMinutes = Math.floor(element.duration / 60);
    const trackDurationSeconds = element.duration % 60;
    return `
            <div class="col-12 d-flex">
                <div class="row px-4 text-light my-4 fs-6 align-items-center">
                    <div class="col-1 px-0 me-2 mb-0 align-self-center">${index + 1}</div>
                    <div class="col px-0 mb-0">
                        <h4 class="mb-1">${element.title}</h4>
                        <p>${element.artist.name}</p>
                    </div>
                </div>
                <div class="col-3 px-0 text-end">${element.rank}</div>
                <div class="col-3 px-0 text-end">${trackDurationMinutes}:${trackDurationSeconds < 10 ? '0' : ''}${trackDurationSeconds}</div>
            </div>
        `;
}).join('')} */