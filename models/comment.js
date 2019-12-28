const mongoose      = require('mongoose');
const commentSchema = mongoose.Schema({
    text: String,
    author: String
});

module.exports = moongose.model('Comment', commentSchema);