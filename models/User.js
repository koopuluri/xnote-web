var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


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
    local: {
        name: String,
        email: String,
        password: String
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String,
        picture: String
    },
    google: {
        id: String,
        token: String,
        name: String,
        email: String
    },    
    groups: [{
	    groupRef: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
	    notifLastViewed: {type: Date, default: Date.now},
        chatNotifCount: {type: Number, default: 0}
    }]
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);















