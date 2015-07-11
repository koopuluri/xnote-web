var React = require('react');
var NotificationStore = require('../../stores/NotificationStore');
var GroupStore = require('../../stores/GroupStore');
var ArticleActions = require('../../actions/ArticleActions');
var mui = require('material-ui');

var AppBar = mui.AppBar;
var ToolbarTitle = mui.ToolbarTitle;
var ToolbarGroup = mui.ToolbarGroup;
var LeftNav = mui.LeftNav;
var Menu = mui.Menu;
var MenuItem = mui.MenuItem;
var FlatButton = mui.FlatButton;
var Colors = mui.Styles.Colors;

var GROUP_PAGE = "GroupPage";
var LOGOUT = "Logout";

function getState() {
    return {
        chatNotifs: NotificationStore.getChatNotifs(),
        feedNotifs: NotificationStore.getFeedNotifs(),
        groupTitle: GroupStore.getGroupTitle()
    }
}

var ArticleToolbar = React.createClass({
    getInitialState: function() {
      return getState();
    },

    componentDidMount: function() {
      NotificationStore.addChangeListener(this._onNotifChange);
      GroupStore.addChangeListener(this._onGroupChange);
    },

    componentWillUnmount: function() {
      NotificationStore.removeChangeListener(this._onNotifChange);
      GroupStore.removeChangeListener(this._onGroupChange);
      console.log('ArticleToolbar.unmount');
    },

    _onNotifChange: function() {
        console.log('_onNotifChange')
        this.setState({
            chatNotifs: NotificationStore.getChatNotifs(),
            feedNotifs: NotificationStore.getFeedNotifs()
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
      ArticleActions.unselectArticle();
    },

    render: function() {
      var chatLabel = 'Chat'
      if(this.state.chatNotifs > 0) {
        var chatLabel = 'Chat (' + this.state.chatNotifs + ')'
      }

      var feedLabel = 'Feed'
      if(this.state.feedNotifs > 0) {
        var feedLabel = 'Feed (' + this.state.feedNotifs + ')'
      }

        return (
          <div>
              <AppBar className="article-toolbar"
                  title= {
                    <FlatButton primary={true} label= {this.state.groupTitle} disabled={true}> </FlatButton>
                  }
                  zDepth={2}
                  showMenuIconButton = {true}
                  iconElementLeft = {
                  <button onClick={this._onBackButtonPressed}>Back</button>
                  } >
                  <FlatButton primary={true} label={chatLabel}> </FlatButton>
                  <FlatButton primary={true} label={feedLabel}> </FlatButton>
              </AppBar>
          </div>
        );
    }
});

module.exports = ArticleToolbar;
