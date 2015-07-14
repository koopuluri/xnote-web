module.exports = {

    // getting all the groups that this user belongs to:
    getGroups: function(callback) {
        $.get('/_groups', {}, function(data, status) {
            console.log('data: ' + Object.keys(data));
            console.log(data);
            callback(data.groups);
        });
    },

    // adding group:
    addGroup: function(group, callback) {
        $.post('/_add_group', {group: group}, function(data, status) {
            callback(data.result);
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
