var React = require('react');
var GroupActions = require('../actions/GroupActions');
var NotificationStore = require('../stores/NotificationStore');
var GroupStore = require('../stores/GroupStore');
var GroupUtils = require('../utils/GroupUtils');
var FeedContainer = require('./FeedContainer.react');
var ChatContainer = require('./ChatContainer.react');
var FeedStore = require('../stores/FeedStore');

var mui = require('material-ui');
var Tabs = mui.Tabs;
var Tab = mui.Tab;
var Colors = mui.Styles.Colors;

function getNotifsState() {
    return {
        chatNotifs: NotificationStore.getChatNotifs(),
        currentUser: GroupStore.getCurrentUser()
    }
}

// props: groupId
var GroupSidebar = React.createClass({

    getInitialState: function() {
        return getNotifsState();
    },

    componentDidMount: function() {
        NotificationStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        NotificationStore.removeChangeListener(this._onChange);
    },

    render: function() {
        var style = {
            position: 'fixed',
            width: '40%',
            height: '100%',
            top: 27
        };

        return (
            <div style={style}>
                <FeedContainer
                    segSize={5}
                    FeedStore={FeedStore} 
                    groupId={this.props.groupId}
                    currentUser={this.state.currentUser}
                    clearFeed={GroupActions.clearFeed}
                    fetchFeedSegment={GroupActions.fetchFeedSegment}
                    addNote={GroupActions.addNote}
                    removeNote={GroupActions.removeNote}
                    generateUUID={GroupUtils.generateUUID}
                    getCurrentTimestamp={GroupUtils.getTimestamp}/>
            </div>
        );
    },

    _onChange: function() {
       this.setState(getNotifsState());
    },

    _onActive: function(tab) {
        if(tab.props.route == 'chat') {
            GroupActions.resetChatNotifs();
        } else if (tab.props.route == 'feed') {
            GroupActions.resetFeedNotifs();
        }
    },
});

module.exports = GroupSidebar;
