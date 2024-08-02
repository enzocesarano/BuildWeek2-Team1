const dropdown = document.getElementById('dropdown');
const destra = document.getElementById('destra');
const center = document.getElementById('center');

dropdown.addEventListener('click', function () {
    destra.classList.toggle('d-lg-none');
});


function performSearch() {
    const albumName = document.getElementById('album-search').value.trim();
    if (albumName) {
        location.assign(`./album.html?search=${albumName}`); // Effettua la ricerca
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
        performSearch()
        searchInput.value = '';
    }
}

document.getElementById('search-button').addEventListener('click', handleSearch);

document.getElementById('album-search').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});


window.onload = loadSearchHistory;

document.addEventListener("DOMContentLoaded", function() {
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



