const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      pug = require('pug'),
      Sequelize = require('sequelize');

var app = express(),
    sequelize = new Sequelize('blogPost', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });

var db = require('./models');


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

app.set('view engine', 'pug');

app.get('/', (request, response) => {
  db.BlogPost.findAll({ order: 'id ASC' }).then((blogPosts) => {
    response.render('index', { blogPosts: blogPosts });
  });
});

app.get('/blogpost/new', (request, response) => {
  response.render('blogpost/new');
});



app.get('/blogpost/admin', (request, response) => {
  db.BlogPost.findAll().then((blogPosts) => {
    response.render('blogpost/admin', { blogPosts: blogPosts });
  }).catch((error) => {
    throw error;
  });
});

app.get('/blogpost/:id', (request, response) => {
  db.BlogPost.create(request.body).then(() => {
    response.redirect('blogpost/show');
  });
});

app.get('/blogpost/:id/edit', (request, response) => {
  db.BlogPost.findById(request.params.id).then((blogPosts) => {
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


app.put('/blogpost/:id', (request, response) => {
  db.BlogPost.update(request.body, {
    where: {
      id: request.params.id
    }
  }).then(() => {
    response.redirect('/blogpost/admin');
  });
});

app.get('/blogpost/:id', (request, response) => {
  response.render('blogpost/admin');
});


app.delete('/blogpost/:id', (request, response) => {
  db.BlogPost.destroy({
    where: {
      id: request.params.id
    }
  }).then(() => {
    response.redirect('/blogpost/admin');
  });
});




db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
  });
});
