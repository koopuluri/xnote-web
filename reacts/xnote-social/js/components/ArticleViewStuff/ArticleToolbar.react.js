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
      NotificationStore.addChangeListener(this._onChange);
      GroupStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
      NotificationStore.removeChangeListener(this._onChange);
      GroupStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
      this.setState(getState());
    },

    _showMenuBar: function() {
      this.refs.menuBar.toggle();
    },

    _onBackButtonPressed: function(e, selectedIndex, menuItem) {
      ArticleActions._setSelectedArticleId(null);
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
                  <FlatButton 
                    label='Back'
                    primary={true}
                    onClick={this._onBackButtonPressed}
                    style = {
                      {
                        padding: 8
                      }
                    } />
                  } >
                  <FlatButton primary={true} label={chatLabel}> </FlatButton>
                  <FlatButton primary={true} label={feedLabel}> </FlatButton>
              </AppBar>
          </div>
        );
    }
});

module.exports = ArticleToolbar;
