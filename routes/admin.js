var express = require('express'),
    db = require('../models'),
    router = express.Router();

var requireUser = (request, response, next) => {
  if (request.path === '/admin') {
    return next();
  }
  if (request.session.user) {
    next();
  } else {
    response.redirect('/login');
  }
};

router.use(requireUser);

router.get('/blogpost', (request, response) => {
  db.BlogPost.findAll().then((blogPosts) => {
    response.render('blogpost/admin', { blogPosts: blogPosts });
  }).catch((error) => {
    throw error;
  });
});


router.get('/blogpost/edit/:id', (request, response) => {
  db.BlogPost.findById(request.params.id).then((blogPosts) => {
    response.render('blogpost/edit', { blogPosts: blogPosts });
  });
});



router.put('/blogpost/:id', (request, response) => {
  db.BlogPost.update(request.body, {
    where: {
      id: request.params.id
    }
  }).then(() => {
    response.redirect('/admin/blogpost');
  });
});


router.delete('/blogpost/:id', (request, response) => {
  db.BlogPost.destroy({
    where: {
      id: request.params.id
    }
  }).then(() => {
    response.redirect('/admin/blogpost');
  });
});


router.get('/logout', (request, response) => {
  request.session.user = undefined;
  response.redirect('/');
});


module.exports = router;
