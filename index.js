/*global variables*/
const myKey = config.MY_KEY;
const readAccessToken = config.API_READ_ACCESS_TOKEN;
const movieListContainer = document.querySelector(".movie-list");
const favoriteMoviesArr = [];
let maxDisplayMovies = 31;
const movies = [];

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
    await fetch(`https://api.themoviedb.org/3/movie/${i}`, options)
      .then((res) => res.json())
      .then((res) =>
        res.id !== undefined && res.poster_path !== null
          ? movies.push(res)
          : maxDisplayMovies++
      )
      .catch((err) => console.error(err));
  }
  movies.map((movie) => generateCard(movie));
};

const generateCard = (movie) => {
  //creating elements
  const heartIcon = document.createElement("i");
  const movieCard = document.createElement("div");
  const moviePoster = document.createElement("div");
  const movieImg = document.createElement("img");
  const movieDescription = document.createElement("div");
  const movieTitle = document.createElement("h2");
  const movieSummary = document.createElement("p");

  //adding necessary classes to elements created
  heartIcon.classList.add("fa-solid");
  heartIcon.classList.add("fa-heart");
  movieCard.classList.add("movie-card");
  moviePoster.classList.add("movie-poster");
  movieImg.classList.add("movie-img");
  movieDescription.classList.add("movie-description");
  movieTitle.classList.add("movie-title");
  movieSummary.classList.add("movie-summary");

  //appending elements to their corresponding parent element
  movieListContainer.appendChild(movieCard);
  movieCard.appendChild(heartIcon);
  movieCard.appendChild(moviePoster);
  movieCard.appendChild(movieDescription);
  moviePoster.appendChild(movieImg);
  movieDescription.appendChild(movieTitle);
  movieDescription.appendChild(movieSummary);

  //modifying content of the element
  movieCard.setAttribute("id", movie.id);
  movieTitle.innerHTML = movie.original_title;
  movieSummary.innerHTML = movie.overview;
  movieCard.style.backgroundImage = `url("https://image.tmdb.org/t/p/w500${movie.poster_path}")`;
  heartIcon.addEventListener("click", (event) => {
    addToFavoritesHandler(event.target.parentElement);
  });
};
getMovieList();

/*this next function handles the add movies to the favorites pile it does the following

1.- it checks if the array of favorite movies @FavoriteMoviesArr is empty:  
    if it is: it adds the selected movie to the array
    if it is not: it checks that the ID of the movie selected is not already in the array:
        if it is: it will send an alert with a message displaying that the movie selected is
        already a favorite movie
        if is not: it will push the selected movie into the array
*/

/*NOTE TO SELF: we will need the array of favorite movies in the future to saved them to cache
and to display the correct movies in the home page so it doesn't include any movie that is
already in the array */

const addToFavoritesHandler = (favoritedMovie) => {
  if (favoriteMoviesArr.length === 0) {
    favoriteMoviesArr.push(favoritedMovie);
  } else if (
    favoriteMoviesArr.map((movie) => movie.id).includes(favoritedMovie.id)
  ) {
    alert(
      `the movie ${favoritedMovie.children[2].children[0].innerHTML} is already in favorites`
    );
  } else {
    favoriteMoviesArr.push(favoritedMovie);
  }
};
