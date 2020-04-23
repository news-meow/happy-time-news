'use strict';

// Dependencies
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const cors = require('cors');

// App setup
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cors());
const PORT = process.env.PORT || 3000;

// Modules required
const homePageRouteHandler = require('./modules/news');
const errorHandler = require('./modules/error');
const client = require('./modules/db');
const catalogModule = require('./modules/catalog');
const { setArticlesToDB, getArticlesFromDB } = catalogModule;
const deleteArticlesFromDB = require('./modules/delete')

// Routes
app.get('/', homePageRouteHandler);
app.get('/catalog', getArticlesFromDB);
app.get('/about', (request, response) => {
  response.render('pages/about');
});

app.post('/save', setArticlesToDB);
app.delete('/articles/:id', deleteArticlesFromDB);

app.get('*', function(request, response, next) {
  let err = new Error(`${request.ip} tried to reach ${request.originalUrl}`);
  err.statusCode = 404;
  err.shouldRedirect = true;
  next(err);
});

app.use(errorHandler);

client.connect()
  .then(() => {
    console.log('PG Connected!');
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });
