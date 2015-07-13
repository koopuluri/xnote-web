var React = require('react');

var mui = require('material-ui');
var Colors = mui.Styles.Colors;
var ListItem = mui.ListItem;


// state:
// - message
var ChatNotificationsItem = React.createClass({
  render: function() {
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
               {this.props.messageOwner}
            </p>}
          secondaryText = {
            <p style = {
              {
                paddingBottom : 0,
                fontSize : 16,
                fontColor : Colors.DarkBlack
              }
            }>
              {this.props.messageText}
            </p>
        }/>
      );
  }
});

module.exports = ChatNotificationsItem;


