var React = require('react');
var Actions = require('../../actions/ArticleActions');
var NoteUtils = require('./utils/NoteUtils');
var Annotator = require('./utils/Annotator');
var AddNoteButton = require('./AddNoteButton.react');
var ArticleHeader = require('./ArticleHeader.react');
var Loading = require('./Loading.react');

var ContentStore = require('../../stores/ContentStore');
var GroupStore = require('../../stores/GroupStore');

var mui = require('material-ui');
var Paper = mui.Paper;

var NO_ARTICLE_SELECTED_MESSAGE = 'No content selected. You can add content from the menu on the left.'
var ERROR_MESSAGE_NO_USER = 'Content not found.';
var ERROR_MESSAGE_WITH_USER = 'Content not found. Select different content or add some.'

var HACK_NUM = 0;

var ArticleView = React.createClass({

	getInitialState: function() {
			return {
					article: ContentStore.getSelectedArticle(),
					isLoading: ContentStore.getLoading(),
					selection: null,
					selectionCoordinates: [],
					owner: '',
					currentUser: GroupStore.getCurrentUser(),
					isError: null
	 		};
	},

	// listener callbacks:
	_onArticleChange: function() {
		// reset article:
	//	Annotator.clearAllHighlightsAndComponents();
		var article = ContentStore.getSelectedArticle();
		if ((article && !this.state.article) || (!article && this.state.article) || (!article && !this.state.article)) {
				HACK_NUM = 0;
		} else if (article && this.state.article) {
				if (article._id != this.state.article._id) {
						HACK_NUM = 0;
				}
		} else {
				// don't change the hack num!
		}
		
		this.setState(this.getInitialState());
	},

	componentDidUpdate: function() {
			if (HACK_NUM === 0) {
					Annotator.clearAllHighlightsAndComponents();
					var article = this.state.article;
					if (article && article.serialization) {
							console.log('DESERIALIZE!!!');
							Annotator.deserialize(article.serialization);
					}
					HACK_NUM++;
			}
	},

	componentDidMount: function() {
		// adding listener:
		ContentStore.addChangeListener(this._onArticleChange);
		if (this.props.articleId) {
				Actions.fetchAndSetArticle(this.props.articleId);
		}
	},

	componentWillUnmount: function() {
			console.log('ArticleViewUnmounting');
			// remove listener and highlights:
			ArticleStore.removeChangeListener(this._onArticleChange);
			Annotator.clearHighlights();
	},

	render: function() {
			console.log('ArticleView.RENDER()');
			return (
				<Paper style={{margin: '2px'}} zDepth={1}>
						{this.getRenderredInnerThing()}
				</Paper>
			);
	},

	getRenderredInnerThing: function() {
		var article = this.state.article;


		var errorStyle = {marginTop: '20%', marginLeft: '35%'};

		if (this.state.isError && !this.state.currentUser) {
			return (
					<div className="add-article-error-message" style={errorStyle}>
							{ERROR_MESSAGE_NO_USER}
					</div>
			);
		}

		if (this.state.isError && this.state.currentUser) {
			return (
					<div className="add-article-error-message" style={errorStyle}>
							{ERROR_MESSAGE_WITH_USER}
					</div>
			);
		}

		if (this.state.isLoading) {
				return (
					<div className="poop-article-container">
							<Loading marginTop={20} marginLeft={40}/>
					</div>
				);
		}

		// if no article selected:
		if (!article && this.state.currentUser) {
				return (
					<div className="poop-article-container">
								<div className="add-article-error-message" style={errorStyle}>
										<p> {NO_ARTICLE_SELECTED_MESSAGE} </p>
								</div>
					</div>
				);
		} else if (!article && !this.state.currentUser) {
				return (
						<div className="add-article-error-message" style={errorStyle}>
								{ERROR_MESSAGE_NO_USER}
						</div>
				);
		}

		var content = this.state.article.content;
		console.log('article.content: ' + Object.keys(this.state.article));
		var classNameString = '';
		var formRender = this.state.displayForm;
		var buttonRender = this.state.selection !== null;
		var owner = '';

		if (article && article.owner) {
				owner = this.state.article.owner;
		}

		return (
			<div className="poop-article-container">
					<AddNoteButton
							render={buttonRender}
							onButtonClick={this._onAddNoteButtonClicked}
							x={this.state.selectionCoordinates[0]}
							y={this.state.selectionCoordinates[1]}/>

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
					//Actions.unselectNote();
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
			// adding a highlight:
			newHighlight = {
					highlightId: NoteUtils.generateUUID(),
					articleId: this.state.article._id,
					groupId: GroupStore.getGroupId(),
					clippedText: this.state.selection.toHtml(),
					createdAt: new Date() / 1000,
					selection: Annotator.getSelectionInfo(this.state.selection),
					createdBy: this.state.currentUser,
					notes: [],
					article: this.state.article
			}

			console.log(newHighlight);

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
