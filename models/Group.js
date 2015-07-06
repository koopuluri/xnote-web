var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// allowed in schema:
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array

var groupSchema = new Schema({
    groupId: String,
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    feedPosts: [{type: mongoose.Schema.Types.ObjectId, ref: 'FeedPost'}],
    articles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Article'}],
    title: String,
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Group', groupSchema);
