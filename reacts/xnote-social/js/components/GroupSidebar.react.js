var React = require('react');
var GroupActions = require('../actions/GroupActions');
var NotificationStore = require('../stores/NotificationStore');

var FeedContainer = require('./FeedContainer.react');
var ChatContainer = require('./ChatContainer.react');

var mui = require('material-ui');
var Tabs = mui.Tabs;
var Tab = mui.Tab;
var Colors = mui.Styles.Colors;

function getNotifsState() {
    return {
        chatNotifs: NotificationStore.getChatNotifs(),
        feedNotifs: NotificationStore.getFeedNotifs()
    }
}


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

        var contentStyle = {
            color: Colors.green500,
        }

        var chatLabel = 'Chat'
        if(this.state.chatNotifs > 0) {
            var chatLabel = 'Chat (' + this.state.chatNotifs + ')'
        }

        var feedLabel = 'Feed'
        if(this.state.feedNotifs > 0) {
            var feedLabel = 'Feed (' + this.state.feedNotifs + ')'
        }

        return (
            <div className = "group-sidebar-container">
                <Tabs
                    className = 'discussion-view-tabs'>

                    <Tab label= {chatLabel}
                        style = {contentStyle}
                       route = 'chat'
                        onActive = {this._onActive}>
                        <div>
                            <ChatContainer />
                        </div>
                    </Tab>

                    <Tab label= {feedLabel}
                        style = {contentStyle}
                        route = 'feed'
                        onActive = {this._onActive}>
                        <div>
                            <FeedContainer />
                        </div>
                    </Tab>
                </Tabs>
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
