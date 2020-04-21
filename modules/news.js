'use strict';

const superagent = require('superagent');
// const client = require ('../utilities.database');
// const errorHandler = require('./error');

// news route handler
function homePageRouteHandler(request, response) {
    const newsUrl = 'http://newsapi.org/v2/top-headlines';
    const catUrl = 'https://api.thecatapi.com/v1/images/search?mime_types=gif';

    Promise.all([
        superagent.get(newsUrl)             // First promise for index route handler
            .query({
                country: 'us',
                apiKey: process.env.NEWS_API,
            })
            .then(newsResponse => {
                let news = newsResponse.body;
                let newsReturn = news.articles.map(article => {
                    return new Article(article);
                })
                return newsReturn;
            }),
        superagent.get(catUrl)              // Second superagent promise for index route handler
            .set('Authorization', `x-api-key ${process.env.CATS_API}`)
            .then(catsResponse => {
                const catsData = catsResponse.body;
                const catGif = new Cat(catsData[0]);
                return catGif;
            })
    ])
        .then(([newsResults, catsResults]) => {
            let viewModel = {
                cat: catsResults,
                article: newsResults
            };
            console.log(viewModel);
            response.render('index', viewModel);
        })
        .catch(err => {
            console.error(err);
            next(err);
        });
}

// Constructor functions for both superagent queries

function Article(googleData) {
    this.image_url = googleData.urlToImage;
    this.url = googleData.url;
    this.title = googleData.title;
    this.author = googleData.author;
    this.source = googleData.source.name;
    this.description = googleData.description;
}

function Cat(catsData) {
    this.url = catsData.url;
}

module.exports = homePageRouteHandler;