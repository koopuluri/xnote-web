var React = require('react');
var GroupActions = require('../actions/GroupActions');

var mui = require('material-ui');
var Card = mui.Card;
var ListItem = mui.ListItem;
var Avatar = mui.Avatar;
var DropDownIcon = mui.DropDownIcon;
var Colors = mui.Styles.Colors;

var ChatPost = React.createClass({
	render: function() {
		var message = this.props.message
		return (
			<ListItem
				disabled={true}
				leftAvatar = {<Avatar size={30}>A</Avatar>}
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
						paddingBottom : 0,
						color : Colors.grey400,
						margin : 0
					}
				}> {message.createdBy.facebook.name} </p>
				<div style={{backgroundColor:Colors.grey100}}>				
					<p style = {
						{
							fontSize : 15,
							fontColor: Colors.grey500,
							padding: 5
						}
					}> {message.content} </p>
				</div>
			</div>
			</ListItem>
		); 
	}
});

module.exports = ChatPost;