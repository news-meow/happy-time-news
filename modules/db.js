'use strict';

const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {
  console.log(err);
});


if (!process.env.DATABASE_URL) {
  throw 'DATABASE_URL is missing!';
}

module.exports = client;
