'use strict';

const superagent = require('superagent');
const errorHandler = require('./error');
const client = require('./db');

//Regex covid filter
const regex = /(covid( )?(-)?(19)?|corona( )?(virus)?|pandemic|CDC|face( )?(mask)?|quarantin(e|ing)|(un)?employment|economy)/i;

// news route handler
function homePageRouteHandler(request, response) {
  const newsUrl = 'http://newsapi.org/v2/top-headlines';
  const catUrl = 'https://api.thecatapi.com/v1/images/search?mime_types=gif';

  superagent.get(newsUrl)
    .query({
      country: 'us',
      apiKey: process.env.NEWS_API,
    })
    .then(newsResponse => {
      let news = newsResponse.body;   // Get response from news API
      let articles = news.articles.map(article => new Article(article));
      return articles;
    })
    .then(articles => {
      const SQL = `SELECT url, id FROM articles`;
      return client.query(SQL)
        .then(results => {
          const saved = new Map(results.rows.map(row => [row.url, row.id]));
          articles.forEach(article => {
            article.isSaved = saved.has(article.url);
            article.id = saved.get(article.url);
          })
          return articles;
        })
    })

    .then(articles => {
      return Promise.all(articles.map(eachArticle =>  // Filtering through all articles
        eachArticle.isCovid ?
          superagent.get(catUrl)  // Call cat API if regex test is true
            .set('Authorization', `x-api-key ${process.env.CATS_API}`)
            .then(catsResponse => {
              const catsData = catsResponse.body;
              const catGif = new Cat(catsData[0]);
              return catGif;
            }) : Promise.resolve(null)  // Return article if regex test is false
      ))
        .then(catResults => {  // Setting covid articles as catGif before sending viewModel to EJS
          articles.forEach((article, index) => {
            article.catGif = catResults[index];
          });
          response.render('index', { articles });
        })
    })
    .catch(err => {
      errorHandler(err, request, response);
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
  this.isCovid = regex.test(googleData.title + ' ' + googleData.description);
}

function Cat(catsData) {
  this.url = catsData.url;
}

module.exports = homePageRouteHandler;