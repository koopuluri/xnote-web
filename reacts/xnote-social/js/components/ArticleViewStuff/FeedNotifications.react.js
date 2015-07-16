var mui = require('material-ui');
var FeedNotificationsItem = require('./FeedNotificationsItem.react');

var ListItem = mui.ListItem;
var IconMenu = mui.IconMenu;
var FlatButton = mui.FlatButton;

var Card = mui.Card;
var FontIcon = mui.FontIcon;
var Colors = mui.Styles.Colors;

// state
// - message
var FeedNotifications = React.createClass({
  render: function() {

      var notifs = this.props.notifs;

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
          var feedLabel = '(' + notifs.length + ')'
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
                  <span>
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
                          color:Colors.grey500,
                          "display":"inline-block",
                          margin:0
                         }}>{feedLabel}</p>
                  </span>
              }> 
                <Card 
                  zDepth={0}
                  style = {{
                    maxHeight:400,
                    overflowY:'scroll'
                  }}>
                  {feedNotifsList}  
                </Card>
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
