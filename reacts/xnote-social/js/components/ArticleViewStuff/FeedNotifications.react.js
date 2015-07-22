var mui = require('material-ui');
var FeedNotificationsItem = require('./FeedNotificationsItem.react');
var NotifStore = require('../../stores/NotificationStore');

var ListItem = mui.ListItem;
var IconMenu = mui.IconMenu;
var FlatButton = mui.FlatButton;

var Card = mui.Card;
var FontIcon = mui.FontIcon;
var Colors = mui.Styles.Colors;

var GroupActions = require('../../actions/GroupActions');

// props:
// - groupId
var FeedNotifications = React.createClass({

  getInitialState: function() {
      return {
          notifs: NotifStore.getNotifs(),
          count: NotifStore.getUnviewedCount()
      }
  },

  _onChange: function() {
      this.setState(this.getInitialState());
  },

  componentDidMount: function() {
      NotifStore.addChangeListener(this._onChange);
  },

  _onNotifsOpened: function() {
      GroupActions.notifsViewed(this.props.groupId);
  },

  render: function() {
      var notifs = this.state.notifs;
      var self = this;
      var feedNotifsList = notifs.map(function(post) {
          if (post.article) {
              var article = post.article;
              var feedOwner = article.createdBy.facebook.name;
              var feedText = 'Added an article "' + article.title + '"';
          } else if(post.highlight) {
              highlight = post.highlight;
              var feedOwner = highlight.createdBy.facebook.name;
              if(highlight.notes && highlight.notes.length > 0) {
                  var lastNote = highlight.notes[highlight.notes.length - 1];
                  feedOwner = lastNote.owner.name;
                  feedText = 'Added a note ';
                  feedText = feedText + '"' + lastNote.content + '" for the highlight ';
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
              <FeedNotificationsItem 
                secondaryTextLines={secondaryTextLines}
                feedOwner={feedOwner}
                feedText={feedText}
                post={post}/>
          );
      });

      var feedLabel = 'Notifs'
      var feedButton =  
        <FontIcon
            style={{
                color:Colors.grey500,
                paddingTop:8,
                paddingRight:5,
                paddingLeft:5,
                cursor:"pointer"
            }}
            className="material-icons">
                notifications
        </FontIcon>
      if(notifs.length > 0) {
          var count = this.state.count;
          var feedLabel = (count > 0) ? count : '';
          var feedButton = 
              <IconMenu
                menuStyle={{
                  marginTop:25,
                  padding:0
                }}
                style={{
                  paddingRight:5,
                  paddingLeft:5,
                  cursor:"pointer"
                }}
                iconButtonElement={
                  <span onClick={self._onNotifsOpened}>
                    <FontIcon 
                        style={{
                          "display":"inline-block",
                          color:Colors.green500,
                          paddingTop:8
                        }}
                        className="material-icons">
                          notifications
                      </FontIcon>
                      <p style={{
                          borderRadius:1000,
                          paddingLeft:3,
                          paddingRight:3,
                          paddingTop:0,
                          paddingBottom:0,
                          backgroundColor:Colors.red500,
                          color:Colors.white,
                          "display":"inline-block",
                          margin:0
                         }}>{feedLabel}</p>
                  </span>
              }> 
                <div 
                  style = {{
                    maxHeight:400,
                    overflowY:'scroll'
                  }}>
                  {feedNotifsList}  
                </div>
              </IconMenu>
      }
      return (
          <div>
              {feedButton}
          </div>
      );
    }
});

module.exports = FeedNotifications;
