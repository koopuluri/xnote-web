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

var userSchema = mongoose.Schema({
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String
    },
    groups: [{
	    groupRef: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
	    notifCount: Number
    }]
});

module.exports = mongoose.model('User', userSchema);
