let ShikiTopThirty = "https://shikimori.one/api/animes?limit=32&order=ranked";
let ShikiSearchResults = 'https://shikimori.one/api/animes?limit=50&order=ranked&search=';
let playerOverlay = document.querySelector(".player_overlay");

getTopThirty(ShikiTopThirty);

async function getTopThirty(url) {
    let res = await fetch(url)
    let data = await res.json();
    showMovies(data)
}

async function searchResults(url) {
    let res = await fetch(url)
    let data = await res.json();
    showMovies(data)
}

function showMovies(data) {
  let moviesEl = document.querySelector(".movies");
  document.querySelector(".movies").innerHTML = "";
  for (let i = 0; i <= data.length -1 ;i++) {
      let anime = data[i];
        let movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
        <div class="movie__cover-inner">
        <img
          src="https://shikimori.one/${anime.image.original}"
          class="movie__cover"
          alt="${anime.russian}" 
          data-test="Для теста"/>
        <div class="movie__cover--darkened"></div>
      </div>
      <div class="movie__info">
        <div class="movie__title">${anime.russian}</div>
      </div>
        `;
      movieEl.dataset.id = `${anime.id}`;
      movieEl.addEventListener("click", async function () {
        let res = await fetch(
          `https://metamedia.glitch.me/api/search?shikimori_id=${movieEl.dataset.id}&sign=3052d19319b8daf0a194c9a770fc9a3d80bfe1bd3e0e28b7cfd7aacebaaf4f6b`
        );
        let data = await res.json();
        let player = document.querySelector("#player");
        let overplay = document.querySelector(".player_overlay");
        player.classList.remove("hide");
        overplay.classList.remove("hide");
        player.src = "";
        player.src = data.results[0].link;
      });
      moviesEl.appendChild(movieEl);
    };
}

let form = document.querySelector("form");
let search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let Anime_Search_Encoded = encodeURIComponent(search.value);
    let apiSearchUrl = `${ShikiSearchResults}${Anime_Search_Encoded}`;
    console.log(apiSearchUrl)
    searchResults(apiSearchUrl);
    search.value = "";
});

playerOverlay.addEventListener("click", function () {
  let andrey = document.querySelector("#player");
  andrey.classList.add("hide");
  playerOverlay.classList.add("hide");
});
