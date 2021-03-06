var React = require('react');
var Constants = require('../constants/Constants');
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
		var articleId = '';
		var highlightId = '';
		var groupId = post.group;
		if (post.article) {
			articleId = post.article._id;
		} else if (post.highlight) {
			articleId = post.highlight.article._id;
			highlightId = post.highlight._id;
		}

		window.location = '/article?groupId=' + groupId + '&articleId=' + articleId + '#' + highlightId;
  	}
}
// props:
// - post
// - isLink
// - addNote(note, highlight)
// - removeNote(note, highlight)
// - currentUser
// - getCurrentTimestamp()
// - generateUUID()

var FeedPost = React.createClass({
	getInitialState: function() {
		return {
			highlightBackgroundColor: '#fff'
		}
	},

	_onHighlightMouseOver: function() {
		if (this.props.isLink) {
			this.setState({highlightBackgroundColor: '#e9e9e9'});
		}
	},

	_onHighlightMouseExit: function() {
		if (this.props.isLink) {
			this.setState({highlightBackgroundColor: '#fff'});
		}
	},

	_addComment: function(content) {
		var highlightId = this.props.post.highlight._id;
		if(content !== '') {
			var note = {
				createdBy: this.props.currentUser,
				createdAt: this.props.getCurrentTimestamp(),
				content: content,
				noteId: this.props.generateUUID(),
				owner: this.props.currentUser
			}
			this.props.addNote(highlightId, note);
		}
	},

	render: function() {
		var post = this.props.post;
		var self = this;
		var feedPostOnClick = this.props.isLink ? getFeedPostOnClick(post) : function() {};
		if (post.type === ARTICLE) {
			var article = post.article;
			if(post.createdBy.picture) {
				var leftAvatar = 
					<Avatar src={post.createdBy.picture} size={40} />
			} else {
				var avatarCharacter = post.createdBy.name.substring(0, 1);
				var leftAvatar = <Avatar size={40}>{avatarCharacter}</Avatar>
			}
			return (
				<Card>
					<ListItem
						leftAvatar = {leftAvatar}
						style = {{padding : 10}}
						disabled = {true}
						primaryText= {
							<p style = {{ paddingLeft: 60, paddingTop: 8, fontWeight: 800, fontSize: 13}}> {post.createdBy.name} </p>
						}
						secondaryText = {
							<p style = {{ paddingLeft: 60, fontSize: 10}}> {article.createdAt} </p>
						} 
						rightIconButton = {
							<FlatButton 
								onClick = {feedPostOnClick}
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

				if(post.createdBy.picture) {
					var leftAvatar = 
						<Avatar src={post.createdBy.picture} size={40} />
				} else {
					var avatarCharacter = post.createdBy.name.substring(0, 1);
					var leftAvatar = <Avatar size={40}>{avatarCharacter}</Avatar>
				}

				var highlight = post.highlight;

				var highlightClippedText = '"' + highlight.clippedText + '"';
				var notes = highlight.notes.map(function(note) {
					if (!note.owner) {
						return false;
					}
					return (
						<NoteComponent 
							highlightId = {highlight._id}
							removeNote={self.props.removeNote}
							note={note} 
							user = {self.props.currentUser} />
					);
				});

				var noteList = null;
				var noteLength = highlight.notes.length;
				var articleTitle = highlight.article.title;
				if (noteLength > 0) {
					noteList =
						<div className = "post-comments">
							{notes}
						</div>
				}

				var rightIconButton = '';

				return (
					<Card style={{backgroundColor: '#fafafa'}}>

						<ListItem
							leftAvatar = {leftAvatar}
							style = {{padding : 10, backgroundColor: '#fff'}}
							disabled = {true}
							primaryText= {
								<p style = {{ paddingLeft: 60, paddingTop: 8, fontWeight: 800, fontSize: 13}}> {post.createdBy.name} </p>
							}
							secondaryText = {
								<p style = {{ paddingLeft: 60, fontSize: 10}}> {highlight.lastModifiedTimestamp} </p>
							} 
							rightIconButton = {rightIconButton} />


						<CardText style={{padding: 0}}>
        						<div 
	    							className="highlight-clipped-text" 
    								style = {{
    									cursor: 'pointer',
	        							paddingLeft: 0,
	        							paddingBottom: 0,
	        							fontSize: 15,
	        							backgroundColor: this.state.highlightBackgroundColor }}  
        							onMouseOver={this._onHighlightMouseOver}
        						   	onMouseOut={this._onHighlightMouseExit}
        						   	onClick={feedPostOnClick}>

	        							<div style={{padding : 15, margin: 0, fontSize : 16}} 
	        								dangerouslySetInnerHTML={{__html: highlightClippedText}}>
		        						</div>
		        						<p style={{padding : 15, margin: 0, fontSize : 16, fontWeight: 600}}> 
		        							{articleTitle}
		        						</p>

        						</div>

        						<div className="feedpost-notes-list" 
        							 style={{backgroundColor: '#fafafa',
        									 borderTop: 'solid 1px #d3d3d3'}}>

	        						{noteList}

	        						<MultiLineInput
										width = "51"
										textareaClassName = {"feed-post-text-area" + highlight._id}

			  							startingContent="Post Note"
			  							onSave = {this._addComment} />
        						</div>
        				</CardText>
					</Card>
				);
			}
		}
});

module.exports = FeedPost;
