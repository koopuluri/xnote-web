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

var noteSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    noteId: String,
    content: String,
    createdAt: {type: Date, default: Date.now},
    highlightId: String
});

module.exports = mongoose.model('Note', noteSchema);
