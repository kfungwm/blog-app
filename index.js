const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      pug = require('pug'),
      Sequelize = require('sequelize');

var app = express(),
    sequelize = new Sequelize('blogPost', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });

var db = require('./models');

app.use(express.static('public'));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug');

// var Blogger = sequelize.define('blogPost', {
//   title: Sequelize.STRING,
//   slug: Sequelize.STRING,
//   content: Sequelize.TEXT
// });


app.get('/', (request, response) => {
  db.Blogger.findAll({ order:'id ASC'}).then((blogPost) => {
    response.render('blogpost/index', { blogPosts: blogPosts });
  });
});

app.get('/blogpost/new', (request, response) => {
  response.render('blogpost/new');
});



app.post('/blogpost', (request, response) => {
  console.log('post request komt binnen');
  if (request.body.title) {
    db.Blogger.create(request.body).then(() => {
      response.redirect('/');
    });
  } else {
    response.redirect('/blogpost/new');
  }
});





db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
  });
});
