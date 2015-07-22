var React = require('react');
var ChatStore = require('../stores/ChatStore');
var ChatPost = require('./ChatPost.react.js');

var ChatActions = require('../actions/ChatActions');
var GroupUtils = require('../utils/GroupUtils');
var GroupStore = require('../stores/GroupStore');
var Loading = require('./ArticleViewStuff/Loading.react')

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
		currentUser : GroupStore.getCurrentUser(),
		isLoading : ChatStore.getLoading(),
	}
}

// props:
// - groupId
var ChatContainer = React.createClass({

	//get initial state from stores
	getInitialState: function() {
		return getChatState();
	},

	_onChange: function() {
		this.setState(getChatState());
	},

	_onGroupChange: function() {
		this.setState({currentUser: GroupStore.getCurrentUser()})
	},

	componentDidMount: function() {
		ChatStore.addChangeListener(this._onChange);
		GroupStore.addChangeListener(this._onGroupChange);
	},

	componentWillUnmount: function() {
		ChatStore.removeChangeListener(this._onChange);
		GroupStore.removeChangeListener(this._onGroupChange);
	},

	_chat: function(content) {
		if (content != '' ) {
			var message = {
				createdBy: this.state.currentUser,
				createdAt: GroupUtils.getTimestamp(),
				content: content,
				chatId: GroupUtils.generateUUID(),
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
	}

});

module.exports = ChatContainer;
