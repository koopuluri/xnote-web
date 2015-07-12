var React = require("react");
var ChatPost = require('./ChatPost.react');

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


// props:
// - messages
// - currentUser
// technique based off of: http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
var ScrollContainer = React.createClass({

	componentWillUpdate: function() {
		var node = this.getDOMNode();
		this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
	},

	componentDidUpdate: function() {
		if (this.shouldScrollBottom) {
			var node = this.getDOMNode();
			node.scrollTop = node.scrollHeight;
		}
	},

	render: function() {
		var messages = this.props.messages;
		var self = this;
		if (messages.length == 0) {
			var messages =
				<div style={{backgroundColor: Colors.grey150}}>
        			<p>  "You have no chat messages." </p>
				</div>;
		} else {
			var messages = messages.map(function(message) {
				return (
					<div style={{backgroundColor: Colors.grey150}}>
						<ChatPost
							message={message}
							user = {self.props.currentUser}/>
					</div>
				);
			});
		}
		return (
			<div className ='chat-messages' style={{backgroundColor: Colors.grey150}}>
   				<List>
					{messages}
				</List>
			</div>
		);
	}
});

module.exports = ScrollContainer;












