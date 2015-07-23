var React = require('react');

var mui = require('material-ui');
var List = mui.List;
var ListItem = mui.ListItem;
var CardHeader = mui.CardHeader;
var Avatar = mui.Avatar;
var CardActions = mui.CardActions;
var FlatButton = mui.FlatButton;

var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;


// expected prop:
// - group
var GroupListItem = React.createClass({

    getInitialState: function() {
        return ({
            chatNotifs: ChatStore.getNotifCount();
            feedNotifs: FeedStore.getNotifCount();
        });
    },

    componentDidMount: function() {
        ChatStore.addChangeListener(this._onChatChange);
        FeedStore.addChangeListener(this._onFeedChange);
        Actions.fetchAndSetNotifs(this.props.groupId);
    },

    _onChatChange: function() {
        this.setState({chatNotifs: ChatStore.getNotifCount()});
    },

    _onFeedChange: function() {
        this.setState({feedNotifs: FeedStore.getNotifCount()});
    },

    _onClick: function() {
        window.location = '/group?groupId=' + this.props.group.groupRef._id;
    },

    render: function() {
        var group = this.props.group.groupRef;
        return (
            <ListItem
                secondaryText={
                    <p> {group.members.length + ' members'} </p>
                }

                onTouchTap = {this._onClick}>
                    <p style={{fontSize: '20px', fontWeight: 650}}> {group.title} </p>
            </ListItem>
        );
    }
});

module.exports = GroupListItem;
