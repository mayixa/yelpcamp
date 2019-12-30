const express = require('express'),
  router = express.Router(),
  campground = require('../models/campground');

// middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

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
router.post('/', isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const price = req.body.price;
  const location = req.body.image;
  const descr = req.body.descr;
  const newCamp = {
    name: name,
    image: image,
    price: price,
    location: location,
    descr: descr
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
router.get('/new', isLoggedIn, (req, res) => {
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

module.exports = router;