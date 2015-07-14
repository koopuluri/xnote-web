var React = require('react');
var Utils = require('../utils/Utils');
var Actions = require('../actions/Actions')
var DashStore = require('../stores/DashStore');

var mui = require('material-ui');
var FloatingActionButton = mui.FloatingActionButton;
var Dialog = mui.Dialog;
var FlatButton = mui.FlatButton;
var TextField = mui.TextField;
var CircularProgress = mui.CircularProgress;
var Menu = mui.Menu;
var MenuItem = mui.MenuItem;
var Colors = mui.Styles.Colors;
var List = mui.List;
var ListItem = mui.ListItem;
var TextField = mui.TextField;
var CircularProgress = mui.CircularProgress;
var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var IconButton = mui.IconButton;
var FontIcon = mui.FontIcon;

function getState() {
    return ({
        friends: DashStore.getFriends(),
        queryList: [],
        addList: [],
        friendsLoading : false,
        groupName : '',
        currentUser: DashStore.getCurrentUser(),
    });
}

var onDeleteFromAddList = function(addListItem, self) {
  return function() {
    var newList = self.state.addList;
    for (var i = 0; i < newList.length; i++) {
      if(newList[i].id === addListItem.id) {
        newList.splice(i, 1);
      }
    }
    self.setState({
      addList: newList
    })
  }
}

var friendListOnClickFunction = function(member, self) {
  return function() {
    var newList = self.state.addList;
    newList.push(member);
    self.setState({
      addList : newList
    })
    //self.refs.addMemberQuery.clearValue();
    //self.refs.addMemberQuery.focus();
  }
}

var AddGroupComponent = React.createClass({

    getInitialState: function() {
        return getState();
    },

    componentWillMount: function() {
    },

    _openDialog: function() {
        this.refs.addGroupDialog.show();
    },

    _onGroupNext: function() {
        var groupName = this.refs.groupName.getValue();
        if(groupName != '') {
            this.setState({
                groupName : this.refs.groupName.getValue()
            });
            this.refs.groupName.clearValue();
        } else {
            this.refs.groupName.focus();
        }
    },

    _onQueryChange: function() {
        var query = this.refs.addMemberQuery.getValue();
        if(query != '') {
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
        } else {
            this.setState({
                queryList: []
            });
        }
    },

    _onDialogDimiss: function() {
        this.setState({
            groupName : ''
        });
    },

    _onGroupAdd: function() {
        var newList = this.state.addList.slice();
        newList.push(this.state.currentUser);
        var group = {
            createdBy: this.state.currentUser,
            _id: Utils.generateUUID(),
            members: newList,
            feedPosts: [],
            articles: [],
            title: this.state.groupName,
            createdAt: Utils.getTimestamp()
        };
        Actions.addGroup(group);
        this.setState({
            addList : []
        })
        this.refs.addGroupDialog.dismiss();
    },


    render: function() {
        var self = this;

        if(this.state.groupName === '') {
            var dialogTitle = 'Add Group'
            var dialogActions = [
                { text: 'Cancel', primary: true },
                { text: 'Next', onTouchTap: self._onGroupNext, primary: true}
            ];                
            var dialogComponent = 
                <div>
                    <TextField
                        fullWidth = {true}
                        hintText="Enter Group Name"
                        ref = 'groupName' />
                </div>
        } else {
            var counter = 0;
            var queryList = this.state.queryList.map(function(queryListItem) {
                counter ++;
                var found = false;
                for(var i = 0; i < self.state.addList.length; i++) {
                    if (self.state.addList[i].id == queryListItem.id) {
                        found = true;
                        break;
                    }
                }
                if(!found && counter <= 5) {
                    return (
                        <div>
                            <ListItem
                                onTouchTap = {friendListOnClickFunction(queryListItem, self)}>
                                    {queryListItem.name}
                            </ListItem>
                        </div>
                    );
                }
            });
            var addListComponent = this.state.addList.map(function(addListItem) {
                return (
                    <ToolbarGroup style = {{height:36, paddingRight:5, paddingTop:15}} float="left">
                        <ListItem 
                            style={{
                                backgroundColor:Colors.green200,
                                paddingRight:5,
                                paddingBottom:2,  
                                paddingLeft:5,
                                paddingTop:2}}
                            primaryText = {<p style={{paddingRight:15}}> {addListItem.name} </p>}
                            rightIconButton = {
                                <FontIcon 
                                    onClick={onDeleteFromAddList(addListItem, self)}>
                                        x 
                                </FontIcon>}
                            disabled = {true} />
                    </ToolbarGroup>
                );
            });
            var dialogTitle = "Add members to " + self.state.groupName
            var dialogActions = [
                { text: 'Cancel', primary: true},
                { text: 'Add', primary: true, onTouchTap: self._onGroupAdd}
            ];
            var dialogComponent =
                <div>
                    <div style={{border:5}}>
                        {addListComponent}
                        <ToolbarGroup style = {{height:36}}>
                        <TextField
                            style={{padding: 0}}
                            hintText ="Enter friend name"
                            ref = 'addMemberQuery'
                            onChange = {this._onQueryChange}/>
                        </ToolbarGroup>
                    </div>
                    <div style={{'clear':'both'}}>
                        <List> {queryList} </List>
                    </div>
                </div>
        }
        return (
            <div className = "add-group-container">
                <Dialog
                    title = {dialogTitle}
                    ref = "addGroupDialog"
                    actions={dialogActions}
                    modal={true}
                    onDismiss={this._onDialogDimiss}>
                    {dialogComponent}
                </Dialog>
                <span className='add-group-button'>
                    <FloatingActionButton
                        onTouchTap = {this._openDialog} />
                </span>
            </div>
        );
    }
});

module.exports = AddGroupComponent;
