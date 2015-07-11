var React = require('react');
var GroupStore = require('../stores/GroupStore');


var mui = require('material-ui');
var Dialog = mui.Dialog;
var AppBar = mui.AppBar;
var FlatButton = mui.FlatButton;
var LeftNav = mui.LeftNav;
var Menu = mui.Menu;
var MenuItem = mui.MenuItem;
var Colors = mui.Styles.Colors;
var List = mui.List;
var ListItem = mui.ListItem;
var TextField = mui.TextField;
var Avatar = mui.Avatar;

var GROUPS_PAGE = "GroupsPage";
var LOGOUT = "Logout";
var ADD_MEMBER = "Add Member"

function getState() {
    return {
        groupTitle: GroupStore.getGroupTitle(),
        members: GroupStore.getGroupMembers(),
        friends: GroupStore.getFriends(),
        queryList: GroupStore.getFriends()
    }
}

var getOnAddFunction = function(member) {
  return function() {
    this.refs.addMemberQuery.clearValue();
    this.refs.addMemberDialog.dismiss();
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
      GroupStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
      this.setState(getState());
    },

    _showMenuBar: function() {
      this.refs.menuBar.toggle();
    },

    _onLeftNavChange: function(e, selectedIndex, menuItem) {
      switch (menuItem.payload) {
        case ADD_MEMBER:
          this.refs.addMemberDialog.show();
          break;

        case LOGOUT:
          break;

        case GROUPS_PAGE:
          break;
      }

    },

    _onAddMember: function(member) {

    },

    _onQueryChange: function() {
      var query = this.refs.addMemberQuery.getValue();
      query = query.toLowerCase();
      var friends = this.state.friends;
      var queryList = [];
      for (var i = 0; i < friends.length; i++) {
          var name = friends[i].facebook.name.toLowerCase();
          if (name.includes(query)) {
              queryList.push(friends[i]);
          }
      }
      this.setState({
          queryList: queryList
      });
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
            payload: '/logout',
            text: 'Logout',
            type: MenuItem.Types.LINK,
        },
        {
          type: MenuItem.TYPES.LINK,
          payload: '/groups',
          text: 'Back to Groups',
        },
        {
          payload: ADD_MEMBER,
          text: 'Add Member'
        }
      );
      var self = this;
      var addMemberActions = [
        { text: 'Cancel', primary: true },
      ];
      var counter = 0;
      var queryList = this.state.queryList.map(function(queryListItem) {
        counter ++;
        if (counter <= 5) {
          return (
            <div>
              <ListItem
                avatar = {<Avatar>A</Avatar>}
                onTouchTap = {getOnAddFunction(queryListItem)}>
                {queryListItem.facebook.name}
              </ListItem>
            </div>
          );
        }
      });
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
              <Dialog
                title = "Add Member"
                ref = "addMemberDialog"
                actions={addMemberActions}
                modal={true}>
                  <TextField
                    fullWidth = {true}
                    hintText="> Add Member"
                    ref = 'addMemberQuery'
                    onChange = {this._onQueryChange}/>
                  <List>
                    {queryList}
                  </List>
              </Dialog>
          </div>
        );

      }
    }
});

module.exports = AppToolbar;
