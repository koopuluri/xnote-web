var React = require('react');
var Boot = require('react-bootstrap');
var Navbar = Boot.Navbar;
var Nav = Boot.Nav;
var NavItem = Boot.NavItem;
var DropdownButton = Boot.DropdownButton;
var MenuItem = Boot.MenuItem;

var DashNavbar = React.createClass({

	_logout: function() {
		  // logout user and redirect to landing page.
	},

	render: function() {
		// return html for the bootstrap navbar:
		return (
			<Navbar fixedTop={true} className='dash-nav' brand={<img height={45} href="/" src="/static/xnote_logo.png"></img>}>
			    <Nav right eventKey={0}> {/* This is the eventKey referenced */}
			        <MenuItem className="nav-link" onClick={this._logout} eventKey='1'>{'Logout'}</MenuItem>
				</Nav>
			</Navbar>
		);
	}
});

module.exports = DashNavbar;
