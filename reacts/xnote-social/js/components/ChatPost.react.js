var React = require('react');
var GroupActions = require('../actions/GroupActions');

var ChatPost = React.createClass({

	render: function() {
		var message = this.props.message
		return (
			<div className = "message-container">
				<p className = "message-username"> {message.createdBy.name} </p>
				<p className = "message-content"> {message.content} </p>
			</div>
		); 
	}
});

module.exports = ChatPost;