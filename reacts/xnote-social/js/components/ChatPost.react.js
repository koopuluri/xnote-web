var React = require('react');
var GroupActions = require('../actions/GroupActions');

var mui = require('material-ui');
var List = mui.List;
var ListItem = mui.ListItem;
var ListDivider = mui.ListDivider;
var Avatar = mui.Avatar;
var DropDownIcon = mui.DropDownIcon;

var ChatPost = React.createClass({
	render: function() {
		var message = this.props.message

		return (
			<ListItem
          		leftAvatar={<Avatar>A</Avatar>}
          		secondaryText={message.createdAt} >
				<p className = "message-username"> {message.createdBy.facebook.name} </p>
				<p className = "message-content">  {message.content}</p>
        	</ListItem>
		); 
	}
});

module.exports = ChatPost;