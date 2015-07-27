// utils object to ease communication between front end and backend
var Utils = {
	//Used to have a consistent user object no matter
	//the method of login. 
	normalizeUser: function(user) {
		if(user && user.facebook) {
			return user.facebook;
		} else if(user && user.google) {
			return user.google;
		} else if(user && user.local) {
			console.log('normalize euser: ');
			console.log(user);
			return user.local;
		} else {
			return user;
		}
	}
};

module.exports = Utils;
