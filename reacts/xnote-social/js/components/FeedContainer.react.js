var React = require('react');
var FeedStore = require('../stores/FeedStore');
var FeedPost = require('./FeedPost.react.js');

var mui = require('material-ui');
var List = mui.List;
var ListItem = mui.ListItem;
var ListDivider = mui.ListDivider;
var Colors = mui.Styles.Colors;


var FeedContainer = React.createClass({

		//get initial state from stores
		getInitialState: function() {
				return {
						feed: FeedStore.getFeed(),
				}
		},

		componentDidMount: function() {
			FeedStore.addChangeListener(this._onChange);
		},

		componentWillUnmount: function() {
			FeedStore.removeChangeListener(this._onChange);
		},

		render: function() {
			var feed = this.state.feed;
			if (feed.length == 0) {
				return (
					<div className="feed-container">
						<div className="feed-message">
							<p> You have no posts in your feed. </p>
						</div>
					</div>
				)
			}
			var feed = feed.map(function(post) {
				return (
					<div>
						<ListItem disableTouchTap = {true}>
							<FeedPost post={post} />
						</ListItem>
					</div>
				)
			});
			return (
				<div className = "feed-container">
					<List>
						{feed}
					</List>
				</div>
			);
		},

		_onChange: function() {
				this.setState(this.getInitialState());
		}

});

module.exports = FeedContainer;
