'use strict';

const superagent =require('superagent');
// const client = require ('../utilities.database');
// const errorHandler = require('./error');

// news route handler
function getNewsFromApi (request, response) {
    const url = 'http://newsapi.org/v2/top-headlines';
    superagent.get(url)
        .query({
            // sources: 'google-news',
            country: 'us',
            apiKey: process.env.NEWS_API,
        })
        .then (newsResponse => {
            let news  = newsResponse.body;
            let newsReturn = news.articles.map(article => {
                return new Article(article);
            })
            let viewModel = {
                article: newsReturn
            }
            response.render('index', viewModel);
        })
        .catch (err => {
            console.error(err);
            next(err);
        });
}

function Article (googleData) {
    this.image_url = googleData.urlToImage;
    this.url = googleData.url;
    this.title = googleData.title;
    this.author = googleData.author;
    this.source = googleData.source.name;
    this.description = googleData.description;
}

module.exports = getNewsFromApi;