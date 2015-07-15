window.React = require('react');
var API = require('./utils/API')
var LandingContainer = require('./components/LandingContainer.react');
var injectTapEventPlugin = require("react-tap-event-plugin");
var Actions = require('./actions/LandingActions');

//Needed for onTouchTap
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var groupId = null;
var inviter = null;
var groupId = $('.group-id-span').attr('id');
var inviterId = $('inviter-id-span').attr('inviter');

console.log('got inviter: ' + inviter);
console.log('got groupId: ' + groupId);

// set the group associated with the groupId in the stores:
if(groupId) {
	Actions.fetchAndSetGroup(groupId);
}

if(inviter) {
	Actions.fetchAndSetInviter(inviterId);
}

React.render(
	<LandingContainer />,
	document.getElementById('landing-container')
);
