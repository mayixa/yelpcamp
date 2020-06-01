const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  localStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  User = require('./models/user'),
  flash = require('connect-flash'),
  seedDB = require('./seeds');
  session = require('express-session');
  MemoryStore = require('memorystore')(session);
 
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'keyboard cat',
    proxy: true,
    resave: true,
    saveUninitialized: true
}))

// requiring routes
const commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  indexRoutes = require('./routes/index');

mongoose.connect(process.env.DATABASEURL,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to mongoDB!');
});

app.use(bodyParser.urlencoded({ extended: true }));
// if you need to use a custom stylesheet/css
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); // seed the database with campgrounds

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
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(indexRoutes);
app.use('/index', campgroundRoutes);
app.use('/index/:id/comments', commentRoutes);

// server
app.listen(process.env.PORT || 5000, () => {
  console.log('The YelpCamp Server Has Started!');
});
