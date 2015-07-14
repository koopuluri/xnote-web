window.React = require('react');
var API = require('./utils/API')
var MainContainer = require('./components/MainContainer.react');
var injectTapEventPlugin = require("react-tap-event-plugin");
var Actions = require('./actions/GroupActions');

//Load mock group data into local storage
GroupData.init();

//Load mock API call
// GroupAPI.getGroupData();

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var groupId = $('.group-id-span').attr('id');
console.log('got groupId: ' + groupId);

// set the group associated with the groupId in the stores:
Actions.fetchAndSetGroup(groupId);
// Actions.fetchArticleListSegment(groupId, 0, 9);
// Actions.fetchFeedSegment(groupId, 0, 5);

//Render Flux Group App
React.render(
	<MainContainer groupId={groupId}/>,
	document.getElementById('group-container')
);
