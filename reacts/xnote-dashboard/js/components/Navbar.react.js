var React = require('react');
var DashStore = require('../stores/DashStore');
var Actions = require('../actions/Actions');

var mui = require('material-ui');
var AppBar = mui.AppBar;
var FlatButton = mui.FlatButton;
var LeftNav = mui.LeftNav;
var MenuItem = mui.MenuItem;
var FontIcon = mui.FontIcon;
var Colors = mui.Styles.Colors;

var DashNavbar = React.createClass({

	getInitialState: function() {
		return({
			currentUser: DashStore.getCurrentUser()
		});
	},

	componentWillMount: function() {
		DashStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		DashStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		this.setState(this.getInitialState());
	},

	_showMenuBar: function() {
		this.refs.menuBar.toggle();
	},

	_onLeftNavChange: function(e, selectedIndex, menuItem) {
    	switch (menuItem.payload) {
        	case LOGOUT:
        		window.location = '/logout';
          		break;
	  	}
    },

	render: function() {
		var name = this.state.currentUser ? this.state.currentUser.name : "";
		var menuItems = [
        	{ type: MenuItem.Types.SUBHEADER, text: 'Settings' },
        	{
	            payload: '/logout',
            	text: 'Logout',
            	type: MenuItem.Types.LINK,
        	}
        ];
		return (
			<div>
			<AppBar className='app-toolbar'
				title= {
					<p style={{
                        color: Colors.grey500,
                        lineHeight:1,
                        paddingTop:8,
                        fontSize:20,
                        fontWeight:500,
							color:'#FFF'
						}}>
						Xnote Groups
					</p>
				}
				iconElementLeft={
                    <FontIcon 
                        style={{
                          color:Colors.white,
                          paddingTop:15,
                          cursor:"pointer"
                        }}
                        onClick={this._showMenuBar}
                        className="material-icons">
                          menu
                    </FontIcon>
                }
  				iconElementRight={
  					<FlatButton 
  						style={{paddingTop:2}}
  						label= {name}
  						disabled = {true}/>}>
			</AppBar>
			<LeftNav
                docked={false}
                menuItems = {menuItems}
                ref = 'menuBar'
                onChange={this._onLeftNavChange}>
            </LeftNav>
            </div>
		);
	}
});

module.exports = DashNavbar;
