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
        // friends: DashStore.getFriends(),
        // queryList: [],
        // addList: [],
        groupName : '',
        currentUser: DashStore.getCurrentUser(),
        groupDescription: ''
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
    self.refs.addMemberQuery.clearValue();
    self.refs.addMemberQuery.focus();
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


    componentDidMount: function() {
        Actions.fetchAndSetFriends();
        DashStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        DashStore.removeChangeListener(this._onChange);
    },

    // _onQueryChange: function() {
    //     var query = this.refs.addMemberQuery.getValue();
    //     if(query != '') {
    //         query = query.toLowerCase();
    //         var friends = this.state.friends;
    //         var queryList = [];
    //         for (var i = 0; i < friends.length; i++) {
    //             var name = friends[i].name.toLowerCase();
    //             if (name.includes(query)) {
    //                 queryList.push(friends[i]);
    //             }   
    //         }
    //         this.setState({
    //             queryList: queryList
    //         });
    //     } else {
    //         this.setState({
    //             queryList: []
    //         });
    //     }
    // },

    _onDialogDimiss: function() {
        this.setState({
            groupName : ''
        });
    },

    _onGroupAdd: function() {
        var newList = [];
        // for (var i = 0; i < this.state.addList.length; i++) {
        //     newList.push(this.state.addList[i].id);
        // }
        newList.push(this.state.currentUser.id);
        var id = Utils.generateUUID();
        var group = {
            groupRef: {
                title: this.state.groupName,
                description: this.state.groupDescription,
                _id: id,
                members: 1
            },
            _id: id,
            title: this.state.groupName,
            description: this.state.groupDescription,
            createdAt: Utils.getTimestamp()
        };
        Actions.addGroup(group, newList);
        // this.setState({
        //     addList : []
        // })
        this.refs.addGroupDialog.dismiss();
    },

    _onChange: function() {
        this.setState({
            // friends: DashStore.getFriends(),
            currentUser: DashStore.getCurrentUser()
        });
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
                    <TextField 
                        fullWidth = {true}
                        hintText="Enter Group Description"
                        ref='groupDescription'
                        multiLine={true} />              
                </div>
        } else {
            // var counter = 0;
            // var queryList = this.state.queryList.map(function(queryListItem) {
            //     counter ++;
            //     var found = false;
            //     for(var i = 0; i < self.state.addList.length; i++) {
            //         if (self.state.addList[i].id == queryListItem.id) {
            //             found = true;
            //             break;
            //         }
            //     }
            //     if(!found && counter <= 5) {
            //         return (
            //             <div>
            //                 <ListItem
            //                     onTouchTap = {friendListOnClickFunction(queryListItem, self)}>
            //                         {queryListItem.name}
            //                 </ListItem>
            //             </div>
            //         );
            //     }
            // });
            // var addListComponent = this.state.addList.map(function(addListItem) {
            //     return (
            //         <ToolbarGroup style = {{height:36, paddingRight:5, paddingTop:15}} float="left">
            //             <ListItem 
            //                 style={{
            //                     backgroundColor:Colors.green200,
            //                     paddingRight:5,
            //                     paddingBottom:2,  
            //                     paddingLeft:5,
            //                     paddingTop:2}}
            //                 primaryText = {<p style={{paddingRight:15}}> {addListItem.name} </p>}
            //                 rightIconButton = {
            //                     <FontIcon 
            //                         onClick={onDeleteFromAddList(addListItem, self)}>
            //                             x 
            //                     </FontIcon>}
            //                 disabled = {true} />
            //         </ToolbarGroup>
            //     );
            // });
            var dialogTitle = "Add members to " + self.state.groupName
            var dialogActions = [
                { text: 'Cancel', primary: true},
                { text: 'Done', primary: true, onTouchTap: self._onGroupAdd}
            ];
            var dialogComponent =
                <div>
                    <div>
                        <p> To add members to your group. Send them the URL to the group once you enter. </p>
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
                    <FloatingActionButton onClick={this._openDialog}>
                        <FontIcon 
                            style={{
                                color:"#FFF",
                            }}
                            className="material-icons">
                                group_add
                        </FontIcon>
                    </FloatingActionButton>
                </span>
            </div>
        );
    }
});

module.exports = AddGroupComponent;
