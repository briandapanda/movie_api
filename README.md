# Movie API 
Web application for movie flicks

## Objective 
To build the server-side component of a “movies” web application. The web application will provide users with access to information about different movies, directors, and genres. Users will be able to sign up, update their personal information, and create a list of their favorite movies.

## Requirements of Project

<B> REST API Must: </B> 

- Return a list of ALL movies to the user;
- Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user;
- Return data about a genre (description) by name/title (e.g., “Thriller”);
- Return data about a director (bio, birth year, death year) by name;
- Allow new users to register;
- Allow users to update their user info (username);
- Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later);
- Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later);
- Allow existing users to deregister (showing only a text that a user email has been removed—more on this later).
- The API must be a Node.js and Express application.
- The API must use REST architecture, with URL endpoints corresponding to the data
operations listed above
