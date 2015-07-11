var React = require('react');
var GroupStore = require('../stores/GroupStore');
var FriendStore = require('../stores/FriendStore');

var GroupActions = require('../actions/GroupActions');
  
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
var CircularProgress = mui.CircularProgress;

var GROUPS_PAGE = "GroupsPage";
var LOGOUT = "Logout";
var ADD_MEMBER = "Add Member"

function getState() {
    return {
        groupTitle: GroupStore.getGroupTitle(),
        groupId: GroupStore.getGroupId(),
        members: GroupStore.getGroupMembers(),
        friends: FriendStore.getFriends(),
        queryList: FriendStore.getFriends(),
        friendsLoading: FriendStore.getLoading(),
        currentUser: GroupStore.getCurrentUser()
    }
}

var getOnAddFunction = function(member, self) {
  return function() {
    GroupActions.addMember(self.state.groupId, member);
    self.refs.addMemberQuery.clearValue();
    self.refs.addMemberDialog.dismiss();
  }
}

var AppToolbar = React.createClass({
    getInitialState: function() {
      return getState();
    },

    componentDidMount: function() {
      GroupStore.addChangeListener(this._onChange);
      FriendStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
      GroupStore.removeChangeListener(this._onChange);
      FriendStore.removeChangeListener(this._onChange);
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
          GroupActions.fetchAndSetFriends();
          break;

        case LOGOUT:
          break;

        case GROUPS_PAGE:
          break;
      }

    },

    _onQueryChange: function() {
      var query = this.refs.addMemberQuery.getValue();
      query = query.toLowerCase();
      var friends = this.state.friends;
      var queryList = [];
      for (var i = 0; i < friends.length; i++) {
          var name = friends[i].name.toLowerCase();
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
          type: MenuItem.Types.LINK,
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
                onTouchTap = {getOnAddFunction(queryListItem, self)}>
                {queryListItem.name}
              </ListItem>
            </div>
          );
        }
      });
      if (true) {
        var memberDialogInternals = '';
        if (this.state.friendsLoading) {
            memberDialogInternals = <CircularProgress mode="indeterminate" />
        } else {
            memberDialogInternals = <List> {queryList} </List>
        }
        
        var usernameElement = '';
        var me = this.state.currentUser;
        if (me && me.facebook.name) {
            usernameElement = (<FlatButton primary={true} 
                            label={me.facebook.name}
                            disabled={true} />);
        }


        return (
          <div>
              <AppBar className="app-toolbar"
                  title= {
                    <FlatButton primary={true} label={this.state.groupTitle} disabled={true}> </FlatButton>
                  }
                  zDepth={1}
                  showMenuIconButton = {true}
                  onLeftIconButtonTouchTap = {this._showMenuBar}
                  iconElementRight={usernameElement}>
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
                  {memberDialogInternals}
              </Dialog>
          </div>
        );

      }
    }
});

module.exports = AppToolbar;
