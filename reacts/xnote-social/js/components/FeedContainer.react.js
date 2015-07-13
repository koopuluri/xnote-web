var React = require('react');
var FeedStore = require('../stores/FeedStore');
var FeedPost = require('./FeedPost.react.js');
var GroupActions = require('../actions/GroupActions');
var Loading = require('./ArticleViewStuff/Loading.react');
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
				index: FeedStore.getIndex(),
				isLoading: FeedStore.getLoading()
			}
		},

		_onChange: function() {
			this.setState(this.getInitialState());
		},

		componentDidMount: function() {
			FeedStore.addChangeListener(this._onChange);
			GroupActions.fetchFeedSegment(this.props.groupId, 0, 5);
		},

		componentWillUnmount: function() {
			FeedStore.removeChangeListener(this._onChange);
			GroupActions.clearFeed();
		},

		_onScroll: function() {
			var node = this.getDOMNode();
       		if (node.scrollTop + node.clientHeight >= node.scrollHeight) {
	            // load more items:
	            GroupActions.fetchFeedSegment(this.props.groupId, this.state.index, 5);
	        }
		},

		render: function() {
			var feed = this.state.feed;
			if(this.state.isLoading) {
				return(
					<div>
						<Loading marginLeft = {40}/>
					</div>
				);
			} else {
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
							<ListItem disabled={true}>
								<FeedPost post={post} isLink={true}/>
							</ListItem>
						</div>
					)
				});
				return (
					<div className = "feed-container"
						 onScroll={this._onScroll}>
						<List style={{backgroundColor:Colors.grey150}}>
							{feed}
						</List>
					</div>
				);
			}
		},
});

module.exports = FeedContainer;
