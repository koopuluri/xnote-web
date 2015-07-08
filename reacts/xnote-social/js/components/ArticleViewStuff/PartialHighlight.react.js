var React = require('react');
var Actions = require('../../actions/ArticleActions');
var PartialHighlightStore = require('../../stores/PartialHighlightStore');

// colors:
var SELECTED_NOTE_COLOR = "#FFFF7F";
var UNSELECTED_NOTE_COLOR = "#87cefa";


// requires following props:
// - noteId
// - contentHtml: the html to render in its container.
// - partialNoteId
var PartialHighlight = React.createClass({

	SELECTED_COLOR: "#FFFF7F",
	UNSELECTED_NOTE_COLOR: "#87cefa",

	getInitialState: function() {
			// var selectedNoteId = NoteStore.getSelectedNoteId();
			// var hoveredNoteId = NoteStore.getHoverNoteId();

			var selectedHighlightId = PartialHighlightStore.getSelectedHighlightId();
			var hoverHighlightId = PartialHighlightStore.getHoverHighlightId();

			var isHovered = false;
			var isSelected = false;

			if (hoverHighlightId) {
				isHovered = hoverHighlightId == this.props.highlightId;
			}

			if (selectedHighlightId) {
				isSelected = selectedHighlightId == this.props.highlightId;
			}

			return {
					isHovered: isHovered,
					isSelected: isSelected
			};
	},

	// if note is clicked, then setSelectedNote to this note (in the store):
	_onNoteClick: function(e) {
			var height = e.pageY;
			if (!this.state.isSelected) {
					Actions.fetchAndSetHighlight(this.props.highlightId);
			} else {
				//poop!.
			}
	},

	// if note not selected; change color to SelectedColor
	_handleMouseOver: function() {
			//Actions.hoverNote(this.props.noteId);
			Actions.hoverHighlight(this.props.highlightId);
	},

	// if note not selected; change back color to unSelectedColor
	_handleMouseExit: function() {
			Actions.hoverHighlight(null);
	},

	componentDidMount: function() {
			// setting NoteStore event listener:
			PartialHighlightStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
			PartialHighlightStore.removeChangeListener(this._onChange);
	},


	// renderring the note:
	render: function() {
		// the highlighted text for the note:
		var elementInnerHtml = this.props.content;
		var bgColor = (this.state.isSelected || this.state.isHovered) ? "#FFFF7F" : "#87cefa";
		var style = {
			backgroundColor: bgColor
		};
		var name = "xnote-note-partial-" + this.props.highlightId + ':' + this.props.partialHighlightId;

		return (
			<span className={name}
							onClick={this._onNoteClick}
							onMouseOver={this._handleMouseOver}
							onMouseOut={this._handleMouseExit}
							dangerouslySetInnerHTML={{__html: elementInnerHtml}}
							style={style}>
			</span>
		);
	},

	// called when NoteStore emits "partialNoteChange"
	// resets the isHovered, and isSelected.
	_onChange: function() {
		this.setState(this.getInitialState());
	},

});

module.exports = PartialHighlight;
