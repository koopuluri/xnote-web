var React = require('react');
var ChatStore = require('../stores/ChatStore');
var ChatPost = require('./ChatPost.react.js');

var ChatActions = require('../actions/ChatActions');

var Utils = require('../utils/NoteUtils');

var GroupStore = require('../stores/GroupStore');
var Loading = require('./Loading.react')

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
		isLoading : ChatStore.getLoading(),
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
	},

	componentWillUnmount: function() {
		ChatStore.removeChangeListener(this._onChange);
	},

	_chat: function(content) {
		if (content != '' ) {
			var message = {
				createdBy: this.props.currentUser,
				createdAt: Utils.getTimestamp(),
				content: content,
				chatId: Utils.generateUUID(),
			}
			ChatActions.postChat(message, this.props.groupId);
		}
	},

	render: function() {
		if (this.state.isLoading) {
		    return (
		    	<div className='chat-spinner'>
		    		<Loading marginLeft = {40}/>
		    	</div>
		    );
		} else {
			return (
				<div className = 'chat-container'>
					<ChatScrollContainer currentUser={this.props.currentUser} messages={this.state.messages}/>
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
	}

});

module.exports = ChatContainer;
