const express = require('express'),
  router = express.Router({ mergeParams: true }),
  campground = require('../models/campground'),
  comment = require('../models/comment'),
  middleware = require('../middleware');

// new comment/review form
router.get('/new', middleware.isLoggedIn, (req, res) => {
  campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

// submit comment/review form
router.post('/', middleware.isLoggedIn, (req, res) => {
  campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/index');
    } else {
      comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', 'Something went wrong');
          console.log(err);
          res.redirect('back');
        } else {
          // add username + id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log('comment');
          req.flash('success', 'Successfully added your comment!');
          res.redirect('/index/' + campground._id);
        }
      });
    }
  });
});

// edit comment route
router.get('/:comment_id/edit', middleware.checkCommentOwner, (req, res) => {
  comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', {
        campground_id: req.params.id,
        comment: foundComment
      });
    }
  });
});

// comment update route
router.put('/:comment_id', (req, res) => {
  comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect('back');
      } else {
        req.flash('success', 'Comment updated');
        res.redirect('/index/' + req.params.id);
      }
    }
  );
});

// comment remove route
router.delete('/:comment_id', middleware.checkCommentOwner, (req, res) => {
  comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment removed');
      res.redirect('/index/' + req.params.id);
    }
  });
});

module.exports = router;
