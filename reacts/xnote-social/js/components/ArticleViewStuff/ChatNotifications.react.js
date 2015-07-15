var mui = require('material-ui');
var ChatNotificationsItem = require('./FeedNotificationsItem.react');

var ListItem = mui.ListItem;
var IconMenu = mui.IconMenu;
var FlatButton = mui.FlatButton;
var FontIcon = mui.FontIcon;
var Colors = mui.Styles.Colors;

// state:
// - message
var ChatNotifications = React.createClass({

  render: function() {
    //notifs calculated separately so that the currentUser notifs can be removed 
    var chatNotifs = this.props.chatNotifs;
    var chatNotifsList = this.props.chat.map(function(message) {
      if (message.createdBy.facebook.id === this.state.currentUser.facebook.id) {
        chatNotifs--;
        return;
      }
      var messageOwner = message.createdBy.facebook.name;
      var messageText = message.createdBy.facebook.name + ' : ' + message.content;
      //Counting characters to see if the list requires two or one line
      var secondaryTextLines = 1;
      if(messageText.length > 67) {
        secondaryTextLines = 2;
      }
      return (
        <ChatNotificationsItem 
          messageText={messageText}
          messageOwner={messageOwner} />
      )
    });

    var chatLabel = 'Chat'
    var chatButton = 
      <FontIcon 
          style={{
            color:Colors.green500,
            paddingTop:8,
            paddingLeft:5,
            paddingRight:5,
            cursor:"pointer"
          }}
          className="material-icons">
            message
      </FontIcon> 
      
    if(chatNotifs > 0) {
      var chatLabel = '(' + chatNotifs + ')'
      var chatButton = 
         <IconMenu 
            style= {{
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
                          message
                    </FontIcon>
                    <p style={{
                        "display":"inline-block",
                        margin:0
                    }}>{chatLabel}</p>
                  </span>
              }>
                  {ChatNotifications}  
        </IconMenu>
    }
    return (
      <div>
        {chatButton}
      </div>
    );
  }
});

module.exports = ChatNotifications;
