
const express = require('express'),
    morgan = require('morgan'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
const { rmSync } = require('fs');
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb+srv://test123:caloncho23@cluster0.ypcov8t.mongodb.net/myFlixDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application does not allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

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
app.post('/users',
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {
        //check validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username })
            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.Username + ' already exists');
                } else {
                    Users
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birthday: req.body.Birthday,
                        })
                        .then((user) => { res.status(201).json(user) })
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
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(404).send('User ' + req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
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
app.get('/movies/title/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/genre/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Genre })
        .then((movie) => {
            if (!movie) {
                return res.status(404).send('Error: no movies found with the ' + req.params.Genre + ' genre type. ');
            } else {
                res.status(200).json(movie.Genre);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//READ: Return info on director by name
app.get('/movies/directors/:Director', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Director })
        .then((movie) => {
            if (!movie) {
                return res.status(404).send('Error: no movies found with that director ' + req.params.Director + ' name');
            } else {
                res.status(200).json(movie.Director);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//READ: Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//READ: Return info on genre only
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Genre})
    .then((movie) => {
        if(!movie) {
            return res.status(404).send('Error: No genre found.');
        } else {
            res.status(200).json(movie.Genre);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//READ: Return info on director bio
app.get('/directors/:Bio',passport.authenticate('jwt', { session: false }),(req, res) => {
    Movies.findOne({'Director.Name': req.params.Director})
    .then((movie) => {
        if(!movie) {
            return res.status(404).send('Error: No director found.');
        } else {
            res.status(200).json(movie.Director);
        }
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
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});
