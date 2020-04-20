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


if (!process.env.DATABASE_URL) {
  throw 'DATABASE_URL is missing!';
}

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => { throw err; });


app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cors());

client.connect()
  .then(() => {
    console.log('PG Connected!');
    app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
  })
  .catch(err => { throw err; });

// Routes
app.get('/', (request, response) => {
  response.render('index');
});
