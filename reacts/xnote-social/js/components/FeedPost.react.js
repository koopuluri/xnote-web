var React = require('react');
var GroupActions = require('../actions/GroupActions');
var ArticleActions = require('../actions/ArticleActions');
var Constants = require('../constants/Constants');
var GroupStore = require('../stores/GroupStore');
var GroupUtils = require('../utils/GroupUtils');

var mui = require('material-ui');
var Card = mui.Card;
var CardTitle = mui.CardTitle;
var CardText = mui.CardText;
var List = mui.List;
var ListItem = mui.ListItem;
var ListDivider = mui.ListDivider;
var Colors = mui.Styles.Colors;
var TextField = mui.TextField;
var FlatButton = mui.FlatButton;
var DropDownIcon = mui.DropDownIcon;

var ARTICLE = 'ArticleFeedPost';
var HIGHLIGHT = 'HighlightFeedPost';

// props:
// - post
// - actions:
var FeedPost = React.createClass({

		getInitialState: function() {
				return {
						actions: this.props.actions ? ArticleActions : GroupActions
				}
		},

		_addComment: function() {
				var highlightId = this.props.post.highlight.highlightId;
				var content = this.refs.postNote.getValue();
				this.refs.postNote.clearValue();
				if(content !== '') {
						var note = {
								createdBy: GroupStore.getCurrentUser(),
								createdAt: GroupUtils.getTimestamp(),
								content: content,
								noteId: GroupUtils.generateUUID(),
								highlightId: highlightId
						}
						this.state.actions.addNote(highlightId, note);
				}
		},

		_menuOptions: function(e, key, payload) {
				if(payload.text === "Delete") {
					this.state.actions.deleteNote(this.props.post.highlight.highlightId,
								payload.note.noteId);
				}
				if(payload.text === "Edit") {
						// wha?
				}
		},

		render: function() {
			var post = this.props.post
			if (post.type === ARTICLE) {
				var article = post.article;
				return (
					<Card>
	        			<CardTitle
	        				title={post.createdBy.facebook.name}
	        				subtitle = {article.createdAt}
	        				style = {
	        					{
	        						padding: 10
	        					}
	        				}
	        				titleStyle = {
	        					{
		        					fontSize: 14,
	        						lineHeight: '14px'
	        					}
							}
							subtitleStyle = {
								{
									fontSize: 10
								}
							} />
	        			<CardText
	        				style = {
	        					{
	        						padding: 10,
	        						fontSize: 16,
	        					}
	        				}>
	        				<p>Added an article: {article.title}</p>
	          				<a href={article.url}>{article.url}</a>
	        			</CardText>
	      			</Card>
				);
			} else if (post.type === HIGHLIGHT) {
				var self = this;
				var highlight = post.highlight;
				var notes = highlight.notes.map(function(note) {
					var noteOptions = [
	  					{ payload: note, text: 'Delete' },
					];
					var options = null
					if (GroupStore.getCurrentUser().facebook.id === note.createdBy.facebook.id) {
						var options =
						<DropDownIcon
							menuItems={noteOptions}
							closeOnMenuItemTouchTap = {true}
							onChange = {self._menuOptions}> + </DropDownIcon>
					}
					var secondaryText =
					<p style = {
						{
							fontSize : 10,
							lineHeight : "10px",
						}
					}> {note.createdAt} </p>
					return (
						<div>
							<ListItem
								secondaryText = {secondaryText}
								disableTouchTap	= {true}
								rightIconButton={options}
								style = {
									{
										fontSize : 16,
										lineHeight : "10px",
										backgroundColor : Colors.green50
									}
								}>
								<p className = 'post-note-username' style = {{fontSize : 12}}>{note.createdBy.facebook.name}</p>
								<p className = 'post-note-content'>{note.content}</p>
							</ListItem>
							<ListDivider />
						</div>
						);
					});
				return (
					<Card>
						<CardTitle
							title = {post.createdBy.facebook.name}
							subtitle = {highlight.lastModifiedTimestamp}
							style = {
	        					{
	        						padding: 10
	        					}
	        				}
	        				titleStyle = {
	        					{
				        			fontSize: 14,
	        						lineHeight: '14px'
	        					}
							}
							subtitleStyle = {
								{
									fontSize: 10
								}
							} />
							<CardText
								style = {
	        						{
	        							padding: 10,
	        							fontSize: 16,
	        						}
	        					}>
	        					<p>Added a highlight: </p>
								<p className = "post-clipped-text"> '' {highlight.clippedText} '' </p>
								<div className = "post-comments">
									<List>
										{notes}
									</List>
								</div>
								<div className = 'note-form'>
										<TextField
		  									hintText="Post Note"
		  									ref = 'postNote' />
		  								<FlatButton
		  									linkButton = {false}
		  									label="Post"
		  									primary={true}
		  									onClick = {this._addComment} />
								</div>
							</CardText>
					</Card>
				);
			}
		}
});

module.exports = FeedPost;
