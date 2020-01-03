const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  User = require('../models/user');

// landing page
router.get('/', (req, res) => {
  res.render('landing');
});

// sign up form
router.get('/register', (req, res) => {
  res.render('register');
});

// handle sign up logic
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, () => {
        req.flash('success', 'Welcome to YelpCamp ' + req.body.username + '!');
        res.redirect('/index');
      });
    }
  });
});

// show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// handling login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/login'
  }),
  (req, res) => {}
);

// logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You successfully logged out. See you soon!');
  res.redirect('/index');
});

module.exports = router;
