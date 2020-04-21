'use strict'

const superagent =require('superagent');
// const client = require ('../utilities.database');
// const errorHandler = require('./error');

// cats route handler
function getCatsFromApi (request, response) {
    const url = 'https://api.thecatapi.com/v1/images/search?mime_types=gif';
    return superagent.get(url)
        .set('Authorization', `x-api-key ${process.env.CATS_API}`)
        .then (catsResponse => {
            const catsData = catsResponse.body;
            const catGif = () => new Cat(catsData)
            response.render('index', { cat: catGif});
        })
        .catch (err => {
            console.error(err);
            next(err);
        });
}

function Cat(catsData) {
    this.url = catsData.url;
}

module.exports = getCatsFromApi;