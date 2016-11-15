const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      pug = require('pug'),
      Sequelize = require('sequelize');

var app = express(),
    sequelize = new Sequelize('blogPost', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });

var db = require('./models');


// console.log(db);

app.use(express.static('public'));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug');

app.get('/', (request, response) => {
  db.BlogPost.findAll({ order: 'id ASC' }).then((blogPosts) => {
    response.render('blogpost/index', { blogPosts: blogPosts });
  });
});

app.get('/blogpost/new', (request, response) => {
  response.render('blogpost/new');
});

app.get('/:id', (request, response) => {
  db.Blogpost.findById(request.params.id).then((blogPosts) => {
    response.render('blogpost/new', { blogPosts: blogPosts});
  });
});

app.get(':id/edit', (request, response) => {
  db.Blogpost.findById(request.params.id).then((blogPosts) => {
    response.render('blogpost/edit', { blogPosts: blogPosts });
  });
});

app.post('/blogpost', (request, response) => {
  console.log('post request komt binnen');
  if (request.body.title) {
    db.BlogPost.create(request.body).then(() => {
      response.redirect('/');
    });
  } else {
    response.redirect('/blogpost/new');
  }
});

app.get('/blogpost/edit', (request, response) => {
  response.render('blogpost/edit');
});





db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
  });
});
