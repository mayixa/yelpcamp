const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    location: String,
    descr: String
});

module.exports = mongoose.model("campground", campgroundSchema);