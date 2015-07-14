var React = require('react');
//var AppContainer = require('./components/AppContainer.react');
var DashContainer = require('./components/DashContainer.react');

var injectTapEventPlugin = require("react-tap-event-plugin");
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

React.render(
	  <DashContainer />,
	  document.getElementById('dashboard-container')
);
