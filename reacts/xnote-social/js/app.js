window.React = require('react');
var API = require('./utils/API')
var MainContainer = require('./components/MainContainer.react');
var injectTapEventPlugin = require("react-tap-event-plugin");
var Actions = require('./actions/GroupActions');

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var groupId = $('.group-id-span').attr('id');
var userId = $('.user-id-span').attr('id');

console.log('got groupId: ' + groupId);
console.log('got userId: ' + userId);

// set the group associated with the groupId in the stores:
Actions.fetchAndSetGroup(groupId);
// Actions.fetchArticleListSegment(groupId, 0, 9);
// Actions.fetchFeedSegment(groupId, 0, 5);

//Render Flux Group App
React.render(
	<MainContainer userId={userId} groupId={groupId}/>,
	document.getElementById('group-container')
);
