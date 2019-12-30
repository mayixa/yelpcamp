const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  localStrategy = require('passport-local'),
  campground = require('./models/campground'),
  comment = require('./models/comment'),
  User = require('./models/user'),
  seedDB = require('./seeds');

mongoose.connect(
  'mongodb+srv://Mayixa:flingan95@mayixa-avcru.azure.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to mongoDB!');
});

app.use(bodyParser.urlencoded({ extended: true }));
// if you need to use a custom stylesheet/css, code below is useful:
// app.use(express.static(__dirname + '/directory'));
app.set('view engine', 'ejs');
seedDB();

// passport config
app.use(
  require('express-session')({
    secret: 'Believe in yourself that is all that matters',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass on current user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// functions
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// page routes
app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/index', (req, res) => {
  campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  });
});

app.post('/index', isLoggedIn, (req, res) => {
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

app.get('/index/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

app.get('/index/:id', (req, res) => {
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

//comments routes
app.get('/index/:id/comments/new', isLoggedIn, (req, res) => {
  campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

app.post('/index/:id/comments', isLoggedIn, (req, res) => {
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

// auth routes
app.get('/register', (req, res) => {
  res.render('register');
});
// handle sign up logic
app.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/index');
    });
  });
});

// show login form
app.get('/login', (req, res) => {
  res.render('login');
});

// handling login logic
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/login'
  }),
  (req, res) => {
  }
);

// logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/index');
});

// server
app.listen(3000, () => {
  console.log('The YelpCamp Server Has Started!');
});
