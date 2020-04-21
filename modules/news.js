'use strict';

const superagent =require('superagent');
// const client = require ('../utilities.database');
// const errorHandler = require('./error');

// news route handler
function getNewsFromApi (request, response) {
    const url = 'http://newsapi.org/v2/top-headlines';
    superagent.checkout(url)
        .query({
            sources: 'google-news',
            apiKey: process.NEWS_API,
        })
        .then (newsResponse => {
            let news  = newsResponse.body;
            console.log(news);
        })
        .catch (err => {
            console.error(err);
            next(err);
        });
}

module.exports = {
    getNewsFromApi
};