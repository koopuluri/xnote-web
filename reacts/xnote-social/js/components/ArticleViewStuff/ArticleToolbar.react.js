var React = require('react');
var NotificationStore = require('../../stores/NotificationStore');
var GroupStore = require('../../stores/GroupStore');
var ChatStore = require('../../stores/ChatStore');
var FeedStore = require('../../stores/FeedStore');
var ArticleActions = require('../../actions/ArticleActions');
var mui = require('material-ui');

var AppBar = mui.AppBar;
var ToolbarTitle = mui.ToolbarTitle;
var ToolbarGroup = mui.ToolbarGroup;
var LeftNav = mui.LeftNav;
var Menu = mui.Menu;
var MenuItem = require('material-ui/lib/menus/menu-item');
var FlatButton = mui.FlatButton;
var Colors = mui.Styles.Colors;


var IconMenu = mui.IconMenu;
var IconButton = mui.IconButton;

var GROUP_PAGE = "GroupPage";
var LOGOUT = "Logout";

function getState() {
  return {
    chatNotifs: NotificationStore.getChatNotifs(),
    feedNotifs: NotificationStore.getFeedNotifs(),
    groupTitle: GroupStore.getGroupTitle(),
    feed: FeedStore.getFeed(),
    chat: ChatStore.getChat()
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

      var chatMenu = this.state.chat.map(function(message) {
        var messageText = message.createdBy.facebook.name + ' : ' + message.content;
        console.log(messageText);
        return (
          <MenuItem 
            primaryText = {messageText}/>
        )
      });

      var feedMenu = this.state.feed.map(function(post) {
        var feedText = post.createdBy.facebook.name;
        console.log(post);
        return (
          <MenuItem 
            primaryText = {feedText}/>
        )
      });

      var chatLabel = 'Chat'
      var chatButton = <FlatButton primary={true} label={chatLabel}/> 
        
      if(this.state.chatNotifs > 0) {
        var chatLabel = 'Chat (' + this.state.chatNotifs + ')'
        var chatButton = 
          <IconMenu iconButtonElement={
                <FlatButton 
                  primary={true}
                  label={chatLabel} />
          }>
              {chatMenu}
          </IconMenu>
      }

      var feedLabel = 'Feed'
      var feedButton = <FlatButton primary={true} label={feedLabel} />

      if(this.state.feedNotifs > 0) {
        var feedLabel = 'Feed (' + this.state.feedNotifs + ')'
        var feedButton = 
          <IconMenu iconButtonElement={
            <FlatButton primary={true} label={feedLabel} />
          }>
              {feedMenu}  
          </IconMenu>
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
    
            {chatButton}

            {feedButton}

          </AppBar>
        </div>
      );
    }
});

module.exports = ArticleToolbar;
