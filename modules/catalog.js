'use strict';

const errorHandler = require('./modules/error');


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
}


// getting stuff from SQL database
function getArticlesFromDB(request, response) {
    const data = 'SELECT * FROM articles;';
  
    client.query(data)
      .then(results => {
        const { rowCount, rows } = results;
        console.log(rows);
  
        response.render('index', {
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
  }