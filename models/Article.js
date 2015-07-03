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

var articleSchema = mongoose.Schema({
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now},
    title: String,
    content: String,
    url: String,
    articleId: String,
    serialization: String
});

module.exports = mongoose.model('Article', articleSchema);
