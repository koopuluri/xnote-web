var React = require('react');
var GroupActions = require('../actions/GroupActions');

var mui = require('material-ui');
var Card = mui.Card;
var ListItem = mui.ListItem;
var Avatar = mui.Avatar;
var DropDownIcon = mui.DropDownIcon;
var Colors = mui.Styles.Colors;
var Paper = mui.Paper;

var ChatPost = React.createClass({

	render: function() {
		var message = this.props.message
		if(message.createdBy.facebook.picture) {
			var leftAvatar = 
				<Avatar src={message.createdBy.facebook.picture} size={30} />
		} else {
			var avatarCharacter = message.createdBy.facebook.name.substring(0, 1);
			var leftAvatar = <Avatar size={30}>{avatarCharacter}</Avatar>
		}
		return (
			<ListItem
				disabled={true}
				leftAvatar = {leftAvatar}
				style={{padding: 0}}>
			<div style={{
				paddingTop : 10,
				paddingBotom: 10,
				paddingLeft :50,
				paddingRight : 30}}>

				<p style = {
					{
						fontSize : 12,
						lineHeight : 1,
						paddingBottom : 3,
						color : Colors.grey400,
						margin : 0
					}
				}> {message.createdBy.facebook.name} </p>
				<Paper zDepth = {1} >				
					<div style = {
						{
							fontSize : 15,
							fontColor: Colors.grey500,
							paddingTop : 10,
							paddingBottom : 5,
							paddingLeft : 10,
							paddingRight : 10
						}
					}> {message.content} </div>
				</Paper>
			</div>
			</ListItem>
		); 
	}
});

module.exports = ChatPost;