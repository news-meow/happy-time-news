'use strict';

// Dependencies

require('dotenv').config();

const express = require('express');
// const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const getNewsFromApi = require('./modules/news');
// const { getNewsFromApi } = newsModule;


// Connected to SQL database

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => { throw err; });

if (!process.env.DATABASE_URL) {
  throw 'DATABASE_URL is missing!';
}



app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cors());

client.connect()
  .then(() => {
    console.log('PG Connected!');
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
  })
  .catch(err => { 
    throw err;
  });


// Routes
app.get('/', getNewsFromApi);

// Testing getting stuff from SQL database

function getData(request, response) {
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
      console.log(err);
    });
}








// renders response of getNewsFromApi
app.post('/', getNewsFromApi);
