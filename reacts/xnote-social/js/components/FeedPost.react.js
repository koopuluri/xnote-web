var React = require('react');
var GroupActions = require('../actions/GroupActions');
var ArticleActions = require('../actions/ArticleActions');
var Constants = require('../constants/Constants');
var GroupStore = require('../stores/GroupStore');
var GroupUtils = require('../utils/GroupUtils');
var NoteComponent = require('./NoteComponent.react');

var mui = require('material-ui');
var Card = mui.Card;
var CardHeader = mui.CardHeader;
var CardTitle = mui.CardTitle;
var CardText = mui.CardText;
var CardActions = mui.CardActions;
var List = mui.List;
var ListItem = mui.ListItem;
var Colors = mui.Styles.Colors;
var TextField = mui.TextField;
var FlatButton = mui.FlatButton;
var Avatar = mui.Avatar;
var IconButton = mui.IconButton;

var MultiLineInput = require('./MultiLineInput.react.js')

var ARTICLE = 'ArticleFeedPost';
var HIGHLIGHT = 'HighlightFeedPost';


var getFeedPostOnClick = function(post) {
	return function() {
		if (post.type === ARTICLE) {
			window.location.hash = '#articleId=' + post.article._id;
		} else if (post.type === HIGHLIGHT) {
			console.log(post.highlight);
			window.location.hash = '#articleId=' + post.highlight.articleId + '&&highlightId=' + post.highlight.highlightId;
		} else {
			// fuck 
		}
  	}
}

// props:
// - post
// - actions:
// - isLink
var FeedPost = React.createClass({
	getInitialState: function() {
		return {
			currentUser : GroupStore.getCurrentUser(),
			actions: this.props.actions ? ArticleActions : GroupActions
		}
	},

	componentDidMount: function() {
		GroupStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		GroupStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		this.setState(this.getInitialState());
	},

	_addComment: function(content) {
		var highlightId = this.props.post.highlight.highlightId;
		if(content !== '') {
			var note = {
				createdBy: this.state.currentUser,
				createdAt: GroupUtils.getTimestamp(),
				content: content,
				noteId: GroupUtils.generateUUID(),
				owner: this.state.currentUser.facebook
			}
			this.state.actions.addNote(highlightId, note);
		}
	},

	render: function() {
		var post = this.props.post
		if (post.type === ARTICLE) {
			var article = post.article;
			return (
				<Card>
					<ListItem
						leftAvatar = {<Avatar> A </Avatar>}
						style = {{padding : 10}}
						disabled = {true}
						primaryText= {
							<p style = {{ paddingLeft: 60, paddingTop: 8, fontWeight: 800, fontSize: 13}}> {post.createdBy.facebook.name} </p>
						}
						secondaryText = {
							<p style = {{ paddingLeft: 60, fontSize: 10}}> {article.createdAt} </p>
						} 
						rightIconButton = {
							<FlatButton 
								onClick = {getFeedPostOnClick(post)}
								primary = {true}
								style={{
									height:40,
								}}
								label='ARTICLE' />
							}/>
        			<CardText
        				style = {
        					{
        						padding: 10,
        					}
        				}>
						<div>
        					<p style = {{fontSize:14}}>Added an article: {article.title}</p>
          					<p style = {{fontSize:10, color: Colors.grey500}}>{article.url}</p>
						</div>
        			</CardText>
      			</Card>
			);
		} else if (post.type === HIGHLIGHT) {
				var self = this;
				var highlight = post.highlight;
				var highlightClippedText = '';
				if (highlight.clippedText.length > 203) {
					highlightClippedText = '"' + highlight.clippedText.substring(0, 200) + '... "';
				} else {
					highlightClippedText = '"' + highlight.clippedText + '"';
				}
				var notes = highlight.notes.map(function(note) {
					return (
						<NoteComponent 
							highlightId = {highlight.highlightId}
							actions={self.state.actions}
							note={note} 
							user = {self.state.currentUser} />
					);
				});

				var noteList = null;
				var noteLength = highlight.notes.length;
				if (noteLength > 0) {
					noteList =
						<div className = "post-comments">
							{notes}
						</div>
				}

				var rightIconButton = '';
				if (this.props.isLink) {
					rightIconButton = (
								<FlatButton 
									onClick = {getFeedPostOnClick(post)}
									primary = {true}
									style={{
										height:40,
									}}
									label='HIGHLIGHT' />
							);
				}

				return (
					<Card>
						<ListItem
							leftAvatar = {<Avatar> A </Avatar>}
							style = {{padding : 10}}
							disabled = {true}
							primaryText= {
								<p style = {{ paddingLeft: 60, paddingTop: 8, fontWeight: 800, fontSize: 13}}> {post.createdBy.facebook.name} </p>
							}
							secondaryText = {
								<p style = {{ paddingLeft: 60, fontSize: 10}}> {highlight.lastModifiedTimestamp} </p>
							} 

							rightIconButton = {
								<FlatButton 
									onClick = {getFeedPostOnClick(post)}
									primary = {true}
									style={{
										height:40,
									}}
									label='HIGHLIGHT' />
							}/>
							<CardText
								style = {
	        						{
	        							paddingLeft: 15,
	        							paddingBottom: 0,
	        							fontSize: 15,
	        						}
	        					}>
	        					<div>
	        						<p style={{padding : 5, fontSize : 16}}>
	        							{highlightClippedText}
	        						</p>
									{noteList}
								</div>
								<MultiLineInput
									width = "51"
									textareaClassName = {"feed-post-text-area" + highlight.highlightId}

		  							startingContent="Post Note"
		  							onSave = {this._addComment}/>
							</CardText>
					</Card>
				);
			}
		}
});

module.exports = FeedPost;
