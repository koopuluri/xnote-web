// utils object to ease communication between front end and backend
var Utils = {
	//Used to have a consistent user object no matter
	//the method of login. 
	normalizeUser: function(user) {
		if(user.facebook) {
			return user.facebook;
		} else if(user.google) {
			return user.google;
		} else if(user.standard) {
			return user.standard;
		} else {
			return user;
		}
	}
};

module.exports = Utils;
