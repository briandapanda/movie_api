const express = require('express'),
    morgan = require('morgan'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express(); 

const accessLogStream = require('fs').createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

//Middleware
app.use(express.static('public'));
app.use(bodyParser.json());

//users
let users = [
    {
        id: 1,
        name: "Kim",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Joe",
        favoriteMovies: ["Speed"]
    }
];

//movie array
let movies = [
    {
        "Title": "The Matrix",
        "Description": "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        "Year": 1999,
        "Genre": {
            "Name": ["Sci-Fi", "Action"],
            "Description": "Movies in the action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. The sci-fi genre builds worlds and alternate realities filled with imagined elements that don’t exist in the real world."
        },
        "Director": {
            "Name": "The Wachowski\'s",
            "Bio": "Lana Wachowski (born June 21, 1965) and Lilly Wachowski (born December 29, 1967) are American film and television directors, writers and producers. Together known as the Wachowskis, the sisters have worked as a writing and directing team through most of their careers. They made their directing debut in 1996 with Bound and achieved fame with their second film, The Matrix (1999), a major box office success for which they won the Saturn Award for Best Director. They wrote and directed its two sequels, The Matrix Reloaded and The Matrix Revolutions (both in 2003), and were involved in the writing and production of other works in the Matrix franchise.",
            "Birth": ["1965","1967"]
        },
    },
    {
        "Title": "Point Break",
        "Description": "An F.B.I. Agent goes undercover to catch a gang of surfers who may be bank robbers.",
        "Year": 1991,
        "Genre": {
            "Name": ["Action", "Crime", "Thriller",],
            "Description": "Movies in the action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. Thrillers expertly blend mystery, tension, and anticipation into one exciting story. The crime genre is largely classified by a story that is centered around the solving of a crime.",
        },
        "Director": {
            "Name": "Kathryn Bigelow",
            "Bio": "Kathryn Ann Bigelow (born November 27, 1951) is an American filmmaker. Covering a wide range of genres, her films include Near Dark (1987), Point Break (1991), Strange Days (1995), K-19: The Widowmaker (2002), The Hurt Locker (2008), Zero Dark Thirty (2012), and Detroit (2017).",
            "Birth": 1951
        },
    },
    {
        "Title": "Speed",
        "Description": "A young police officer must prevent a bomb exploding aboard a city bus by keeping its speed above 50 mph.",
        "Year": 1994,
        "Genre": {
            "Name": ["Action", "Adventure", "Thriller"],
            "Description": "Movies in the action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. ilms in the adventure genre usually contain the same basic genre elements as an action movie, with the setting as the critical difference. Adventure movies are typically set in an exotic, far away, or unfamiliar locale. Thrillers expertly blend mystery, tension, and anticipation into one exciting story.",
        },
        "Director": {
            "Name": "Jan de Bont",
            "Bio": "Jan de Bont (born 22 October 1943) is a Dutch retired cinematographer, director and film producer. He is best known for directing the films Speed (1994) and Twister (1996). As a director of photography, de Bont also worked on numerous blockbusters and genre films, including Roar, Cujo, Flesh and Blood, Die Hard, The Hunt for Red October, and Basic Instinct.",
            "Birth": 1943
        },
    },
    {
        "Title": "The Lake House",
        "Description": "A lonely doctor who once occupied an unusual lakeside house begins to exchange love letters with its former resident, a frustrated architect. They must try to unravel the mystery behind their extraordinary romance before it's too late.",
        "Year": 2006,
        "Genre": {
            "Name": ["Drama", "Fantasy", "Romance"],
            "Description": "The drama genre features stories with high stakes and many conflicts. They\’re plot-driven and demand that every character and scene move the story forward. Films in the fantasy genre feature magical and supernatural elements that do not exist in the real world. Romance films are love stories. They center around two protagonists exploring some of the elements of love like relationships, sacrifice, marriage, obsession, or destruction.",
        },
        "Director": {
            "Name": "Alejandro Agresti",
            "Bio": "Alejandro Agresti was born on June 2, 1961 in Buenos Aires, Argentina. He is a director and writer, known for Buenos Aires Vice Verse (1996), Wind with the Gone (1998) and A Less Bad World (2004).",
            "Birth": 1961
        },
    },
    {
        "Title": "John Wick",
        "Description": "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took his car.",
        "Year": 2014,
        "Genre": {
            "Name": ["Action", "Crime", "Thriller"],
            "Description": "Movies in the action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. Thrillers expertly blend mystery, tension, and anticipation into one exciting story. The crime genre is largely classified by a story that is centered around the solving of a crime.",
        },
        "Director": {
            "Name": "Chad Stahelski",
            "Bio": "Chad Stahelski (born September 20, 1968) is an American stuntman and film director. He directed the 2014 film John Wick and its three sequels.[1] He has worked as a stuntman, stunt coordinator and second unit director on several films.",
            "Birth": 1968
        },
    },
    {
        "Title": "John Wick: Chapter 4",
        "Description": "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
        "Year": 2023,
        "Genre": {
            "Name": ["Action", "Crime", "Thriller"],
            "Description": "Movies in the action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. Thrillers expertly blend mystery, tension, and anticipation into one exciting story. The crime genre is largely classified by a story that is centered around the solving of a crime.",
        },
        "Director": {
            "Name": "Chad Stahelski",
            "Bio": "Chad Stahelski (born September 20, 1968) is an American stuntman and film director. He directed the 2014 film John Wick and its three sequels.[1] He has worked as a stuntman, stunt coordinator and second unit director on several films.",
            "Birth": 1968
        },
    },
    {
        "Title": "John Wick: Chapter 3 - Parabellum",
        "Description": "John Wick is on the run after killing a member of the international assassins' guild, and with a $14 million price tag on his head, he is the target of hit men and women everywhere.",
        "Year": 2019,
        "Genre": {
            "Name": ["Action", "Crime", "Thriller"],
            "Description": "Movies in the action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. Thrillers expertly blend mystery, tension, and anticipation into one exciting story. The crime genre is largely classified by a story that is centered around the solving of a crime.",
        },
        "Director": {
            "Name": "Chad Stahelski",
            "Bio": "Chad Stahelski (born September 20, 1968) is an American stuntman and film director. He directed the 2014 film John Wick and its three sequels.[1] He has worked as a stuntman, stunt coordinator and second unit director on several films.",
            "Birth": 1968
        },
    },
    {
        "Title": "Constantine",
        "Description": "Supernatural exorcist and demonologist John Constantine helps a policewoman prove her sister\'s death was not a suicide, but something more.",
        "Year": 2005,
        "Genre": {
            "Name": ["Action", "Fantasy", "Horror"],
            "Description": "Movies in the action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. Films in the fantasy genre feature magical and supernatural elements that do not exist in the real world. Horror films feature elements that leave people with an overwhelming sense of fear and dread. Horror movies often include serial killers or monsters as persistent, evil antagonists to play on viewers\’ fears or nightmares.",
        },
        "Director": {
            "Name": "Francis Lawrence",
            "Bio": "Francis Lawrence (born March 26, 1971) is an Austrian-born American filmmaker and producer. After establishing himself as a director of music videos and commercials, Lawrence made his feature-length directorial debut with the superhero thriller Constantine (2005) and has since directed the post-apocalyptic horror film I Am Legend (2007), the romantic drama Water for Elephants (2011), three of the four films in the Hunger Games film series, and the spy thriller Red Sparrow (2018).",
            "Birth": 1971
        },
    },
    {
        "Title": "The Replacements",
        "Description": "During a pro football strike, the owners hire substitute players.",
        "Year": 2000,
        "Genre": {
            "Name": "Sport",
            "Description": "Movies in the sports genre will center around a team, individual player, or fan, with the sport itself to motivate the plot and keep the story advancing. Comedy films are funny and entertaining. The films in this genre center around a comedic premise—usually putting someone in a challenging, amusing, or humorous situation they\’re not prepared to handle. ",
        },
        "Director": {
            "Name": "Howard Deutch",
            "Bio": "Howard Deutch (born September 14, 1950) is an American film and television director who worked in collaboration with filmmaker John Hughes, directing two of Hughes\'s best-known screenplays, Pretty in Pink and Some Kind of Wonderful. Since 2011, he has primarily directed television productions, including multiple episodes of Getting On and True Blood.",
            "Birth": 1950
        },
    },
    {
        "Title": "The Matrix Reloaded",
        "Description": "Freedom fighters Neo, Trinity and Morpheus continue to lead the revolt against the Machine Army, unleashing their arsenal of extraordinary skills and weaponry against the systematic forces of repression and exploitation.",
        "Year": 2003,
        "Genre": {
            "Name": ["Sci-Fi", "Action"],
            "Description": "Movies in the action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. The sci-fi genre builds worlds and alternate realities filled with imagined elements that don’t exist in the real world."
        },
        "Director": {
            "Name": "The Wachowski\'s",
            "Bio": "Lana Wachowski (born June 21, 1965) and Lilly Wachowski (born December 29, 1967) are American film and television directors, writers and producers. Together known as the Wachowskis, the sisters have worked as a writing and directing team through most of their careers. They made their directing debut in 1996 with Bound and achieved fame with their second film, The Matrix (1999), a major box office success for which they won the Saturn Award for Best Director. They wrote and directed its two sequels, The Matrix Reloaded and The Matrix Revolutions (both in 2003), and were involved in the writing and production of other works in the Matrix franchise.",
            "Birth": ["1965", "1967"]
        },
    },
];

// CREATE: new user
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
});

//UPDATE: User information
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }
});

//POST:  favorite movie
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);;
    } else {
        res.status(400).send('no such user')
    }
});

//DELETE:  favorite movie
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    
    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);;
    } else {
        res.status(400).send('no such user')
    }
});

//DELETE:  deregister
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    
    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id !== id);
        res.status(200).send(`User ${id} has been deleted.`);
    } else {
        res.status(400).send('No such user.')
    }
});

//READ: GET all movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

//READ: GET info on single movie
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
});

//READ: Return genre info by movie title 
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const Genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if (Genre) {
        res.status(200).json(Genre);
    } else {
        res.status(400).send('No such genre.')
    }
});

//READ: Return info on director by name
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('No such director.')
    }
});

//READ: Get all users
app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/', (req, res) => {
    res.send('Keanu says hello!')
});


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

