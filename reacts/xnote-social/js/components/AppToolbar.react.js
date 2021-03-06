var React = require('react');
var GroupStore = require('../stores/GroupStore');
var FriendStore = require('../stores/FriendStore');
var NotificationStore = require('../stores/NotificationStore');
var GroupActions = require('../actions/GroupActions');
var Loading = require('./Loading.react')
var FeedNotifications = require('./FeedNotifications.react');
  
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
var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var IconButton = mui.IconButton;
var FontIcon = mui.FontIcon;

var DASHBOARD = "Dashboard";
var LOGOUT = "Logout";
var ADD_MEMBER = "Add Member"


function getState() {
    return {
        groupTitle: GroupStore.getGroupTitle(),
        groupId: GroupStore.getGroupId(),
        members: GroupStore.getGroupMembers(),
        // friends: FriendStore.getFriends(),
        // queryList: [],
        // friendsLoading: FriendStore.getLoading(),
        currentUser: GroupStore.getCurrentUser(),
        // addList: [],
        notifs: NotificationStore.getNotifs()
    }
}

// var onDeleteFromAddList = function(addListItem, self) {
//   return function() {
//     var newList = self.state.addList;
//     for (var i = 0; i < newList.length; i++) {
//       if(newList[i].id === addListItem.id) {
//         newList.splice(i, 1);
//       }
//     }
//     self.setState({
//       addList: newList
//     })
//   }
// }

// var friendListOnClickFunction = function(member, self) {
//   return function() {
//     var newList = self.state.addList;
//     newList.push(member);
//     self.setState({
//         addList : newList
//     });
//     self.refs.addMemberQuery.clearValue();
//     self.refs.addMemberQuery.focus();
//   }
// }

// props:
// - groupId
var AppToolbar = React.createClass({
    getInitialState: function() {
      return getState();
    },

    componentDidMount: function() {
      GroupStore.addChangeListener(this._onChange);
      // FriendStore.addChangeListener(this._onChange);
      NotificationStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
      GroupStore.removeChangeListener(this._onChange);
      // FriendStore.removeChangeListener(this._onChange);
      NotificationStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
      this.setState(getState());
    },

    _showMenuBar: function() {
      this.refs.menuBar.toggle();
    },

    //Checks which menu item in the left nav has been clicked
    _onLeftNavChange: function(e, selectedIndex, menuItem) {
        switch (menuItem.payload) {
          case ADD_MEMBER:
            this.refs.addMemberDialog.show();
            GroupActions.fetchAndSetFriends();
            break;

          case DASHBOARD:
            window.location.href = '/dashboard';
            break;

          case LOGOUT:
            window.location.href = '/logout';
            break;
        } 
    },

    //Changes the query list based on the query the user has entered
    // _onQueryChange: function() {
    //   var query = this.refs.addMemberQuery.getValue();
    //   if(query != '') {
    //     query = query.toLowerCase();
    //     var friends = this.state.friends;
    //     var queryList = [];
    //     for (var i = 0; i < friends.length; i++) {
    //         var name = friends[i].name.toLowerCase();
    //         if (name.includes(query)) {
    //             queryList.push(friends[i]);
    //         }
    //     }
    //     this.setState({
    //         queryList: queryList
    //     });
    //   } else {
    //     this.setState({
    //         queryList: []
    //     })
    //   }
    // },

    _onAddMembers: function() {
      this.refs.addMemberDialog.dismiss();
      // GroupActions.addMembers(this.state.groupId, this.state.addList);
    },

    render: function() {
      //Maps the member variables to menu items
      var members = [];
      if (this.state.members) {
        var members = this.state.members.map(function(member) {
          return ({
            text: member.name
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
          payload: ADD_MEMBER,
          text: 'Add Member'
        },
        {
          payload: DASHBOARD,
          text: 'Back to Groups',
        },
        {
          payload: LOGOUT,
          text: 'Logout',
        }
      );

      var self = this;
      var addMemberActions = [
        { text: 'Cancel', primary: true },
        { text: 'Done', primary: true, onTouchTap: this._onAddMembers}
      ];

      //Querylist holds the list of users that match with the query
      //entered. It stores a max of 5 items and checks are made
      //so the members of add list are excluded
      // var counter = 0;
      // var queryList = this.state.queryList.map(function(queryListItem) {
      //   counter ++;
      //   var found = false;
      //   for(var i = 0; i < self.state.addList.length; i++) {
      //     if (self.state.addList[i].id == queryListItem.id) {
      //       found = true;
      //       break;
      //     }
      //   }

      //   if(!found && counter <= 5) {
      //     return (
      //       <div>
      //         <ListItem
      //           onTouchTap = {friendListOnClickFunction({name: queryListItem.name, id: queryListItem.id}, self)}>
      //           {queryListItem.name}
      //         </ListItem>
      //       </div>
      //     );
      //   }
      // });

      //MemberDialogInternals sets the loading spinner when the friends
      //list is still being fetched from the database.
      // var memberDialogInternals = '';
      // if (this.state.friendsLoading) {
      //     memberDialogInternals = <Loading marginLeft={45} marginTop={5}/>
      // } else {
      //     memberDialogInternals = <div><List> {queryList} </List></div>
      // }
      
      //Stores the username in the right of the appbar.
      var usernameElement = '';
      var me = this.state.currentUser;
      if (me && me.name) {
          usernameElement = (
            <FlatButton 
              style={{color:Colors.grey500}}
              label={me.name}
              disabled={true} />
          );
      }
      var addMemberComponent = 
        <div>
            <p> To add members to your group. Share the following link. </p>
            <p> {window.location.href} </p>
        </div>
      //Stores the members that the user has selected to be added
      //in chips. 
      // var addListComponent = this.state.addList.map(function(addListItem) {
      //   return (
      //     <ToolbarGroup style = {{height:36, paddingRight:5, paddingTop:15}} float="left">
      //     <ListItem 
      //       style={{
      //           backgroundColor:Colors.green200,
      //           paddingRight:5,
      //           paddingBottom:2,
      //           paddingLeft:5,
      //           paddingTop:2}}

      //       primaryText = {<p style={{paddingRight:15}}> {addListItem.name} </p>}
      //       rightIconButton = {
      //           <FontIcon 
      //             onClick={onDeleteFromAddList(addListItem, self)}>
      //              x 
      //           </FontIcon>}
      //       disabled = {true} />
      //     </ToolbarGroup>
      //   );
      // });

      return (
          <div>
            <AppBar className="app-toolbar"
                title= {
                    <p style={{
                        color: Colors.grey500,
                        lineHeight:1,
                        paddingTop:8,
                        fontSize:20,
                        fontWeight:500,
                    }}>
                        {this.state.groupTitle}
                    </p>
                }
                zDepth={1}
                showMenuIconButton = {true}
                iconElementLeft={
                    <FontIcon 
                        style={{
                          color:Colors.green500,
                          paddingTop:15,
                          cursor:"pointer"
                        }}
                        onClick={this._showMenuBar}
                        className="material-icons">
                          menu
                    </FontIcon>
                }>
                <FeedNotifications groupId={this.props.groupId}/>
                {usernameElement}
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
                <div style={{border:5}}>
                  {addMemberComponent}
                </div>
            </Dialog>
          </div>
      );
    }
});

module.exports = AppToolbar;