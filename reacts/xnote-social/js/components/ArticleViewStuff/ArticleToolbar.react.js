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
      GroupStore.removeListener(this._onChange);
    },

    _onChange: function() {
      this.setState(getState());
    },

    _showMenuBar: function() {
      this.refs.menuBar.toggle();
    },

    _onLeftNavChange: function(e, selectedIndex, menuItem) {
      if(menuItem.payload === GROUPS_PAGE) {
        ArticleActions.setSelectedArticleId(null);
      } else if (menuItem.payload === LOGOUT) {
      
      }
    },

    render: function() {
      var menuItems = [
        { type: MenuItem.Types.SUBHEADER, text: 'Settings' },
        { 
          text: 'Logout', 
          payload: LOGOUT
        },
        { 
          text: 'Back to ' + this.state.groupTitle, 
          payload: GROUP_PAGE
        },
      ];

      var chatLabel = 'Chat'
      if(this.state.chatNotifs > 0) {
        var chatLabel = 'Chat (' + this.state.chatNotifs + ')'
      }

      var feedLabel = 'Feed'
      if(this.state.feedNotifs > 0) {
        var feedLabel = 'Feed (' + this.state.feedNotifs + ')'
      }

      if (true) {
        return (
          <div>
              <AppBar className="article-toolbar"
                  title= {
                    <FlatButton primary={true} label= {this.state.groupTitle} disabled={true}> </FlatButton>
                  }
                  zDepth={2}
                  showMenuIconButton = {true}
                  onLeftIconButtonTouchTap = {this._showMenuBar} >
                  <FlatButton primary={true} label={chatLabel}> </FlatButton>
                  <FlatButton primary={true} label={feedLabel}> </FlatButton>
              </AppBar>
              <LeftNav 
                docked={false}
                menuItems = {menuItems}
                ref = 'menuBar'
                onChange={this._onLeftNavChange}/>
          </div>
        );

      }
    }
});

module.exports = ArticleToolbar;
