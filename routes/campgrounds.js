const mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router(),
  campground = require('../models/campground'),
  middleware = require('../middleware');

mongoose.set('useFindAndModify', false);

// INDEX - show all camps
router.get('/', (req, res) => {
  campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - add new camp to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const price = req.body.price;
  const location = req.body.location;
  const descr = req.body.descr;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCamp = {
    name: name,
    image: image,
    price: price,
    location: location,
    descr: descr,
    author: author
  };
  campground.create(newCamp, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      console.log('New camp created!');
      console.log(newlyCreated);
    }
  });
  res.redirect('/index');
});

// NEW - show form to create new camp
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW - show campground info
router.get('/:id', (req, res) => {
  campground
    .findById(req.params.id)
    .populate('comments')
    .exec((err, foundCamp) => {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCamp);
        res.render('campgrounds/show', { campground: foundCamp });
      }
    });
});

// EDIT camp route
router.get('/:id/edit', middleware.checkCampOwner, (req, res) => {
  campground.findById(req.params.id, (err, foundCamp) => {
    res.render('campgrounds/edit', {campground: foundCamp});
  });
});

// UPDATE camp route
router.put('/:id', middleware.checkCampOwner, (req, res) => {
  campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground, 
    (err, updated) => {
      if (err) {
        res.redirect('/index');
      } else {
        res.redirect('/index/' + req.params.id);
      }
    });
});

// REMOVE camp route
router.delete('/:id', middleware.checkCampOwner, (req, res) => {
  campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/index');
    } else {
      console.log('Removed camp ' + req.params.id)
      res.redirect('/index');
    }
  });
});

module.exports = router;
