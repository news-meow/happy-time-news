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
const errorHandler = require('./modules/error');
// const { getNewsFromApi } = newsModule;


// Connected to SQL database

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {
  errorHandler(err);
});

if (!process.env.DATABASE_URL) {
  throw 'DATABASE_URL is missing!';
}



app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cors());

// Routes
app.get('/', getNewsFromApi);
app.get('/about', (request, response) => {
  response.render('pages/about');
});
app.get('/catalog', (request, response) => {
  response.render('pages/catalog');
})

client.connect()
  .then(() => {
    console.log('PG Connected!');
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
  })
  .catch(err => { 
    errorHandler(err);
  });


app.get('*', function(request, response, next) {
  let err = new Error(`${request.ip} tried to reach ${request.originalUrl}`);
  err.statusCode = 404;
  err.shouldRedirect = true;
  next(err);
});

app.use(errorHandler);