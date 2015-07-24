var React = require('react');

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
		var currentUser = this.props.currentUser
		var picture = message.createdBy.picture
		if(picture) {
			var leftAvatar = 
				<Avatar src={picture} size={35} />
		} else {
			var avatarCharacter = message.createdBy.name.substring(0, 1);
			var leftAvatar = <Avatar size={35}>{avatarCharacter}</Avatar>
		}
		var textAlign = "left";
		var messageClassName="other-users-messages";
		var messageTextClassName="other-users-messages-text";
		var backgroundColor="#ffffff"
		var messageSenderName =
			<p style = {
						{
							fontSize : 12,
							lineHeight : 1,
							paddingBottom : 3,
							color : Colors.grey400,
							margin : 0
						}
					}> {message.createdBy.name} </p>
		if(currentUser && (currentUser.id === message.createdBy.id)) {
			messageSenderName = (<p></p>);
			messageClassName = "user-messages"
			messageTextClassName = "user-messages-text"
			backgroundColor = Colors.green300;
			textAlign = "right"
		}
		return (
			<div className={messageClassName}>
			<ListItem
				disabled={true}
				leftAvatar = {leftAvatar}
				style={{padding: 0}}>
			<div style={{
				paddingTop : 10,
				paddingBotom: 10,
				paddingLeft :50,
				paddingRight : 30}}>
				<div>
					{messageSenderName}
					<Paper 
						style = {{
							display:"inline-block",
							backgroundColor:backgroundColor
						}}
						zDepth = {1} >				
						<div 
							className={messageTextClassName} 
							style = {
							{	
								display:"inline-block",
								fontSize:15,
								fontColor:Colors.grey500,
								paddingTop:10,
								paddingBottom:5,
								paddingLeft:10,
								paddingRight:10,
								textAlign:textAlign,
								maxWidth:350,
								wordWrap:"break-word"
							}
						}> {message.content} </div>
					</Paper>
				</div>
			</div>
			</ListItem>
			</div>
		); 
	}
});

module.exports = ChatPost;