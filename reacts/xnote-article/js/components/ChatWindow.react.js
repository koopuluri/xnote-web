var React = require('react');
var ChatContainer = require('./ChatContainer.react');

var ChatActions = require('../actions/ChatActions');
var ChatStore = require('../stores/ChatStore');

var mui = require('material-ui');
var Paper = mui.Paper;
var ListItem = mui.ListItem;
var FontIcon = mui.FontIcon;
var Colors = mui.Styles.Colors;

var CHAT_OPEN = "ChatOpen";
var CHAT_CLOSED = "ChatClosed";

// props:
// - groupId
// - currentUser

var ChatWindow = React.createClass({

	getInitialState: function() {
		return (
			{ 
				mode: CHAT_CLOSED,
				chatNotifs: ChatStore.getNotifCount()
			}
		);
	},

	componentDidMount: function() {
		var groupId = this.props.groupId;
		socket = io();
		// fetch and set the chat segment:
		ChatActions.fetchChatSegment(this.props.groupId, 0, 9);
		ChatActions.fetchChatNotifCount(this.props.groupId);
	
		var self = this;		
        socket.on('chat:' + groupId, function(chatObj) {
			if (self.state.mode === CHAT_OPEN) {
				// no need to increment count!
				// in fact send message to server saying I've seen up to latest in chat.
				ChatActions.clearChatNotifs(groupId);
			}  else {
				// increment count:
				ChatActions.incrementChatNotifCount();
			}
			var _lastAddedChatId = ChatStore.getLastAddedChatId();
			if (! (_lastAddedChatId && _lastAddedChatId == chatObj.chat.chatId) ) {
				React.findDOMNode(self.refs.chatNotificationSound).play();
			}
			ChatActions.socketReceiveChat(chatObj.chat);     	
        });
        ChatStore.addChangeListener(this._onChange); 
	},

	_onChange: function() {
		this.setState({
			chatNotifs: ChatStore.getNotifCount()
		})
	},

	toggleState: function() {
		this.setState(this._toggleMode);
	},

	_toggleMode: function() {
		if(this.state.mode === CHAT_OPEN) {
			return ({
				mode : CHAT_CLOSED
			});
		} else if(this.state.mode === CHAT_CLOSED) {
			ChatActions.clearChatNotifs(this.props.groupId);
			return ({
				mode: CHAT_OPEN
			});
		}
	},

	render: function() {
		if (this.state.mode === CHAT_CLOSED) {
			var notifCount = '';
			if(this.state.chatNotifs > 0) {
				var notifCount = 
					<p style=
				 		{
				 			{
			  					borderRadius:1000,
		                        fontSize:10,
		                        paddingLeft:5,
		                        paddingRight:5,
		                        paddingTop:3,
		                        paddingBottom:2,
		                        backgroundColor:Colors.red500,
		                        color:Colors.white,
		                        "display":"inline-block",
		                        margin:0
			 				}
			 			}>
			 			{this.state.chatNotifs}
			 		</p>
			}
		    return (
		    	<div className = "chat-window"
		    		 style={{padding:0}}>
		    		<Paper 
		    			rounded={true}
		    			style={
		    				{
		    					padding:0,
		    					maxHeight:50,
		    					backgroundColor:Colors.grey800 
		    				}
		    			}>

		    			<ListItem 
		    				onTouchTap={this.toggleState}
		    				style={{width:250, padding:0}} >
		    					<FontIcon 
		    						className="material-icons"
		    						style={
		    							{
		    								padding:0,
		    								color:"#FFFFFF"
		    							}
			    					}>
			    						message
		    					</FontIcon>
		    					{notifCount}
		    			</ListItem>
		    		</Paper>
		    		<audio ref="chatNotificationSound"
	                    src = '/static/ChatNotification.mp3'/>
		    	</div>
		    );
		} else {
			return (
				<div className = "chat-window"
		    		style={{padding:0}}>
		    		<Paper 
			    		rounded={true}
		    			style={
			    			{
		    					padding:0,
		    					maxHeight:500,
		    					width:450,
		    				}
		    			}>
	    				<ListItem 
	    					onTouchTap={this.toggleState}
		    				style={{width:450, padding:0, backgroundColor:Colors.grey800}} >
    						<FontIcon 
	    						className="material-icons"
    							style={
		    							{
    										padding:0,
		    								color:"#FFFFFF"
		    							}
			   						}>
			    						message
		    				</FontIcon>
		    			</ListItem>
		    			<ChatContainer
		    				currentUser={this.props.currentUser}
		    				style={{backgroundColor: Colors.grey150}}
		    				groupId={this.props.groupId}/>
		    		</Paper>
		    		<audio ref="chatNotificationSound"
	                    src = '/static/ChatNotification.mp3'/>
				</div>
			);
		}
	}
});

module.exports = ChatWindow;;
