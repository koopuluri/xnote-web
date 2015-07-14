module.exports = {

    // getting all the groups that this user belongs to:
    getGroups: function(callback) {
        $.get('/_groups', {}, function(data, status) {
            callback(data.groups);
        });
    },

    // adding group:
    addGroup: function(group, members, callback) {
        $.post('/_add_group', {group: group, members: members}, function(data, status) {
            callback(data.groupId);
        });
    },

    // Lonely and need friends? Just call this magic fun!
    getFriends: function(callback) {
        $.get('/_friends', {}, function(data, status) {
            callback(data.friends);
        });
    },

    getUserInfo: function(callback) {
        $.get('/_user_info', {}, function(data, status) {
            callback(data);
        });
    },
}
