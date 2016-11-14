const express = require('express'),
      morgan = require('morgan'),
      pug = require('pug'),
      bodyParser = require('body-parser'),
      Sequelize = require('sequelize');

var app = express();

app.use(express.static('public'));

app.use(morgan('dev'));

app.set('view engine', 'pug');

app.get('/', (request, response) => {
  response.render('blogpost/index');
});







app.listen(3000, () => {
  console.log('Web Server is running on port 3000');
});


// sequelize.sync().then(() => {
//   app.listen(3000, () => {
//     console.log('Web Server is running on port 3000');
//   });
// });
