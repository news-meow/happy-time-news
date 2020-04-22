'use strict';

const errorHandler = require('./error');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {
  errorHandler(err);
});

if (!process.env.DATABASE_URL) {
  throw 'DATABASE_URL is missing!';
}

// putting stuff in SQL database
function setArticlesToDB(request, response) {
  console.log(client);
  const newArticle = request.body;
  console.log(newArticle);
  const SQL = `INSERT INTO articles (title, author, source, url, image_url, description) VALUES ($1, $2, $3, $4, $5, $6)`;
  const parameters = [newArticle.title, newArticle.author, newArticle.source, newArticle.url, newArticle.image_url, newArticle.description];
  console.log(parameters);
  client.query(SQL, parameters)
    .then(result => {
      console.log('Article saved', result);
    })

    .catch(err => {
      console.log(err);
      errorHandler(err);
    });
}


// getting stuff from SQL database
// function getArticlesFromDB(request, response) {
//   const SQL = 'SELECT * FROM articles;';

//   client.query(SQL)
//     .then(results => {
//       const { rowCount, rows } = results;
//       console.log(rows);

//       response.render('pages/catalog', {
//         articles: rows
//       });
//     })
//     .catch(err => {
//       errorHandler(err);
//     });
// }


module.exports = setArticlesToDB;
  // getArticlesFromDB
;

