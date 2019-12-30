const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  campground = require('./models/campground');
  comment = require('./models/comment');
  seedDB = require('./seeds');

seedDB();
mongoose.connect(
  'mongodb+srv://Mayixa:flingan95@mayixa-avcru.azure.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true }
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

app.post('/index', (req, res) => {
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

app.get('/index/new', (req, res) => {
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

app.get('/index/:id/comments/new', (req, res) => {
    campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

app.post('/index/:id/comments', (req, res) => {
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

app.listen(3000, () => {
  console.log('The YelpCamp Server Has Started!');
});
