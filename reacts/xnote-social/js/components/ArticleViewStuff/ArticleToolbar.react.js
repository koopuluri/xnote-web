var React = require('react');
var NotificationStore = require('../../stores/NotificationStore');
var GroupStore = require('../../stores/GroupStore');
var ChatStore = require('../../stores/ChatStore');
var FeedStore = require('../../stores/FeedStore');
var ArticleActions = require('../../actions/ArticleActions');
var ChatNotifications = require('./ChatNotifications.react');
var FeedNotifications = require('./FeedNotifications.react');
var mui = require('material-ui');

var GroupActions = require('../../actions/GroupActions');

var AppBar = mui.AppBar;
var FlatButton = mui.FlatButton;
var Colors = mui.Styles.Colors;

function getState() {
    return {
        chatNotifs: NotificationStore.getChatNotifs(),
        notifs: NotificationStore.getNotifs(),
        groupTitle: GroupStore.getGroupTitle(),
        currentUser: GroupStore.getCurrentUser(),
        chat: ChatStore.getChat()
    }
}


var ArticleToolbar = React.createClass({
    getInitialState: function() {
      return getState();
    },

    componentDidMount: function() {
      NotificationStore.addChangeListener(this._onNotifChange);
      GroupStore.addChangeListener(this._onGroupChange);
      GroupActions.fetchAndSetNotifs(this.props.groupId);
    },

    componentWillUnmount: function() {
      NotificationStore.removeChangeListener(this._onNotifChange);
      GroupStore.removeChangeListener(this._onGroupChange);
    },

    _onNotifChange: function() {
      this.setState({
        chatNotifs: NotificationStore.getChatNotifs(),
        notifs: NotificationStore.getNotifs()
      });
    },

    _onGroupChange: function() {
        var newTitle = GroupStore.getGroupTitle();
        if (this.state.groupTitle !== newTitle) {
            this.setState({groupTitle: newTitle});
        }
    },

    _showMenuBar: function() {
      this.refs.menuBar.toggle();
    },

    _onBackButtonPressed: function(e, selectedIndex, menuItem) {
        window.location.hash = '#';
    },

    render: function() {
      //Stores the username in the right of the appbar.
      var usernameElement = '';
      var me = this.state.currentUser;
      if (me && me.facebook.name) {
          usernameElement = (
            <FlatButton primary={true} 
              label={me.facebook.name}
              disabled={true} />
          );
      }
      return (
        <div>
          <AppBar className="article-toolbar"
            title= {
              <FlatButton primary={true} label= {this.state.groupTitle} disabled={true}> </FlatButton>
            }
            zDepth={1}
            showMenuIconButton = {true}
            iconElementLeft = {
            <FlatButton 
              label='Back'
              primary={true}
              onClick={this._onBackButtonPressed}
              style = {
                {
                 padding: 8
                }
              } />
          }>
            <ChatNotifications 
              chatNotifs={this.state.chatNotifs}
              chat={this.state.chat} />
            <FeedNotifications notifs={this.state.notifs} />
            {usernameElement}
          </AppBar>
        </div>
      );
    }
});

module.exports = ArticleToolbar;
