module.exports = {

	
	getGroup: function(groupId, callback) {
		$.get('/_group', {
			groupId: groupId
		}, function(data, status) {
			callback(data);
		});
	},
};























