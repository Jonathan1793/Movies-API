# **Movies API**

---

## General Description

---

This project gets all the information from [TheMovieDB](https://developer.themoviedb.org/docs/getting-started) and requires API key to be able to work with this app. you can request one for free at their page.

### What does this app do?

---

it is an app that gives you a selection of movies for you to add into your favorites.
this is done by clicking the **_heart icon_** that comes into the screen when you hover over the **_movie card_** that you want to add into the favorites section.

after you click the icon, the page will load the movies again excluding the one that you already selected and it will add more movies at the end of the list so it won't run out of movies if you select more that 30.

### Buttons in NavBar

---

there are 4 buttons in the NAV bar:

1. Home Button(TMDB image): it will reload the page with 30 movies in an _unorganized_ way.

2. Favorites Button: will display your selected favorites movies. if there is none. it will display a message

3. Order Alphabetically: will change movie order on toggle from A-Z and Z-A. if you want to get movies disorganize again click home button

4. did you know?: it will let you know the amount of time required to see all the movies in your favorites list.

### Known Bugs and issues

---

when visualizing the app through another tool that allows you to see the page in multiple screens for example:

- tools in web browser for mobile responsiveness

it will have a strange behavior and will add movies to the favorite list that you did not select.

even though this will only happen in screens **_YOU ARE NOT WORKING ON_**

the screen you **_DO_** work on. will work just fine. this is just some strange behavior
