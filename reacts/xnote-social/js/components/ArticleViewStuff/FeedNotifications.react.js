var mui = require('material-ui');
var FeedNotificationsItem = require('./FeedNotificationsItem.react');

var ListItem = mui.ListItem;
var IconMenu = mui.IconMenu;
var FlatButton = mui.FlatButton;
var FontIcon = mui.FontIcon;
var Colors = mui.Styles.Colors;
var MenuItem = mui.MenuItem;

// state
// - message
var FeedNotifications = React.createClass({
  render: function() {

      notifs = this.props.notifs;
      console.log(notifs);

      var feedNotifsList = notifs.map(function(post) {
          if (post.article) {
              var article = post.article;
              var feedOwner = article.createdBy.facebook.name;
              var feedText = 'Added an article "' + article.title + '"';
          } else if(post.highlight) {
              highlight = post.highlight;
              var feedOwner = highlight.createdBy.facebook.name;
              if(post.notes && post.notes.length > 0) {
                  feedOwner = highlight.notes[-1].owner;
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
              <FeedNotificationsItem 
                secondaryTextLines={secondaryTextLines}
                feedOwner={feedOwner}
                feedText={feedText}
                post={post}/>
          );
      });
      var feedLabel = 'Notifs'
      var feedButton =  <FontIcon 
                          style={{
                            color:Colors.green500,
                          }}
                          className="material-icons">
                              notifications
                        </FontIcon>
      if(notifs.length > 0) {
          var feedLabel = '(' + notifs.length + ')'
          var feedButton = 
              <IconMenu iconButtonElement={
                  <MenuItem>
                  <FontIcon 
                      style={{
                        color:Colors.green500,
                        paddingTop:10
                      }}
                      className="material-icons">
                        notifications
                  </FontIcon>
                  <p>{feedLabel}</p>
                  </MenuItem>
              }>
                  {feedNotifsList}  
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
