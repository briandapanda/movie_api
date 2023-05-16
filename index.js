
const express = require('express'),
    morgan = require('morgan'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
const { rmSync } = require('fs');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/movieDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express(); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Log URL request data to log.txt text file
const accessLogStream = require('fs').createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

//Middleware
app.use(express.static('public'));


// Default endpoint route
app.get('/', (req, res) => {
    res.send('Keanu says hello!')
});

// CREATE: new user with updated mongoose 
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users.create({
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                })
                    .then((user) => {
                        res.status(201).json(user);
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    });
            
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//UPDATE: User information
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
            $set: {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday,
            },
        },
        { new: true }
    )
        .then((user) => {
            if (!user) {
                return res.status(404).send('Error: No user was found')
            } else {
                res.json(user);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//POST:  favorite movie
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
            $addToSet: { FavoriteMovies: req.params.MovieID },
        },
        { new: true }
    )
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).send('Error: User not found');
            } else {
                res.json(updatedUser);
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//DELETE: favorite movie from list 
app.delete('/users/:Username/movies/:movieTitle', (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
            $pull: { FavoriteMovies: req.params.MovieID },
        },
        { new: true }
    )
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).send('Error: User not found');
            } else {
                res.json(updatedUser);
            }
        });
});

//DELETE:  Delete user by username
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(404).send('User ' + req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + 'was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//READ: GET all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//READ: GET info on single movie by title
app.get('/movies/title/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            if (!movie) {
                return res.status(404).send('Error: ' + req.params.Title + ' was not found');
            }
            res.status(200).json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//READ: Return genre info by movie title 
app.get('/movies/genre/:Genre', (req, res) => {
    Movies.find({ 'Genre.Name': req.params.Genre })
        .then((movies) => {
            if (movies.length == 0) {
                return res.status(404).send('Error: no movies found with the ' + req.params.Genre + ' genre type. ');
            } else {
                res.status(200).json(movies);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//READ: Return info on director by name
app.get('/movies/directors/:Director', (req, res) => {
    Movies.find({ 'Director.Name': req.params.Director })
        .then((movies) => {
            if (movies.length == 0) {
                return res.status(404).send('Error: no movies found with that director ' + req.params.Director + ' name');
            } else {
                res.status(200).json(movies);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//READ: Get all users
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        }); 
});




//error-handling middleware
app.use((err, req, res, next) => {
    console.log(err);
    console.error(err.stack);   
}); 

//Start server
app.listen(3000, (req, res) => {
    console.log('App listening on port 3000');
});

