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

var highlightSchema = mongoose.Schema({
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    lastModifiedTimestamp: {type: Date, default: Date.now},
    article: {type: mongoose.Schema.Types.ObjectId, ref: 'Article'},
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
    clippedText: String,

    selection: {
        startOffset: Number,
        endOffset: Number,
        startPath: String,
        endPath: String,
        isBackwards: Boolean,
        isCollapsed: Boolean
    },

    notes: [
        {
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },

            owner: {
                name: String,
                id: String
            },
            noteId: String,
            content: String,
            createdAt: {type: Date, default: Date.now},
        }
    ],
});

module.exports = mongoose.model('Highlight', highlightSchema);
