'use strict';

const errorHandler = require('./error');

const client = require('./db');

// putting stuff in SQL database
function setArticlesToDB(request, response) {
  let newArticle = request.body;

  const verifySQL = `
    SELECT * FROM articles
    WHERE title = $1
  `;
  const verifyExistence = [newArticle.title];

  client.query(verifySQL, verifyExistence)
    .then(verifiedResult => {
      if (verifiedResult.rowCount === 0) {
        const SQL = `
        INSERT INTO articles (title, author, source, url, image_url, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`;
        const parameters = [newArticle.title, newArticle.author, newArticle.source, newArticle.url, newArticle.image_url, newArticle.description];
        return client.query(SQL, parameters)
          .then(result => {
            console.log('Article saved', result);
            let id = result.rows[0].id;
            response.redirect('/');
          })
      } else {
        console.log('You already saved this!')
        let id = verifiedResult.rows[0].id;
        response.redirect('/');
      }
    })
    .catch(err => {
      errorHandler(err, request, response);
    });
}

function getArticlesFromDB(request, response) {
  const SQL = 'SELECT * FROM articles;';

  client.query(SQL)
    .then(results => {
      const { rowCount, rows } = results;
      console.log(rows);

      response.render('pages/catalog', {
        articles: rows
      });
    })
    .catch(err => {
      errorHandler(err);
    });
}


module.exports = {
  setArticlesToDB,
  getArticlesFromDB
};

