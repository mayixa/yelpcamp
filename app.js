const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const campgrounds = [
    {name: "Åsen", image: "https://cdn.pixabay.com/photo/2015/08/27/00/23/finland-909266_1280.jpg"},
    {name: "Vreken", image: "https://cdn.pixabay.com/photo/2017/06/26/21/02/camp-2445212_1280.jpg"},
    {name: "Klohill", image: "https://cdn.pixabay.com/photo/2017/02/14/08/51/wintry-2065342_1280.jpg"},
    {name: "Stubben", image: "https://cdn.pixabay.com/photo/2015/10/12/14/58/camping-984038_1280.jpg"}
]

app.get("/", (req, res) => {
     res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const newCamp = {name: name, image: image};
    campgrounds.push(newCamp);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.listen(3000, () => {
    console.log("The YelpCamp Server Has Started!");
});