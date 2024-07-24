/*global variables*/
const myKey = config.MY_KEY;
const readAccessToken = config.API_READ_ACCESS_TOKEN;
const movieListContainer = document.querySelector(".movie-list");
const favoriteMoviesArr = [];
let maxDisplayMovies = 40;
const movies = [];
const moviesPromises = [];

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
      makeAPICall(i).then((movie) => generateCard(movie));
    }
  }

  // await Promise.allSettled(moviesPromises)
  //   .then((allMovies) =>
  //     allMovies.map((movie) =>
  //       movie.value
  //         .json()
  //         .then((movie) => {
  //           if (movie.success === false) {
  //             console.log("movie not found");
  //           } else if (
  //             favoriteMoviesArr
  //               .map((moviefaved) => moviefaved.id)
  //               .includes(movie.id)
  //           ) {
  //             movies.push(movie);
  //           }
  //         })
  //         .catch((err) => console.log(err))
  //     )
  //   )
  //   .catch((err) => console.log(err));

  // await movies.map((movie) => console.log(movie));
};

// const getMovieList = async () => {
//   for (i = 1; i < maxDisplayMovies; i++) {
//     return (moviesPromises = fetch(
//       `https://api.themoviedb.org/3/movie/${i}`,
//       options
//     )
//       .then((res) => res.json())
//       .then((res) =>
//         res.id !== undefined && res.poster_path !== null
//           ? res //movies.push(res)
//           : maxDisplayMovies++
//       )
//       .catch((err) => console.error(err)));
//   }
//   console.log("API call");
//   console.log(moviesPromises);
//   movies.map((movie) => generateCard(movie));
// };

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
  console.log("NOTICE ME: " + movieListContainer.childNodes.length);
  maxDisplayMovies += 2;
  console.log(maxDisplayMovies);
  if (!favoriteMoviesArr.includes(favoritedMovie)) {
    favoriteMoviesArr.push(favoritedMovie);
    movieListContainer.innerHTML = "";
    console.log(favoriteMoviesArr);
    getMovieList(maxDisplayMovies);
  }

  // } else if (
  //   favoriteMoviesArr.map((movie) => movie.id).includes(favoritedMovie.id)
  // ) {
  //   alert(
  //     `the movie ${favoritedMovie.children[2].children[0].innerHTML} is already in favorites`
  //   );
};
