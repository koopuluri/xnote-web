window.React = require('react');
var API = require('./utils/API')
var LandingContainer = require('./components/LandingContainer.react');
var injectTapEventPlugin = require("react-tap-event-plugin");
var Actions = require('./actions/LandingActions');

//Needed for onTouchTap
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var groupId = $('.group-id-span').attr('id');
var error = $('.error-span').attr('id');

// set the group associated with the groupId in the stores:
if(groupId) {
	Actions.fetchAndSetGroup(groupId);
}

React.render(
	<LandingContainer error={error}/>,
	document.getElementById('landing-container')
);
