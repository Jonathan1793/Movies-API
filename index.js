/*global variables*/
const myKey = config.MY_KEY;
const readAccessToken = config.API_READ_ACCESS_TOKEN;
const movieListContainer = document.querySelector(".movie-list");
let maxDisplayMovies = 31;

/*API Authentication */

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + readAccessToken,
  },
};

/*requesting API Data*/

const getMovieList = async () => {
  for (i = 1; i < maxDisplayMovies; i++) {
    const movie = await fetch(
      `https://api.themoviedb.org/3/movie/${i}`,
      options
    )
      .then((res) => res.json())
      .then((res) =>
        res.id !== undefined && res.poster_path !== null
          ? generateCard(res)
          : maxDisplayMovies++
      );
  }

  movieSummary.innerHTML = "";
};

const generateCard = (movie) => {
  /*Appending element sections*/
  console.log(movie);
  const movieCard = document.createElement("div");
  const moviePoster = document.createElement("div");
  const movieImg = document.createElement("img");
  const movieDescription = document.createElement("div");
  const movieTitle = document.createElement("h2");
  const movieSummary = document.createElement("p");

  movieCard.classList.add("movie-card");
  moviePoster.classList.add("movie-poster");
  movieImg.classList.add("movie-img");
  movieDescription.classList.add("movie-description");
  movieTitle.classList.add("movie-title");
  movieSummary.classList.add("movie-summary");

  movieListContainer.appendChild(movieCard);
  movieCard.appendChild(moviePoster);
  movieCard.appendChild(movieDescription);
  moviePoster.appendChild(movieImg);
  movieDescription.appendChild(movieTitle);
  movieDescription.appendChild(movieSummary);
  movieTitle.innerHTML = movie.original_title;
  movieSummary.innerHTML = movie.overview;
  movieCard.style.backgroundImage = `url("https://image.tmdb.org/t/p/w500${movie.poster_path}")`;
};
getMovieList();
