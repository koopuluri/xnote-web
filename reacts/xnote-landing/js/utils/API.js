module.exports = {
	
	getGroup: function(groupId, callback) {
		console.log('getGroup: ' + groupId);
		$.get('/_group', {
			groupId: groupId
		}, function(data, status) {
			callback(data);
		});
	},
};























