const express = require('express'),
  router = express.Router({mergeParams: true}),
  campground = require('../models/campground'),
  comment = require('../models/comment');

// middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// new comment/review form
router.get('/new', isLoggedIn, (req, res) => {
  campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

// submit comment/review form
router.post('/', isLoggedIn, (req, res) => {
  campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/index');
    } else {
      comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/index/' + campground._id);
        }
      });
    }
  });
});

module.exports = router;
