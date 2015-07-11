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
var Colors = mui.Styles.Colors;
var TextField = mui.TextField;
var FlatButton = mui.FlatButton;
var Avatar = mui.Avatar;

var ARTICLE = 'ArticleFeedPost';
var HIGHLIGHT = 'HighlightFeedPost';

// props:
// - post
// - actions:
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

	_addComment: function() {
		var highlightId = this.props.post.highlight.highlightId;
		var content = this.refs.postNote.getValue();
		this.refs.postNote.clearValue();
		if(content !== '') {
			var note = {
				createdBy: this.state.currentUser,
				createdAt: GroupUtils.getTimestamp(),
				content: content,
				noteId: GroupUtils.generateUUID()
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
        			<CardHeader
        				avatar={<Avatar>A</Avatar>}
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
        						lineHeight: '24px'
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
						<div>
        					<p>Added an article: {article.title}</p>
          					<p>{article.url}</p>
						</div>
        			</CardText>
      			</Card>
			);
		} else if (post.type === HIGHLIGHT) {
				var self = this;
				var highlight = post.highlight;
				var notes = highlight.notes.map(function(note) {
					return (
						<NoteComponent actions={self.state.actions} note={note} user = {self.state.currentUser} />
					);
				});

				var noteList = null;
				var postOwner = post.createdBy.facebook.name;
				var postText =
					<div>
						<p>Added a highlight: </p>
						<p href="/poop" className="highlight-clipped-text"> '' {highlight.clippedText} '' </p>
					</div>
				var noteLength = highlight.notes.length;
				if (noteLength > 0) {
					noteList =
						<div className = "post-comments">
							<List>
								{notes}
							</List>
						</div>
					postOwner = highlight.notes[noteLength - 1].owner ? highlight.notes[noteLength - 1].owner.name : 'poopOwner';
					postText =
						<div>
							<p>Added a note '' {highlight.notes[noteLength - 1].content} '' </p>
							<p>For the highlight '' {highlight.clippedText} '' </p>
						</div>
				}
				return (
					<Card>
						<CardHeader
							avatar={<Avatar>A</Avatar>}
							title = {postOwner}
							subtitle = {highlight.lastModifiedTimestamp}
							style = {
	        					{
	        						padding: 10
	        					}
	        				}
	        				titleStyle = {
	        					{
				        			fontSize: 14,
	        						lineHeight: '24px'
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
	        					<div>
	        						{postText}
									{noteList}
								</div>
								<TextField
		  							hintText=">  Post Note"
		  							ref = 'postNote' />
		  						<FlatButton
		  							linkButton = {false}
		  							label="Post"
		  							primary={true}
		  							onClick = {this._addComment} />
							</CardText>
					</Card>
				);
			}
		}
});

module.exports = FeedPost;
