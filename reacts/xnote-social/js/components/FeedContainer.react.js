var React = require('react');
var FeedStore = require('../stores/FeedStore');
var FeedPost = require('./FeedPost.react.js');

function getFeedState() {
	return {
		feed: FeedStore.getFeed(),
	}
}

var FeedContainer = React.createClass({

	//get initial state from stores
	getInitialState: function() {
		return getFeedState();
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
				<FeedPost post={post}/>
			);
		})
		return (
			<div className = "feed-container">
				{feed}
			</div>
		);
	},

	_onChange: function() {
		this.setState(getFeedState());
	}

});

module.exports = FeedContainer;