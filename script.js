const inputSongName = document.getElementById('inputSongName');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');
const lyricsArea = document.getElementById('lyrics-area');

const apiURL = 'https://api.lyrics.ovh';
//Search by song or artist
async function searchSongs(term) {
    const res = await fetch(`${apiURL}/suggest/${term}`)
    let data = await res.json();

    showData(data);
}
//Show song and artist in DOM
function showData(data) {
    result.innerHTML = `
        <ul class="songs">
            ${data.data.map(song => `<li>
            <span><strong>${song.title}</strong> Album by ${song.artist.name}</span>
            <button class = "btn btn-success" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
        </li>`)
        .join('')
    }
        </ul>
    `;

    if (data.prev || data.next) {
        more.innerHTML =`
        ${data.prev ? `<button class="btn btn-success" onclick="getMoreSongs('${data.prev}')">Prev</button> `: ''}
        ${data.next ? `<button class="btn btn-success" onclick="getMoreSongs('${data.next}')">Next</button> `: ''}
        `;
    }
    else {
        more.innerHTML = '';
    }
}
//Get prev or next Songs
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    
    showData(data);
}   
//Get lyrics for song
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
    result.innerHTML = `
    <h2 class="title-style"><strong>${artist}</strong> - ${songTitle}</h2>
    <span class="lyrics-style">${lyrics}</span> `;

    more.innerHTML = '';
}
//adding Event Listener 
search.addEventListener('click', e => {
    e.preventDefault();

    const searchTerm = inputSongName.value.trim();

    if (!searchTerm) {
        alert('Please type in a search term')
    }
    else {
        searchSongs(searchTerm);
    }
});
//Click lyrics button to get lyrics
result.addEventListener('click', e => {
    const clickElement = e.target;
    if(clickElement.tagName === 'BUTTON') {
        const artist = clickElement.getAttribute('data-artist');
        const songTitle = clickElement.getAttribute('data-songtitle');
        getLyrics(artist, songTitle);
        lyricsArea.innerHTML = '';
    } 
});