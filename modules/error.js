'use strict'

function errorHandler(err, request, response, next) {
  console.error(err.message);
  if(!err.statusCode) err.statusCode = 500;

  if(err.shouldRedirect) {
    let badCat = `https://http.cat/${err.statusCode}.jpg`
    response.render('pages/error', {badCat})
  } else {
    response.status(err.statusCode).send(err.message);
  }
};

module.exports = errorHandler;