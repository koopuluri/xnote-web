window.React = require('react');
var GroupData = require('./MockData');
var GroupAPI = require('./utils/GroupAPI');
var GroupSideBar = require('./components/GroupSideBar.react');

//Load mock group data into local storage
GroupData.init();

//Load mock API call
GroupAPI.getGroupData();

var groupId = $('.group-id-span').attrs('id');

//Render Flux Group App
React.render(
	<GroupSideBar groupId={groupId}/>,
	document.getElementById('group-container')
);
