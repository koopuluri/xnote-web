var React = require('react');
var ChatStore = require('../stores/ChatStore');
var ChatPost = require('./ChatPost.react.js');
var GroupActions = require('../actions/GroupActions');
var GroupUtils = require('../utils/GroupUtils');
var GroupStore = require('../stores/GroupStore');

var mui = require('material-ui');
var List = mui.List;
var ListItem = mui.ListItem;
var ListDivider = mui.ListDivider;
var Card = mui.Card;
var CardTitle = mui.CardTitle;
var CardText = mui.CardText;
var TextField = mui.TextField;
var FlatButton = mui.FlatButton;

function getChatState() {
	return {
		messages: ChatStore.getChat(),
		currentUser : GroupStore.getCurrentUser(),
	}
}

var ChatContainer = React.createClass({

	//get initial state from stores
	getInitialState: function() {
		return getChatState();
	},

	componentDidMount: function() {
		ChatStore.addChangeListener(this._onChange);
		GroupStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		ChatStore.removeChangeListener(this._onChange);
		GroupStore.removeChangeListener(this._onChange);
	},

	_chat: function() {
		var content = this.refs.sendMessage.getValue();
		this.refs.sendMessage.clearValue();
		var message = {
				createdBy: this.state.currentUser,
				createdAt: GroupUtils.getTimestamp(),
				content: content,
				messageId: GroupUtils.generateUUID()
		}
		GroupActions.chat(message);
	},

	render: function() {
		var messages = this.state.messages;
		var self = this;

		if (messages.length == 0) {
			var messages =
				<CardTitle
        			title = "You have no chat messages."
        			style = {
	        			{
        					padding: 10
        				}
	        		}
        			titleStyle = {
	        			{
	        				fontSize: 14,
        					lineHeight: '14px'
        				}
					}
					subtitleStyle = {
						{
							fontSize: 10
						}
					} />
		} else {
			var messages = messages.map(function(message) {
				return (
					<div>
						<ChatPost
							message={message}
							user = {self.state.currentUser}/>
					</div>
				);
			});
		}

		return (
			<div className = 'chat-container'>
				<div className ='chat-messages'>
					<Card className = 'chat-messages-card'>
        				<List>
							{messages}
						</List>
					</Card>
					</div>
					<div className = 'chat-form'>
					<Card>
						<TextField
  							hintText="> Send Message"
  							ref = 'sendMessage' />
  						<FlatButton
	  						fullWidth = {false}
  							linkButton = {false}
  							label="Send"
  							primary={true}
  							onClick = {this._chat} />
  					</Card>
					</div>
			</div>
		);
	},

	_onChange: function() {
		this.setState(getChatState());
	}

});

module.exports = ChatContainer;
