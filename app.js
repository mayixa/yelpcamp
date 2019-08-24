const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser"),
      mongoose      = require('mongoose'),
      campground    = require('./models/campground');

mongoose.connect('mongodb+srv://Mayixa:flingan95@mayixa-avcru.azure.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to mongoDB!')
});

app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static(__dirname + '/partials'));
app.set("view engine", "ejs");

// const campgrounds = [
//     {name: "Klohill", image: "https://cdn.pixabay.com/photo/2017/02/14/08/51/wintry-2065342_1280.jpg"},
//     {name: "Stubben", image: "https://cdn.pixabay.com/photo/2015/10/12/14/58/camping-984038_1280.jpg"},
// ]

app.get("/", (req, res) => {
     res.render("landing");
});

app.get("/index", (req, res) => {
    campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });

});

app.post("/index", (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const price = req.body.price;
    const location = req.body.image;
    const descr = req.body.descr;
    const newCamp = 
    {   
        name: name,
        image: image,
        price: price,
        location: location,
        descr: descr    
    };
    campground.create(newCamp, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log('New camp created!');
            console.log(newlyCreated);
        }
    });
    res.redirect("/index");
});

app.get("/index/new", (req, res) => {
    res.render("new");
});

app.get("/index/:id", (req, res) => {
    campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        } else {
            res.render("show", {campground: foundCamp});
        }
    });
});

app.listen(3000, () => {
    console.log("The YelpCamp Server Has Started!");
});