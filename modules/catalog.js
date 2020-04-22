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
  const {title, author, source, url, image_url, description} = request.body;
  const SQL = `
    INSERT INTO articles
    (title, author, source, url, image_url, description)
    VALUES
    ($1, $2, $3, $4, $5, $6)
    RETURNING id
    `;
  const parameters = [title, author, source, url, image_url, description];
  return client.query(SQL, parameters)

    //////////////// what happens after this in this function is questionable //////////////
    .then( (result) => {
      console.log('Article Saved', result);
      response.redirect('/pages/index');
    })
    .catch(err => {
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


module.exports = {
  setArticlesToDB,
  // getArticlesFromDB
};

