var React = require('react');
var ChatStore = require('../stores/ChatStore');
var ChatPost = require('./ChatPost.react.js');
var GroupActions = require('../actions/GroupActions');

function getChatState() {
	return {
		messages: ChatStore.getChat(),
	}
}

var ChatContainer = React.createClass({

	//get initial state from stores
	getInitialState: function() {
		return getChatState();
	},

	componentDidMount: function() {
		ChatStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		ChatStore.removeChangeListener(this._onChange);
	},

	_chat: function() {
		var content = this.refs.sendMessage.getDOMNode().value;
		GroupActions.chat(content);
	},

	render: function() {
		var messages = this.state.messages;
		if (messages.length == 0) {
			return (
				<div className="chat-container">
					<div className="chat-message">
						<p> You have no messages in your chat. </p>
					</div>
				</div>
			)
		}
		var messages = messages.map(function(message) {
			return (
				<ChatPost message={message}/>
			);
		})
		return (
			<div className = "chat-container">
				{messages}
				<div className = 'chat-form'>
					<form ref = 'chat-form'>
						<input		
							className = 'chat-form-input' 
							type='text'
							placeholder= 'Send Message'
							ref = 'sendMessage'/>
						<input 
							className = 'chat-message-send-button'
							type = 'button' 
							value = 'Send'
							onClick={this._chat}/>
					</form>
				</div>
			</div>
		);
	},

	_onChange: function() {
		this.setState(getChatState());
	}

});

module.exports = ChatContainer;