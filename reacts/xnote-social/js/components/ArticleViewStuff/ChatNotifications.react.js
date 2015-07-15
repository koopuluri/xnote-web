var mui = require('material-ui');
var ChatNotificationsItem = require('./FeedNotificationsItem.react');

var ListItem = mui.ListItem;
var IconMenu = mui.IconMenu;
var FlatButton = mui.FlatButton;

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
      <FlatButton 
        style={{paddingTop:4}} 
        primary={true} 
        label={chatLabel}/> 
      
    if(chatNotifs > 0) {
      var chatLabel = 'Chat (' + chatNotifs + ')'
      var chatButton = 
        <IconMenu iconButtonElement={
          <FlatButton 
            style={{paddingTop:4}}
            primary={true}
            label={chatLabel} />
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
