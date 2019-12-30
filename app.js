const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  localStrategy = require('passport-local'),
  User = require('./models/user'),
  seedDB = require('./seeds');

// requiring routes
const commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  indexRoutes = require('./routes/index');

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

app.use(indexRoutes);
app.use('/index', campgroundRoutes);
app.use('/index/:id/comments', commentRoutes);

// server
app.listen(3000, () => {
  console.log('The YelpCamp Server Has Started!');
});
