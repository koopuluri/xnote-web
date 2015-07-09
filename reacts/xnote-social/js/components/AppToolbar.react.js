var React = require('react');
var ContentStore = require('../stores/ContentStore');
var GroupStore = require('../stores/GroupStore');
var mui = require('material-ui');

var AppBar = mui.AppBar;
var FlatButton = mui.FlatButton;
var LeftNav = mui.LeftNav;
var Menu = mui.Menu;
var MenuItem = mui.MenuItem;
var Colors = mui.Styles.Colors;

var GROUPS_PAGE = "GroupsPage";
var LOGOUT = "Logout";

function getState() {
    return {
        groupTitle: GroupStore.getGroupTitle(),
        members: GroupStore.getGroupMembers()
    }
}

var AppToolbar = React.createClass({
    getInitialState: function() {
      return getState();
    },

    componentDidMount: function() {
      GroupStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
      GroupStore.removeListener(this._onChange);
    },

    _onChange: function() {
      this.setState(getState());
    },

    _showMenuBar: function() {
      this.refs.menuBar.toggle();
    },

    _onLeftNavChange: function(e, selectedIndex, menuItem) {
      if(menuItem.payload === GROUPS_PAGE) {
        
      } else if (menuItem.payload === LOGOUT) {
        
      }
    },

    render: function() {
      var members = [];
      if (this.state.members) {
        var members = this.state.members.map(function(member) {
          return ({
            text: member.facebook.name
          });
        });
      }
      var menuItems = [
        { type: MenuItem.Types.SUBHEADER, text: 'Members' },
      ]
      var menuItems = menuItems.concat(members);
      menuItems.push(
        { type: MenuItem.Types.SUBHEADER, text: 'Settings' },
        { 
          payload: LOGOUT, 
          text: 'Logout', 
        },
        { 
          payload: GROUPS_PAGE,
          text: 'Back to Groups', 
        }
      );
      if (true) {
        return (
          <div>
              <AppBar className="app-toolbar"
                  title= {
                    <FlatButton primary={true} label={this.state.groupTitle} disabled={true}> </FlatButton>
                  }
                  zDepth={1}
                  showMenuIconButton = {true}
                  onLeftIconButtonTouchTap = {this._showMenuBar}>
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
    }
});

module.exports = AppToolbar;
