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
var MenuItem = require('material-ui/lib/menus/menu-item');
var MenuDivider = require('material-ui/lib/menus/menu-divider');
var FlatButton = mui.FlatButton;
var Colors = mui.Styles.Colors;


var IconMenu = mui.IconMenu;
var IconButton = mui.IconButton;

var GROUP_PAGE = "GroupPage";
var LOGOUT = "Logout";

var ARTICLE = 'ArticleFeedPost';
var HIGHLIGHT = 'HighlightFeedPost';

function getState() {
  return {
    chatNotifs: NotificationStore.getChatNotifs(),
    feedNotifs: NotificationStore.getFeedNotifs(),
    groupTitle: GroupStore.getGroupTitle(),
    feed: FeedStore.getFeed(),
    chat: ChatStore.getChat()
  }
}

var getOnFeedPostClickedFunction = function(post) {
  return function() {
    console.log(post);
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
        //ArticleActions.unselectArticle();
        window.location.hash = '#';
    },

    render: function() {

      var chatMenu = this.state.chat.map(function(message) {
        var messageText = message.createdBy.facebook.name + ' : ' + message.content;
        if(messageText.length > 103) {
          messageText = messageText.substring(0, 100) + '...'
        }
        return (
          <div>
          <MenuItem style={
              {
                fontSize: 12,
                lineHeight: 2
              }
            }
            primaryText = {messageText}/>
          <MenuDivider />
          </div>
        )
      });

      var feedMenu = this.state.feed.map(function(post) {
        var feedText = post.createdBy.facebook.name + ' ';
        if (post.type === ARTICLE) {
          feedText = feedText + 'added an article "' + post.article.title + '"';
        } else if(post.type === HIGHLIGHT) {
          highlight = post.highlight;
          noteLength = highlight.notes.length;
          if(noteLength > 0) {
            postOwner = highlight.notes[noteLength - 1].owner ? highlight.notes[noteLength - 1].owner.name : 'poopOwner';
            feedText = postOwner + ' added a note ';
            feedText = feedText + '"' + highlight.notes[noteLength - 1].content + '" for the highlight ';
            feedText = feedText + '"' + highlight.clippedText + '"';
          } else {
            feedText = feedText + ' added a highlight "' + highlight.clippedText + '"';
          }
        }
        if(feedText.length > 103) {
          feedText = feedText.substring(0, 100) + '...'
        }
        return (
          <div>
          <MenuItem style={
              {
                fontSize: 12,
                lineHeight: 2
              }
            }
            primaryText = {feedText}
            onClick = {getOnFeedPostClickedFunction(post)}/>
          <MenuDivider />
          </div>
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
              <FlatButton
                primary={true}
                label={feedLabel}/>
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
