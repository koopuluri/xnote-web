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

var ChatWindow = React.createClass({

	componentDidMount: function() {

		var groupId = this.props.groupId;
		socket = io();
		// fetch and set the chat segment:
		ChatActions.fetchChatSegment(this.props.groupId, 0, ChatStore.SEG_SIZE);
		ChatActions.fetchChatNotifCount(this.props.groupId);
	
		var self = this;		
        socket.on('chat:' + groupId, function(chatObj) {
			if (self.state.mode === CHAT_OPEN) {
				// no need to increment count!
				// in fact send message to server saying I've seen up to latest in chat.
				console.log('clearing chat notifs!');
				ChatActions.clearChatNotifs(groupId);
			}  else {
				// increment count:
				console.log('chat notif count increment!');
				ChatActions.incrementChatNotifCount();
			}
			ChatActions.socketReceiveChat(chatObj.chat);     	
        });
	},

	getInitialState: function() {
		return (
			{ mode: CHAT_CLOSED }
		);
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
			return ({
				mode: CHAT_OPEN
			});
		}
	},

	render: function() {
		console.log('CHAT WINDOW RENDER!' )
		if (this.state.mode === CHAT_CLOSED) {
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
		    					<p style=
		    				 		{
		    				 			{
                          					borderRadius:1000,
                          					paddingLeft:3,
                          					paddingRight:3,
                          					paddingTop:3,
                          					paddingBottom:3,
                          					backgroundColor:Colors.red500,
                          					color:Colors.white,
                          					"display":"inline-block",
                          					margin:0
                         				}
                         			}>
                         			1
                         	</p>
		    			</ListItem>
		    		</Paper>
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
		    				<p style=
		    				 		{
		    				 			{
                          					borderRadius:1000,
                          					paddingLeft:3,
                          					paddingRight:3,
                          					paddingTop:3,
                          					paddingBottom:3,
                          					backgroundColor:Colors.red500,
                          					color:Colors.white,
                          					"display":"inline-block",
                          					margin:0
                         				}
                         			}>
                         			1
                         	</p>
		    			</ListItem>
		    			<ChatContainer
		    				currentUser={this.props.currentUser}
		    				style={{backgroundColor: Colors.grey150}}
		    				groupId={this.props.groupId}/>
		    		</Paper>

				</div>);
		}
	}
});

module.exports = ChatWindow;;
