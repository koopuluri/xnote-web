var React = require('react');
var FeedPost = require('./FeedPost.react.js');
var mui = require('material-ui');
var List = mui.List;
var ListItem = mui.ListItem;
var ListDivider = mui.ListDivider;
var Colors = mui.Styles.Colors;
var CircularProgress = mui.CircularProgress;

// props: if (actions passed in, it will use that actions, otherwise it will use GroupActions).
// props:

// - fetchFeedSegment(groupId, start, end)
// - clearFeed()
// - Store
// - addNote(note, highlightId)
// - removeNote(note, highlightId)

// - generateUUID()
// - getCurrentTimestamp()
// - currentUser
// - segSize

var FeedContainer = React.createClass({

		//get initial state from stores
		getInitialState: function() {
			return {
				feed: this.props.FeedStore.getFeed(),
				index: this.props.FeedStore.getIndex(),
				isLoading: this.props.FeedStore.getLoading()
			}
		},

		_onChange: function() {
			this.setState(this.getInitialState());
		},

		componentDidMount: function() {
			this.props.FeedStore.addChangeListener(this._onChange);
			this.props.fetchFeedSegment(this.props.groupId, 0, 10);
		},

		componentWillUnmount: function() {
			this.props.FeedStore.removeChangeListener(this._onChange);
			this.props.clearFeed();
		},

		_onScroll: function() {
			var node = this.getDOMNode();
       		if (node.scrollTop + node.clientHeight >= node.scrollHeight) {
	            // load more items if limit not reached:
	            if (this.props.FeedStore.isLazy()) {
		            this.props.fetchFeedSegment(this.props.groupId, this.state.index, 10);
		        }
	        }
		},

		render: function() {
			var feed = this.state.feed;
			var self = this;

	

			if(this.state.isLoading) {
				return(
					<div className="feed-container" style={this.props.style}>
						<div className="feed-loader" style={{
							marginTop: '30%',
							textAlign: 'center' 
						}}>
							<CircularProgress mode="indeterminate" />
						</div>
					</div>
				);
			} else {
				if (feed.length == 0) {
					return (
						<div className="feed-container" style={this.props.style}>
							<div className="feed-message" style={{
								marginTop: '30%',
								textAlign: 'center' 
							}}>
								<p> You have no posts in your feed. </p>
							</div>
						</div>
					)
				}

				var feedList = feed.map(function(post) {
					return (
						<div>
							<ListItem disabled={true}>
								<FeedPost 
									post={post} 
									currentUser={self.props.currentUser}
									addNote={self.props.addNote}
									removeNote={self.props.removeNote}
									isLink={true}
									generateUUID={self.props.generateUUID}
									getCurrentTimestamp={self.props.getCurrentTimestamp} />
									
							</ListItem>
						</div>
					)
				});

				return (
					<div className = "feed-container"
						 onScroll={this._onScroll}
						 style={this.props.style}>

						<List style={{backgroundColor: Colors.grey150}}>
							{feedList}
						</List>
					</div>
				);
			}
		},
});

module.exports = FeedContainer;