var React = require('react');

var Utils = require('./utils/NoteUtils');

// expects props:
// - title
// - timestamp
// - url
// - author
// - mouseUp (func)
var ArticleHeader = React.createClass({

	// renders the article's title, author, timestamp, originalUrl
	render: function() {
		return (
			<div className="article-header" onMouseUp={this.props.mouseUp}>
				<div className="row">
					<div className="article-title col-md-12">
						{this.props.title}
					</div>
				</div>

				<div className="row">
					<div className="article-author-date col-md-4">
						<div className="article-author"> {this.props.author} </div>
						<div className="article-date"> {Utils._secondsToDate(this.props.timestamp)} </div>
					</div>

					<div className="article-url col-md-8">
						<a href={this.props.url}>{this.props.url}</a>
					</div>

				</div>
				<div className = "row">
						<div className="article-owner col-md-4"> Annotation started by: {this.props.owner} </div>
				</div>
			</div>
		);
	},
});

module.exports = ArticleHeader;
