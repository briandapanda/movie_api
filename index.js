const express = require('express'),
    morgan = require('morgan'),
    path = require('path'),
    bodyParser = require('body-parser');

const app = express(); 

const accessLogStream = require('fs').createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

//Middleware
app.use(express.static('public'));
app.use(bodyParser.json());

//movie names
const topMovies = [
    { title: 'The Matrix', director: 'The Wachowski\'s', year: 1999 },
    { title: 'Point Break', director: 'Kathryn Bigelow', year: 1991 },
    { title: 'Speed', director: 'Jan de Bont', year: 1994 },
    { title: 'The Lake House', director: 'Alejandro Agresti', year: 2006 },
    { title: 'John Wick', director: 'Chad Stahelski', year: 2014 },
    { title: 'John Wick: Chapter 4', director: 'Chad Stahelski', year: 2023 },
    { title: 'John Wick: Chapter 3 - Parabellum', director: 'Chad Stahelski', year: 2019 },
    { title: 'Constantine', director: 'Francis Lawrence', year: 2005 },
    { title: 'The Replacements', director: 'Howard Deutch', year: 2000 },
    { title: 'The Matrix Reloaded', director: 'The Wachowski\'s', year: 2003 },
]; 

//Define GET Route for /movies
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Keanu says hello!')
}); 

//Serve documentation.html from the public folder
app.use(express.static(path.join(__dirname, 'public')));

//error-handling middleware
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.status(400).send('Bad Request: Invalid JSON format');
    } else {
        console.error(err.stack);
        res.status(500).send('Whoops, something went wrong!');
    }
    
}); 

//Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});

