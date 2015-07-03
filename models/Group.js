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
    users: [],
    title: String,
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Group', groupSchema);
