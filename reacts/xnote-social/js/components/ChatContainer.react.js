var React = require('react');
var ChatStore = require('../stores/ChatStore');
var ChatPost = require('./ChatPost.react.js');
var GroupActions = require('../actions/GroupActions');

var mui = require('material-ui');
var List = mui.List;
var ListItem = mui.ListItem;
var ListDivider = mui.ListDivider;
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;

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
		var content = this.refs.sendMessage.getValue();
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
				<div>
					<ListItem>
						<ChatPost message={message}/>
					</ListItem>
				</div>
			);
		})

		var ButtonLabelStyle = {
      		container: {
        		textAlign: 'center',
      		},
      		buttonLabel: {
        		padding: '0px 0px 0px 0px'
      		}
		}
		return (
			<div className = "chat-container">
				<List>
					{messages}
				</List>
				<div className = 'chat-form'>
					<TextField
  						hintText="Send Message"
  						ref = 'sendMessage' />
  					<RaisedButton
  						fullWidth = {false}
  						linkButton = {true}
  						label="Send"
  						primary={true}
  						onClick = {this._chat} />
				</div>
			</div>
		);
	},

	_onChange: function() {
		this.setState(getChatState());
	}

});

module.exports = ChatContainer;