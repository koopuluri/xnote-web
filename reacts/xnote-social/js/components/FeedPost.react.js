var React = require('react');
var GroupActions = require('../actions/GroupActions');

var FeedPost = React.createClass({

	_addComment: function() {
		var highlightId = this.props.post.object.highlightId;
		var content = this.refs.postNote.getDOMNode().value;
		GroupActions.addNote(highlightId, content);
	},

	render: function() {
		var post = this.props.post
		if (post.type === 'ARTICLE') {
			var article = post.object
			return (
				<div className = "post-container">
					<p className = "post-username"> {article.createdBy.name} </p>
					<p className = "post-content"> Added an article {article.title} </p>
					<p className = "post-article-url"> {article.url} </p>
				</div>
			);
		} else if (post.type === 'NOTE') {
			var highlight = post.object
			var notes = highlight.notes.map(function(note) {
				return (
					<div className = 'post-note'>
						<p className = 'post-note-username' style={{marginLeft: '20px'}}>{note.createdBy.name}</p>
						<p className = 'post-note-content' style={{marginLeft: '20px'}}>{note.content}</p>
					</div>
				);
			});
			return (
				<div className = "post-container">
					<p className = "post-username"> {highlight.createdBy.name} </p>
					<p className = "post-clipped-text"> {highlight.clippedText} </p>
					<p className = "post-article-url"> {highlight.article.url} </p>
					<div className = "post-comments">
						{notes}
					</div>
					<div className = 'note-form'>
						<form ref = 'note-form' style={{marginLeft: '20px'}}>
							<input
								className = 'note-form-input' 
								type='text'
								placeholder='Post Note'
								ref = 'postNote'/>
							<input 
								className = 'note-form-post-button'
								type = 'button' 
								value = 'Post'
								onClick={this._addComment}/>
						</form>
					</div>
				</div>
			);
		}
	}
});

module.exports = FeedPost;