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
var ListItem = mui.ListItem;
var ListDivider = mui.ListDivider;
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
        var messageOwner = message.createdBy.facebook.name;
        var messageText = message.createdBy.facebook.name + ' : ' + message.content;

        //Counting characters to see if the list requires two or one line
        var secondaryTextLines = 1;
        if(messageText.length > 67) {
          secondaryTextLines = 2;
        }
        return (
          <ListItem
            secondaryTextLines={2}
            style ={{width : 500}}
            primaryText = {
                  <p style = {
                      {
                        fontSize : 13,
                        lineHeight : 1,
                        fontWeight: 800,
                        paddingBottom : 0,
                      }
                    }>
                    {messageOwner}
                  </p>}
            secondaryText = {
              <p style = {
                    {
                      paddingBottom : 0,
                      fontSize : 16,
                      fontColor : Colors.DarkBlack
                    }
                  }>
                    {messageText}
              </p>
            }/>
        )
      });

      var feedMenu = this.state.feed.map(function(post) {
        var feedOwner = post.createdBy.facebook.name
        if (post.type === ARTICLE) {
          var feedText = 'Added an article "' + post.article.title + '"';
        } else if(post.type === HIGHLIGHT) {
          highlight = post.highlight;
          noteLength = highlight.notes.length;
          if(noteLength > 0) {
            feedOwner = highlight.notes[noteLength - 1].owner ? highlight.notes[noteLength - 1].owner.name : 'poopOwner';
            feedText = 'Added a note ';
            feedText = feedText + '"' + highlight.notes[noteLength - 1].content + '" for the highlight ';
            feedText = feedText + '"' + highlight.clippedText + '"';
          } else {
            feedText = 'Added a highlight "' + highlight.clippedText + '"';
          }
        }

        //Counting characters to see if the list requires two or one line
        var secondaryTextLines = 1;
        if(feedText.length > 67) {
          secondaryTextLines = 2;
        }
        return (
          <div>
          <ListItem 
            secondaryTextLines={secondaryTextLines}
            style = {{width: 500}}
            primaryText = {
                <p style = {
                      {
                        fontSize : 13,
                        lineHeight : 1,
                        fontWeight: 800,
                        paddingBottom : 0,
                      }
                    }>
                    {feedOwner}
                  </p>
                }
            secondaryText = {
              <p style = {
                    {
                      paddingBottom : 0,
                      fontSize : 16,
                      fontColor : Colors.DarkBlack
                    }
                  }>
                    {feedText}
              </p>
            }
            onClick = {getOnFeedPostClickedFunction(post)}/>
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
