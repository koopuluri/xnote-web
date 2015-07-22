var React = require('react');
var ChatContainer = require('./ChatContainer.react');
var MultiLineInput = require('./MultiLineInput.react')

var mui = require('material-ui');
var Paper = mui.Paper;
var ListItem = mui.ListItem;
var FontIcon = mui.FontIcon;
var Colors = mui.Styles.Colors;

var CHAT_OPEN = "ChatOpen";
var CHAT_CLOSED = "ChatClosed";


var ChatWindow = React.createClass({

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
		    					width:500,
		    				}
		    			}>
	    				<ListItem 
	    					onTouchTap={this.toggleState}
		    				style={{width:500, padding:0, backgroundColor:Colors.grey800}} >
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
		    				style={{backgroundColor: Colors.grey150}}
		    				groupId={this.props.groupId}/>
		    		</Paper>

				</div>);
		}
	}
});

module.exports = ChatWindow;;
