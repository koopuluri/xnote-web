var React = require('react');
var ChatStore = require('../stores/ChatStore');
var ChatPost = require('./ChatPost.react.js');
var GroupActions = require('../actions/GroupActions');
var GroupUtils = require('../utils/GroupUtils');
var GroupStore = require('../stores/GroupStore');

var ChatScrollContainer = require('./ChatScrollContainer.react');
var MultiLineInput = require('./MultiLineInput.react')

var mui = require('material-ui');
var List = mui.List;
var ListItem = mui.ListItem;
var ListDivider = mui.ListDivider;
var Card = mui.Card;
var CardTitle = mui.CardTitle;
var CardText = mui.CardText;
var TextField = mui.TextField;
var FlatButton = mui.FlatButton;

var Colors = mui.Styles.Colors;

function getChatState() {
	return {
		messages: ChatStore.getChat(),
		currentUser : GroupStore.getCurrentUser()
	}
}

// props:
// - groupId
// - currentUser
var ChatContainer = React.createClass({

	//get initial state from stores
	getInitialState: function() {
		return getChatState();
	},

	_onChange: function() {
		this.setState(getChatState());
	},

	componentDidMount: function() {
		ChatStore.addChangeListener(this._onChange);
		GroupStore.addChangeListener(this._onChange);
		GroupActions.fetchChatSegment(this.props.groupId, 0, 10);
	},

	componentWillUnmount: function() {
		ChatStore.removeChangeListener(this._onChange);
		GroupStore.removeChangeListener(this._onChange);
		GroupActions.clearChat();
	},

	_chat: function(content) {
		var message = {
				createdBy: this.state.currentUser,
				createdAt: GroupUtils.getTimestamp(),
				content: content,
				chatId: GroupUtils.generateUUID(),
		}
		GroupActions.postChat(message, this.props.groupId);
	},

	render: function() {
		return (
			<div className = 'chat-container' style={{backgroundColor: Colors.white}}>

				<ChatScrollContainer currentUser={this.state.currentUser} messages={this.state.messages}/>

				<div className = 'chat-form' style={{paddingLeft : 10}}>
					<MultiLineInput
						width="59"
						startingContent = 'Send a message'
	  					textareaClassName='chat-post-area'
	  					onSave = {this._chat}/>
				</div>

			</div>
		);
	}

});

module.exports = ChatContainer;
