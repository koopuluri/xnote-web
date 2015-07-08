var React = require('react');
var GroupActions = require('../actions/ArticleActions');
var Constants = require('../constants/Constants');

var mui = require('material-ui');
var Card = mui.Card;
var CardTitle = mui.CardTitle;
var CardText = mui.CardText;
var List = mui.List;
var ListItem = mui.ListItem;
var ListDivider = ListDivider;
var Colors = mui.Styles.Colors;
var TextField = mui.TextField;
var FlatButton = mui.FlatButton;

var ARTICLE = 'ArticleFeedPost';
var HIGHLIGHT = 'HighlightFeedPost';

var FeedPost = React.createClass({

	_addComment: function() {
		var highlightId = this.props.post.object.highlightId;
		var content = this.refs.postNote.getValue();
		if(content !== '') {
			GroupActions.addNote(highlightId, content);
		}
	},

	render: function() {
		var post = this.props.post;

		if (post.type === ARTICLE) {
				var article = post.article;
				return (
					<Card>
        			<CardTitle title={post.createdBy.facebook.name} />
        			<CardText>
          			<p>Added an article {article.title} </p>
          			<p>{article.url} </p>
        			</CardText>
      		</Card>
				);
		} else if (post.type === HIGHLIGHT) {
				var highlight = post.highlight;

				var notes = highlight.notes.map(function(note) {
						return (
							<div>
								<ListItem>
									<p className = 'post-note-username' style={{marginLeft: '20px'}}>{note.createdBy}</p>
									<p className = 'post-note-content' style={{marginLeft: '20px'}}>{note.content}</p>
								</ListItem>
							</div>
						);
				});

				return (
					<Card>
						<CardTitle title = {post.createdBy.facebook.name} />

						<CardText>

							<p className = 'post-note-type'> Added a note </p>
							<p className = "post-clipped-text"> '' {highlight.clippedText} '' </p>
							<p className = "post-article-url"> {highlight.article.url} </p>
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
	  									linkButton = {true}
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
