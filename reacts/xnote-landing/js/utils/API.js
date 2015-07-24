module.exports = {
	
	getGroup: function(groupId, callback) {
		$.get('/_group', {
			groupId: groupId
		}, function(data, status) {
			callback(data);
		});
	},

	signup: function(name, email, password, callback) {
		$.post("/signup", {
			name: name,
			email: email,
			password: password
		}, function(data, status) {
			callback(data);
		});
	},

	login: function(email, password, callback) {
		$.post("/login", {
			email: email,
			password: password
		}, function(data, status) {
			callback(data);
		});
	},

	loginFacebook: function(callback) {
		$.get('/auth/facebook', {}, function(data, status) {
			callback(data);
		});
	},

	loginGoogle: function(callback) {
		$.get('/auth/google', {}, function(data, status) {
			callback(data);
		});
	}
};























