const campground = require('../models/campground'),
  comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to login first!');
  res.redirect('/login');
};

middlewareObj.checkCampOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    campground.findById(req.params.id, (err, foundCamp) => {
      if (err) {
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else {
        // does user own camp?
        if (foundCamp.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have permission to do this');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to login first!');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back');
      } else {
        // does user own comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have permission to do that');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to login first!');
    res.redirect('back');
  }
};

module.exports = middlewareObj;
