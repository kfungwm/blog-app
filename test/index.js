// var assert = require('assert');
//
// describe('First Test', () => {
//   it('true has to be true', () => {
//     assert.equal(true, true);
//   });
//
//   it('array[0] will give you the first element of an array', () => {
//     var myArray = ['foo', 'bar', 'baz'];
//
//     assert.equal(myArray[0], 'foo');
//   });
//
//
//   //write a test case that test that last value of an array should give you the last value
//
// it('write a test case that test that last value of an array should give you the last value', () => {
//   var myNumber = [1, 2, 3, 4, 5, 6, 7, 8];
//
//   assert.equal(myNumber[myNumber.length-1], 8);
// });
//
//
// });




var assert = require('assert');
 var db = require('../models');

 describe('Post Model', () => {
   before((done) => {
     db.sequelize.sync({ force: true }).then(() => {
       done();
     });
   });

   it('creates a blog post', (done) => {
     db.BlogPost.create({
       title: 'Great blog Article',
       slug: 'our test slug',
       content: '<h1>Awesome!</h1>'
     }).then((post) => {
       assert.equal(post.isNewRecord, false);
       assert.equal(post.title, 'Great blog Article');
       assert.equal(post.slug, 'our test slug');
       assert.equal(post.content, '<h1>Awesome!</h1>');
       done();
     });
   });

   it('cannot create a post if title is missing', (done) => {
     db.BlogPost.create({
       slug: 'our test slug',
       content: '<h1>Awesome!</h1>'
     }).catch((error) => {
       assert.equal(error.errors[0].message, 'title cannot be null');
       assert.equal(error.errors.length, 1);
       done();
     });
   });

   it('cannot create a post if content is missing', (done) => {
     db.BlogPost.create({
       title: 'Great blog Article',
       slug: 'our test slug'
     }).catch((error) => {
       assert.equal(error.errors[0].message, 'content cannot be null');
       assert.equal(error.errors.length, 1);
       done();
     });
   });

  //  it('generates a slug during post creation if post has no slug', (done) => {
  //    db.BlogPost.create({
  //      title: 'This should get sluggified',
  //      content: '<h1>Awesome!</h1>'
  //    }).then((post) => {
  //      assert.equal(post.slug, 'this-should-get-sluggified');
  //      done();
  //    });
  //  });

   it('updates a blog post', (done) => {
     db.BlogPost.update({
       title: 'Updated new title',
       content: '<h5>New Content</h5>',
       slug: 'our-new-slug'
     }, {
       where: {
         title: 'Great blog Article'
       },
       returning: true
     }).then((updateData) => {
       var post = updateData[1][0];
       assert.equal(post.title, 'Updated new title');
       assert.equal(post.content, '<h5>New Content</h5>');
       assert.equal(post.slug, 'our-new-slug');
       done();
     });
   });

   it('deletes a blog post', (done) => {
     db.BlogPost.destroy({
       where: {
         title: 'Updated new title'
       }
     }).then((destroyRecordCount) => {
       assert.equal(destroyRecordCount, 1);
       done();
     });
   });
 });
