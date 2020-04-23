'use strict';

const superagent = require('superagent');
const errorHandler = require('./error');

//Regex covid filter
const regex = /(covid( )?(-)?(19)?|corona( )?(virus)?|pandemic|CDC|face( )?(mask)?|quarantin(e|ing))/gi;

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
      let news = newsResponse.body;
      let articles = news.articles.map(article => new Article(article));
      return Promise.all(articles.map(eachArticle =>
        eachArticle.isCovid ?
          superagent.get(catUrl)
            .set('Authorization', `x-api-key ${process.env.CATS_API}`)
            .then(catsResponse => {
              const catsData = catsResponse.body;
              const catGif = new Cat(catsData[0]);
              return catGif;
            }) : Promise.resolve(null)
      ))
        .then(catResults => {
          console.log(catResults);
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



// Refactoring for cleaner, drier code
// function kittyCatApi(request, response) {
//   const catUrl = 'https://api.thecatapi.com/v1/images/search?mime_types=gif';
// }



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