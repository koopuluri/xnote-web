var React = require('react');

var mui = require('material-ui');
var AppBar = mui.AppBar;
var FlatButton = mui.FlatButton;

var DashNavbar = React.createClass({

	_logout: function() {
		  // logout user and redirect to landing page.
	},

	render: function() {
		return (
			<AppBar className='app-toolbar'
				title="Tatr Groups"
  				iconElementRight={<FlatButton label="Logout" />}>
			</AppBar>
		);
	}
});

module.exports = DashNavbar;
