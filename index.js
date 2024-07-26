/*global variables*/
const myKey = config.MY_KEY;
const readAccessToken = config.API_READ_ACCESS_TOKEN;
const favoriteListButton = document.getElementById("favorites-button");
const titleOfPage = document.querySelector(".title");
const movieListContainer = document.querySelector(".movie-list");
const orderAsc = document.getElementById("order-asc");
const orderDes = document.getElementById("order-desc");
const favoriteMoviesArr = [];
let maxDisplayMovies = 40;
const movies = [];
const moviesMain = [];
let isFavoritesOn = false;

/*API Authentication options */
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + readAccessToken,
  },
};

/*requesting API Data*/

const makeAPICall = async (index) => {
  return await fetch(`https://api.themoviedb.org/3/movie/${index}`, options)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Movie was not in DataBase`);
      } else {
        return res.json();
      }
    })
    .catch((error) => console.log(error));
};

const getMovieList = async (maxMovies) => {
  console.log(
    "this is the total amount of movies that is going to display: " + maxMovies
  );
  for (i = 1; i < maxMovies; i++) {
    console.log("max movies inside the for loop: " + maxMovies);
    if (favoriteMoviesArr.find((movie) => movie.id == i)) {
      continue;
    } else {
      makeAPICall(i).then((movie) => {
        moviesMain.push(movie);
        generateCard(movie);
      });
    }
  }
};
const displayFavoritesHandler = () => {
  console.log(favoriteMoviesArr.length);
  if (favoriteMoviesArr.length === 0) {
    console.log("we are here");
    movieListContainer.innerHTML = `NO MOVIES ADDED YET, PLEASE CLICK THE HEART ICON ON
     MOVIE CARDS TO ADD TO THIS LIST `;
    movieListContainer.classList.add("empty");
    console.log("but nothing happened");
  } else {
    favoriteListButton.classList.add("favorites-ON");
    console.log("faves is ON ");
    titleOfPage.innerHTML = "Your Favorite Movies Are: ";
    movieListContainer.innerHTML = "";
    console.log("the length of the array is: " + favoriteMoviesArr.length);
    favoriteMoviesArr.map((movie) => {
      makeAPICall(movie.id).then((res) => generateCard(res));
    });
  }
};

favoriteListButton.addEventListener("click", () => {
  if (!isFavoritesOn) {
    displayFavoritesHandler(isFavoritesOn);
    isFavoritesOn = true;
  } else {
    favoriteListButton.classList.remove("favorites-ON");
    console.log("FAVES IS OFF");
    movieListContainer.classList.remove("empty");
    movieListContainer.innerHTML = "";
    getMovieList(30);
    titleOfPage.innerHTML = "Back To Normal Pages";
    isFavoritesOn = false;
  }
});

/**Generate Card Function Starts here:
 *  the function receives an object containing the movie information that we got from
 * @function getMovieList and we display that information on each created dynamically
 * created element
 *
 * We are only using 3 values from the data we received. this being:
 * @param movie.title to display the movie title
 * @param movie.overview to display the movie description
 * @param movie.poster_path to get the link to the cover image used in each card
 *
 */
const generateCard = (movie) => {
  if (!movie) {
    return "an easy way out but maybe change it for something else?";
  }
  //creating elements
  const heartIcon = document.createElement("i");
  const movieCard = document.createElement("div");
  const moviePoster = document.createElement("div");
  const movieImg = document.createElement("img");
  const movieDescription = document.createElement("div");
  const movieTitle = document.createElement("h2");
  const movieSummary = document.createElement("p");

  //adding necessary classes to elements created

  if (favoriteMoviesArr.find((favoriteMovie) => favoriteMovie.id == movie.id)) {
    heartIcon.classList.add("fa-solid");
    heartIcon.classList.add("fa-heart-crack");
  } else {
    heartIcon.classList.add("fa-solid");
    heartIcon.classList.add("fa-heart");
  }

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
  if (movie.overview.length === 0) {
    movieSummary.innerHTML = "NO DESCRIPTION FOUND";
  } else {
    movieSummary.innerHTML = movie.overview;
  }
  if (movie.poster_path === null) {
    movieCard.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg")`;
  } else {
    movieCard.style.backgroundImage = `url("https://image.tmdb.org/t/p/w500${movie.poster_path}")`;
  }
  heartIcon.addEventListener("click", (event) => {
    addToFavoritesHandler(event.target.parentElement);
  });
};
getMovieList(maxDisplayMovies);

/**this next function handles the add movies to the favorites pile it does the following

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
  console.log("NOTICE ME: " + movieListContainer.childNodes.length);
  maxDisplayMovies += 2;
  if (
    !favoriteMoviesArr.find(
      (movieInFavorites) => movieInFavorites.id == favoritedMovie.id
    )
  ) {
    favoriteMoviesArr.push(favoritedMovie);
    movieListContainer.innerHTML = "";
    console.log(favoriteMoviesArr);
    getMovieList(maxDisplayMovies);
  } else {
    console.log("we are deleting the movie");
    console.log(favoriteMoviesArr);
    console.log(
      favoriteMoviesArr.splice(
        favoriteMoviesArr.indexOf(
          favoriteMoviesArr.find((item) => item.id == favoritedMovie.id)
        ),
        1
      )
    );
    displayFavoritesHandler(isFavoritesOn);
    console.log(favoriteMoviesArr);
  }
};

//event listener

orderAsc.addEventListener("click", () => {});

orderDes.addEventListener("click", () => {
  movieListContainer.innerHTML = `we are ordering from Z to A`;
  movieListContainer.classList.add("empty");
});
