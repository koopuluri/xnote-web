window.React = require('react');
var GroupData = require('./MockData');
var GroupAPI = require('./utils/GroupAPI');
var GroupSideBar = require('./components/GroupSideBar.react');
var injectTapEventPlugin = require("react-tap-event-plugin");

//Load mock group data into local storage
GroupData.init();

//Load mock API call
GroupAPI.getGroupData();

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var groupId = $('.group-id-span').attrs('id');

//Render Flux Group App
React.render(
	<GroupSideBar groupId=groupId/>,
	document.getElementById('group-container')
);
