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
        email: String,
        picture: String
    },
    groups: [{
	    groupRef: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
	    notifLastViewed: {type: Date, default: Date.now},
        chatNotifCount: {type: Number, default: 0}
    }]
});

module.exports = mongoose.model('User', userSchema);
