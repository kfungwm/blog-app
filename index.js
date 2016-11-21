const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      pug = require('pug'),
      session = require('express-session'),
      displayRoutes = require('express-routemap'),
      Sequelize = require('sequelize');

var app = express(),
    sequelize = new Sequelize('blogPost', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });

var db = require('./models');

var adminRouter = require('./routes/admin');

// console.log(db);

app.use(express.static('public'));

app.use(morgan('dev'));

app.use(session({ secret: 'Our secret key' }));

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
  console.log(response.session);
  db.BlogPost.findAll({ order: 'id ASC' }).then((blogPosts) => {
    console.log(request.session.user);
    response.render('index', { blogPosts: blogPosts, user: request.session.user });
  });
});




app.get('/blogpost/new', (request, response) => {
  response.render('blogpost/new', { user: request.session.user });
});

app.get('/register', (request, response) => {
  response.render('users/new');
});

app.get('/login', (request, response) => {
  response.render('login');
});


app.post('/users', (request, response) => {
  db.User.create(request.body).then((user) => {
    response.redirect('/');
  }).catch(() => {
    response.redirect('/register');
  });
});

app.post('/login', (request, response) => {
  console.log(request.body.email);
  var userInDB = db.User.findOne({
    where: {
      email: request.body.email
    }
  }).then((userInDB) => {
    console.log('Find the following user:')
    console.log(userInDB);
    if (userInDB.password === request.body.password) {
      request.session.user = userInDB;
      response.redirect('/');
    } else {
      response.redirect('/login');
    }
  }).catch(() => {
    response.redirect('/login');
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

app.post('/comments', (request, response) => {
  db.Comment.create(request.body).then((comment) => {
    console.log(comment);
    return comment.getBlogPost().then((blogPost) => {
      console.log(blogPost);
      response.redirect('/' + blogPost.slug);
    });
  });
});


app.get('/:slug', (request, response) => {
  console.log("hetwerkt:");
  db.BlogPost.findOne({
    where: {
      slug: request.params.slug
    }
  }).then((blogPost) => {
    // response.render('blogpost/show', { blogPost: blogPost, comments: comments });
    return blogPost.getComments().then((comments) => {
      console.log(comments);
      response.render('blogpost/show', { blogPost: blogPost, comments: comments, user: request.session.user });
    });
  }).catch((error) => {
    response.status(404).end();
  });
});



db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
    displayRoutes(app);
  });
});
