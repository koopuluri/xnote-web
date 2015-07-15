module.exports = {

	
	getGroup: function(groupId, callback) {
		$.get('/_group', {
			groupId: groupId
		}, function(data, status) {
			callback(data);
		});
	},

	getInviter: function(inviterId, callback) {
		$.get('/_inviter', {
			inviterId: inviterId
		}, function(data, status) {
			callback(data);
		});
	},
};























