let SR_API_ANIMES =
  "https://service.sovetromantica.com/v1/animesearch?anime_name=";
let SHIKI_API_IMAGES = "https://shikimori.one/api/animes/";
let SR_ONGOINGS = "https://service.sovetromantica.com/v1/ongoing";
let SR_AnimeId = "https://service.sovetromantica.com/v1/anime/";
let vadimchik = document.querySelector(".player_overlay");

getOngoings(SR_ONGOINGS);

async function getOngoings(url) {
  let resp = await fetch(url);
  let Ids = await resp.json();
  for (id of Ids) {
    let resp = await fetch(SR_AnimeId + id);
    let data = await resp.json();
    showMovies(data, false);
  }
}

async function getMovies(url) {
  let resp = await fetch(url);
  let respData = await resp.json();
  for (id of respData) {
    let resp = await fetch(SR_AnimeId + id.anime_id);
    let data = await resp.json();
    showMovies(data, false);
  }
}

async function getImage(id) {
  let resp = await fetch(SHIKI_API_IMAGES + id);
  let respData = await resp.json();
  return respData.image.original;
}

function showMovies(data, isClearable = true) {
  let moviesEl = document.querySelector(".movies");
  if (isClearable) {
    document.querySelector(".movies").innerHTML = "";
  }
  for (movie of data) {
    if (movie.anime_shikimori == 0) {
      continue;
    }
    (async () => {
      let movieEl = document.createElement("div");
      let AnimeImage = await getImage(movie.anime_shikimori);
      let title = await movie.anime_name_russian;
      movieEl.classList.add("movie");
      movieEl.innerHTML = `
        <div class="movie__cover-inner">
        <img
          src="https://shikimori.one/${AnimeImage}"
          class="movie__cover"
          alt="${movie.nameRu}" />
        <div class="movie__cover--darkened"></div>
      </div>
      <div class="movie__info">
        <div class="movie__title">${title}</div>
      </div>
        `;
      movieEl.dataset.id = `${movie.anime_shikimori}`;
      await movieEl.addEventListener("click", async function () {
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
    })();
  }
}

let form = document.querySelector("form");
let search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  document.querySelector(".movies").innerHTML = "";
  let Anime_Search_Encoded = encodeURIComponent(search.value);

  let apiSearchUrl = `${SR_API_ANIMES}${Anime_Search_Encoded}`;
  if (search.value) {
    getMovies(apiSearchUrl);

    search.value = "";
  }
});

vadimchik.addEventListener("click", function () {
  let andrey = document.querySelector("#player");
  andrey.classList.add("hide");
  vadimchik.classList.add("hide");
});
