require('dotenv').config;
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIES = require('./movies.json');

const app = express()

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    // move to next middleware
    next()
})

function handleGetMovies(req, res) {
    res.send('Oi!')
}

app.get('/movie', function handleGetMovies(req, res) {
    let response = MOVIES;

    // filters movies by genre
    if (req.query.genre) {
        response = response.filter(movies =>
            movies.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
    }

    // filter movies by country
    if (req.query.country) {
        response = response.filter(movies =>
            movies.country.includes(req.query.country)
        )
    }

    if (req.query.avg_vote) {
        response = response.filter (movies =>
            movies.avg_vote.includes(req.query.avg_vote)
        )
    }

    res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})


/*
1 - Users can search for Movies by genre, country or avg_vote
    a    The endpoint is GET /movie
    b    The search options for genre, country, and/or average vote are provided in query string parameters.
    c    When searching by genre, users are searching for whether the Movie's genre includes a specified string. The search should be case insensitive.
    d    When searching by country, users are searching for whether the Movie's country includes a specified string. The search should be case insensitive.
    e    When searching by average vote, users are searching for Movies with an avg_vote that is greater than or equal to the supplied number.
    f    The API responds with an array of full movie entries for the search results

2- The endpoint only responds when given a valid Authorization header with a Bearer API token value.

3 - The endpoint should have general security in place such as best practice headers and support for CORS.

*/