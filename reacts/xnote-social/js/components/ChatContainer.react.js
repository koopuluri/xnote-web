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
		var message = {
			createdBy: this.state.currentUser,
			createdAt: GroupUtils.getTimestamp(),
			content: content,
			messageId: GroupUtils.generateUUID(),		
		}
		GroupActions.chat(message);
	},

	render: function() {
		var messages = this.state.messages;

		if (!messages) {
				return (<div className="chat-container"></div>);
		}

		if (messages.length == 0) {
			return (
				<div className="chat-container">
					<List>
					<ListItem disableTouchTap = {true}>
					<Card>
						<CardTitle
        					subtitle = "You have no chat messages."
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
						<CardText
							style = {
        						{
        							padding: 10,
        							fontSize: 16,
        						}
        					}>
							<TextField
  								hintText="Send Message"
  								ref = 'sendMessage' />
  							<FlatButton
	  							linkButton = {false}
  								label="Send"
  								primary={true}
  								onClick = {this._chat} />
						</CardText>
					</Card>
					</ListItem>
					</List>
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
  					<FlatButton
  						fullWidth = {false}
  						linkButton = {false}
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
