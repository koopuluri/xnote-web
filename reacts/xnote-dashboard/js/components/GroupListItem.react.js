var React = require('react');
var ChatStore = require('../stores/ChatStore');
var FeedStore = require('../stores/FeedStore');
var Actions = require('../actions/Actions');

var mui = require('material-ui');
var List = mui.List;
var ListItem = mui.ListItem;
var CardHeader = mui.CardHeader;
var Avatar = mui.Avatar;
var CardActions = mui.CardActions;
var FlatButton = mui.FlatButton;
var FontIcon = mui.FontIcon;
var Card = mui.Card;
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;


// expected prop:
// - group
var GroupListItem = React.createClass({

    getInitialState: function() {
        return ({
            chatNotifsCount: ChatStore.getNotifCount(this.props.groupId),
            feedNotifsCount: FeedStore.getNotifCount(this.props.groupId)
        });
    },

    componentDidMount: function() {
        ChatStore.addChangeListener(this._onChatChange);
        FeedStore.addChangeListener(this._onFeedChange);
        Actions.fetchAndSetNotifs(this.props.groupId);
    },

    _onChatChange: function() {
        var groupId = this.props.groupId;
        if(!(this.state.chatNotifsCount === ChatStore.getNotifCount(groupId))) {
            this.setState({chatNotifsCount: ChatStore.getNotifCount(groupId)});
        }
    },

    _onFeedChange: function() {
        var groupId = this.props.groupId;
        if(!(this.state.feedNotifsCount === FeedStore.getNotifCount(groupId))) {
            this.setState({feedNotifsCount: FeedStore.getNotifCount(groupId)});
        }
    },

    _onClick: function() {
        window.location = '/group?groupId=' + this.props.group.groupRef._id;
    },

    render: function() {
        var feedNotifsCount = this.state.feedNotifsCount;
        var chatNotifsCount = this.state.chatNotifsCount;
        var group = this.props.group.groupRef;
        if(feedNotifsCount && feedNotifsCount > 0) {
            var feedNotifsIcon =
                <div style={{"display":"inline-block"}}>
                    <FontIcon 
                        style={{
                            "display":"inline-block",
                            color:Colors.grey500,
                            paddingTop:8
                        }}
                        className="material-icons">
                            notifications
                    </FontIcon>
                    <p style={{
                        borderRadius:1000,
                        fontSize:10,
                        paddingLeft:5,
                        paddingRight:5,
                        paddingTop:3,
                        paddingBottom:2,
                        backgroundColor:Colors.red500,
                        color:Colors.white,
                        "display":"inline-block",
                        margin:0
                    }}>{feedNotifsCount}</p>
                </div>
        }
        if(chatNotifsCount && chatNotifsCount > 0) {
            var chatNotifsIcon =
                <div style={{"display":"inline-block"}}>
                    <FontIcon 
                        style={{
                            "display":"inline-block",
                            color:Colors.grey500,
                            paddingTop:8
                        }}
                        className="material-icons">
                            message
                    </FontIcon>
                    <p style={{
                        borderRadius:1000,
                        paddingLeft:5,
                        paddingRight:5,
                        paddingTop:3,
                        paddingBottom:2,
                        fontSize:10,
                        backgroundColor:Colors.red500,
                        color:Colors.white,
                        "display":"inline-block",
                        margin:0
                    }}>{chatNotifsCount}</p>
                </div>
        }
        return (
            <div style={{paddingTop:10, paddingBottom:10, paddingRight:200, paddingLeft:200}}>
            <Card>
            <ListItem
                secondaryText={
                    <p style={{paddingLeft:20}}> {group.members.length + ' members'} </p>
                }

                rightIconButton={
                    <span style={{paddingRight:20}}>
                        {feedNotifsIcon}
                        {chatNotifsIcon}
                    </span>
                }
                onTouchTap = {this._onClick}>
                    <p style={{fontSize: '20px', fontWeight: 650, paddingLeft:20}}> {group.title} </p>
                
            </ListItem>
            </Card>
            </div>
        );
    }
});

module.exports = GroupListItem;
