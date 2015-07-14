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
			window.location.hash = '#articleId=' + post.highlight.article + '&&highlightId=' + post.highlight._id;
		} else {
			// fuck 
		}
		GroupActions.clearArticleList();
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
		var highlightId = this.props.post.highlight._id;
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
		var self = this;
		if (post.type === ARTICLE) {
			var article = post.article;
			if(post.createdBy.facebook.picture) {
				var leftAvatar = 
					<Avatar src={post.createdBy.facebook.picture} size={30} />
			} else {
				var avatarCharacter = post.createdBy.facebook.name.substring(0, 1);
				var leftAvatar = <Avatar size={30}>{avatarCharacter}</Avatar>
			}
			return (
				<Card>
					<ListItem
						leftAvatar = {leftAvatar}
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
				if(post.createdBy.facebook.picture) {
					var leftAvatar = 
						<Avatar src={post.createdBy.facebook.picture} size={30} />
				} else {
					var avatarCharacter = post.createdBy.facebook.name.substring(0, 1);
					var leftAvatar = <Avatar size={30}>{avatarCharacter}</Avatar>
				}
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
							highlightId = {highlight._id}
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
							leftAvatar = {leftAvatar}
							style = {{padding : 10}}
							disabled = {true}
							primaryText= {
								<p style = {{ paddingLeft: 60, paddingTop: 8, fontWeight: 800, fontSize: 13}}> {post.createdBy.facebook.name} </p>
							}
							secondaryText = {
								<p style = {{ paddingLeft: 60, fontSize: 10}}> {highlight.lastModifiedTimestamp} </p>
							} 

							rightIconButton = {rightIconButton}/>
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
									textareaClassName = {"feed-post-text-area" + highlight._id}

		  							startingContent="Post Note"
		  							onSave = {this._addComment}/>
							</CardText>
					</Card>
				);
			}
		}
});

module.exports = FeedPost;
