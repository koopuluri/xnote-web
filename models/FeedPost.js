var mongoose = require('mongoose');

// allowed in schema:
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array

var feedPostSchema = mongoose.Schema({
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    type: String,
    articleId: String,
    highlightId: String,
});

module.exports = mongoose.model('FeedPost', feedPostSchema);
