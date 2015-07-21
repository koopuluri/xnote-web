var React = require('react');
var Actions = require('../actions/ArticleActions');
var NoteUtils = require('../utils/NoteUtils');
var Annotator = require('../utils/Annotator');
var AddNoteButton = require('./AddNoteButton.react');
var ArticleHeader = require('./ArticleHeader.react');
var Loading = require('./Loading.react');

var ArticleStore = require('../stores/ArticleStore');
var GroupStore = require('../stores/GroupStore');

var mui = require('material-ui');
var Paper = mui.Paper;

var ERROR_MESSAGE = 'Content not found. The article could not be parsed';

var NO_ARTICLE_MESSAGE = 'Article not found. You may not have the'
									+ ' required permissions to view this article.'		


var HACK_NUM = 0;

var ArticleView = React.createClass({

	getInitialState: function() {
		return {
				article: ArticleStore.getSelectedArticle(),
				isLoading: ArticleStore.getLoading(),
				selection: null,
				selectionCoordinates: [],
				owner: '',
				currentUser: GroupStore.getCurrentUser(),
				isError: null,
 		};
	},

	componentDidUpdate: function() {
		if (HACK_NUM === 0  && this.state.article) {
				Annotator.clearAllHighlightsAndComponents();
				var article = this.state.article;
				if (article && article.serialization) {
						Annotator.deserialize(article.serialization);
				}
				HACK_NUM++;
		}
	},

	componentDidMount: function() {
		// adding listener:
		ArticleStore.addChangeListener(this._onChange);
		if (this.props.articleId) {
			Actions.fetchAndSetArticle(this.props.articleId);
		}
		if (this.props.highlightId) {
			Actions.fetchAndSetHighlight(this.props.highlightId);
			Actions.setPartialHighlight(this.props.highlightId);
		}

		
	},

	componentWillUnmount: function() {
		// remove listener and highlights:
		ArticleStore.removeChangeListener(this._onChange);
		Annotator.clearAllHighlightsAndComponents();
	},

	_onChange: function() {
		this.setState(this.getInitialState());
	},

	render: function() {
		return (
			<Paper style={{margin: '2px', 'height':'100%'}} zDepth={1} >
				{this.getRenderredInnerThing()}
			</Paper>
		);
	},

	getRenderredInnerThing: function() {
		var article = this.state.article;
		var errorStyle = {marginTop: '20%', marginLeft: '35%'};
		if (this.state.isError) {
			return (
					<div className="add-article-error-message" style={errorStyle}>
							{ERROR_MESSAGE}
					</div>
			);
		}

		if (this.state.isLoading) {
			return (
				<div className="poop-article-container">
					<Loading marginTop={20} marginLeft={45}/>
				</div>
			);
		}

		// if no article selected:
		if (!article) {
			return (
				<div className="poop-article-container">
					<div className="add-article-error-message" style={errorStyle}>
						<p> {NO_ARTICLE_MESSAGE} </p>
					</div>
				</div>
			);
		}

		var content = this.state.article.content;
		var classNameString = '';
		var formRender = this.state.displayForm;
		var buttonRender = this.state.selection !== null;
		var owner = '';

		if (article && article.owner) {
			owner = this.state.article.owner;
		}

		return (
			<div className="poop-article-container">
					<ArticleHeader
							mouseUp={this._articleHeaderMouseUp}
							title={this.state.article.title}
							timestamp={this.state.article.timestamp}
							author={this.state.article.author}
							url={this.state.article.url}
							owner={this.state.owner} />

					<div className="article-content"
						 onMouseUp={this._onMouseUp}
						 dangerouslySetInnerHTML={{__html: content}}>
					</div>

					<AddNoteButton
							render={buttonRender}
							onButtonClick={this._onAddNoteButtonClicked}
							x={this.state.selectionCoordinates[0]}
							y={this.state.selectionCoordinates[1]}/>

			</div>
		);
	},


	// on mouse up, check if a selection has been made, and then
	_onMouseUp: function(e) {
			var sel = Annotator.getSelection();
			var html = sel.toHtml();
			if (html && !Annotator.overlaps(sel.getRangeAt(0))) {
					var coords = []
					coords.push(e.clientX);
					coords.push(e.clientY);
					// hold on to this selection:
					this.setState({
							selection: sel,
							selectionCoordinates: coords
					});
			} else {
					// show user a message about how they can't take overlapping highlights!
					if (this.state.selection) {
							this.setState({
									selection: null,
									selectionCoordinates: [-1, -1],
							});
					}
			}
	},

	// want to display form
	_onAddNoteButtonClicked: function() {
			var newHighId = NoteUtils.generateUUID();
			// adding a highlight:
			newHighlight = {
					_id: newHighId,
					group: GroupStore.getGroupId(),
					clippedText: this.state.selection.toHtml(),
					createdAt: new Date() / 1000,
					selection: Annotator.getSelectionInfo(this.state.selection),
					createdBy: this.state.currentUser,
					notes: [],
					article: this.state.article
			}

			Annotator.addHighlight(newHighlight);

			Actions.addHighlight(newHighlight, Annotator.serialize());

			this.setState({selection: null});
	},

	// remove selection; remove the add-note-button if exists.
	_articleHeaderMouseUp: function() {
			if (this.state.selection) {
					this.setState({selection: null});
			}
	}
});

module.exports = ArticleView;
