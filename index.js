const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      pug = require('pug'),
      Sequelize = require('sequelize');

var app = express(),
    sequelize = new Sequelize('blogPost', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });

var db = require('./models');

var adminRouter = require('./routes/admin');

// console.log(db);

app.use(express.static('public'));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }})
);

app.use('/admin', adminRouter);

app.set('view engine', 'pug');

app.get('/', (request, response) => {
  db.BlogPost.findAll({ order: 'id ASC' }).then((blogPosts) => {
    response.render('index', { blogPosts: blogPosts });
  });
});

app.get('/blogpost/new', (request, response) => {
  response.render('blogpost/new');
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

app.post('/comments', (req, res) => {
  db.Comment.create(req.body).then((comment) => {
    return comment.getPost().then((blogPost) => {
      res.redirect('/' + post.slug);
    });
  });
});


app.get('/blogpost/:slug', (req, res) => {
  db.BlogPost.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((post) => {
    return post.getComments().then((comments) => {
      res.render('blogpost/show', { blogPost: blogPost, comments: comments });
    });
  }).catch((error) => {
    res.status(404).end();
  });
});


db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
  });
});
