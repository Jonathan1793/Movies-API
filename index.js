/*global variables*/
const myKey = config.MY_KEY;
const readAccessToken = config.API_READ_ACCESS_TOKEN;
const favoriteListButton = document.getElementById("favorites-button");
const didYouKnowButton = document.getElementById("did-you-know");
const fromAtoZbutton = document.getElementById("order-asc");
const titleOfPage = document.querySelector(".title");
const movieListContainer = document.querySelector(".movie-list");
const homeButton = document.getElementById("home-button");
const hamburgerBtn = document.getElementById("hamburger");
const navMenu = document.getElementById("options");
const hamburgerBar1 = document.getElementById("bar1");
const hamburgerBar2 = document.getElementById("bar2");
const hamburgerBar3 = document.getElementById("bar3");
const favoriteMoviesArr = [];
let maxDisplayMovies = 40;
const movies = [];
const moviesMain = [];
let isFavoritesOn = false;
let isAtoZOn = false;
let isZtoAOn = false;

/*API Authentication options */
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + readAccessToken,
  },
};

/*requesting API Data*/

const makeAPICall = (index) => {
  return fetch(`https://api.themoviedb.org/3/movie/${index}`, options)
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
  const promisesOfMovies = [];
  favoriteListButton.classList.add("no-touch");
  for (i = 1; i < maxMovies; i++) {
    if (favoriteMoviesArr.find((movie) => movie == i)) {
      continue;
    } else {
      promisesOfMovies.push(makeAPICall(i));
    }
  }
  await Promise.allSettled(promisesOfMovies).then((promise) =>
    promise.map((promise) => {
      if (promise.value === undefined) {
        console.log("NO MOVIE");
      } else {
        generateCard(promise.value);
      }
    })
  );
  favoriteListButton.classList.remove("no-touch");
};

const displayFavoritesHandler = () => {
  if (favoriteMoviesArr.length === 0) {
    movieListContainer.innerHTML = `NO MOVIES ADDED YET, PLEASE CLICK THE HEART ICON ON
     MOVIE CARDS TO ADD TO THIS LIST `;
    movieListContainer.classList.add("empty");
  } else {
    favoriteListButton.classList.add("favorites-ON");

    titleOfPage.innerHTML = "";
    titleDesc = document.createElement("h2");
    titleDesc.innerHTML = "Your Favorite Movies Are: ";
    titleOfPage.appendChild(titleDesc);
    movieListContainer.innerHTML = "";
    favoriteMoviesArr.map((movie) => {
      makeAPICall(movie).then((res) => generateCard(res));
    });
  }
};

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

  if (favoriteMoviesArr.find((favoriteMovie) => favoriteMovie == movie.id)) {
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
  heartIcon.addEventListener("click", () => {
    manageFavoritesHandler(movie.id);
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

const manageFavoritesHandler = (id) => {
  maxDisplayMovies += 2;
  if (!favoriteMoviesArr.includes(id)) {
    favoriteMoviesArr.push(id);
    movieListContainer.innerHTML = "";
    getMovieList(maxDisplayMovies);
  } else {
    favoriteMoviesArr.splice(
      favoriteMoviesArr.indexOf(favoriteMoviesArr.find((item) => item == id)),
      1
    );
    displayFavoritesHandler(isFavoritesOn);
  }
};
const orderingAlphabetically = (allMovies) => {
  const allMoviesElements = allMovies.children;
  const allMoviesArr = Array.from(allMoviesElements);
  //a is for the movie1, b is for movie2
  if (isAtoZOn) {
    allMoviesArr.sort((a, b) =>
      a.children[2].children[0].innerHTML.localeCompare(
        b.children[2].children[0].innerHTML
      )
    );
  } else {
    allMoviesArr.sort((a, b) =>
      b.children[2].children[0].innerHTML.localeCompare(
        a.children[2].children[0].innerHTML
      )
    );
  }
  movieListContainer.innerHTML = "";
  allMoviesArr.map((element) => movieListContainer.appendChild(element));
};

const calculateTimeToWatch = () => {
  const totalWatchTimePromises = favoriteMoviesArr.map((movie) => {
    return makeAPICall(movie).then((information) => {
      return information.runtime;
    });
  });

  Promise.all(totalWatchTimePromises).then((runtimes) => {
    const totalWatchTime = runtimes.reduce(
      (totalSum, currentValue) => totalSum + currentValue,
      0
    );
    displayDidYouKnowInfo(totalWatchTime);
  });
};

const displayDidYouKnowInfo = (watchtime) => {
  const hours = Math.floor(watchtime / 60);
  const minutes = watchtime % 60;

  let sentence = ` ${hours} ${hours === 1 ? "hour" : "hours"} `;
  if (minutes > 0) {
    sentence =
      sentence + `and ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }
  isFavoritesOn = false;
  didYouKnowButton.classList.add("favorites-ON");
  movieListContainer.innerHTML = "";
  movieListContainer.classList.add("watch-time");
  const labelForTime = document.createElement("h2");
  const movieDuration = document.createElement("p");
  movieDuration.innerHTML = sentence;
  labelForTime.innerHTML = `The total amount of time required to watch all of your favorite movies is:  `;
  movieListContainer.appendChild(labelForTime);
  movieListContainer.appendChild(movieDuration);
};
//event listeners

favoriteListButton.addEventListener("click", () => {
  if (!isFavoritesOn) {
    resetClasses();
    displayFavoritesHandler(isFavoritesOn);
    isFavoritesOn = true;
  } else {
    resetClasses();
    movieListContainer.innerHTML = "";
    titleOfPage.innerHTML = "";
    titleDesc = document.createElement("h2");
    titleDesc.innerHTML = "Choose Your Favorites Movies: (click heart) ";
    titleOfPage.appendChild(titleDesc);
    fromAtoZbutton.classList.remove("favorites-ON");
    getMovieList(30);
    isFavoritesOn = false;
  }
});

fromAtoZbutton.addEventListener("click", () => {
  resetClasses();
  if (isAtoZOn) {
    isAtoZOn = false;
  } else {
    isAtoZOn = true;
  }
  fromAtoZbutton.classList.add("favorites-ON");
  orderingAlphabetically(movieListContainer);
});

const resetClasses = () => {
  movieListContainer.classList.remove("empty");
  movieListContainer.classList.remove("watch-time");
  fromAtoZbutton.classList.remove("favorites-ON");
  favoriteListButton.classList.remove("favorites-ON");
  didYouKnowButton.classList.remove("favorites-ON");
  fromAtoZbutton.classList.remove("no-touch");
};

homeButton.addEventListener("click", () => {
  isFavoritesOn = false;
  isAtoZOn = false;
  resetClasses();
  titleOfPage.innerHTML = "";
  titleDesc = document.createElement("h2");
  titleDesc.innerHTML = "Choose Your Favorite Movies: (click heart)  ";
  titleOfPage.appendChild(titleDesc);
  movieListContainer.innerHTML = "";
  getMovieList(30);
});

hamburgerBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  if (navMenu.classList.contains("active")) {
    hamburgerBar1.classList.add("remove-line");
    hamburgerBar2.classList.add("bar-rotate-left");
    hamburgerBar3.classList.add("bar-rotate-right");
  } else {
    hamburgerBar1.classList.remove("remove-line");
    hamburgerBar2.classList.remove("bar-rotate-left");
    hamburgerBar3.classList.remove("bar-rotate-right");
  }
});

didYouKnowButton.addEventListener("click", () => {
  resetClasses();
  fromAtoZbutton.classList.add("no-touch");
  calculateTimeToWatch();
});
