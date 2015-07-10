var React = require('react');
var XnoteConstants = require('../../../constants/Constants');
var PartialHighlight = require('../PartialHighlight.react');


// this file is where all the annotation logic resides.
// using rangy-core (@author: timdown).
var highlighter;
// obtained from: http://home.arcor.de/martin.honnen/javascript/storingSelection1.html
function makeXPath (node, currentPath) {
  /* this should suffice in HTML documents for selectable nodes, XML with namespaces needs more code */
  currentPath = currentPath || '';
  switch (node.nodeType) {
    case 3:
    case 4:
      return makeXPath(node.parentNode, 'text()[' +
	      	(document.evaluate('preceding-sibling::text()', node, null,
      		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength + 1) + ']');

    case 1:
      return makeXPath(node.parentNode, node.nodeName + '[' +
	      	(document.evaluate('preceding-sibling::' + node.nodeName,
      		node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength + 1) +
      		']' + (currentPath ? '/' + currentPath : ''));

    case 9:
      return '/' + currentPath;
    default:
      return '';
  }
}


// keeps track of:
// - rangy highlights
// - adding removing partial note components.
// - checking for overlap when adding notes. (addNote(), removeNote()).

var partialNoteComponentNodes = [];

Annotator = {

	_init: function() {
		if (!highlighter) {
			rangy.init();
		  highlighter = rangy.createHighlighter();
		}
	},

  // clear all rangy highlights:
  clearAllHighlightsAndComponents: function() {
      this._init();
      // first unmounting the components:
      for (var i = 0; i < partialNoteComponentNodes.length; i++) {
          var node = partialNoteComponentNodes[i];
          React.unmountComponentAtNode(node);
      }

      highlighter.removeAllHighlights();
  },

  // by: http://stackoverflow.com/a/3410557
  _getIndicesOf: function(searchStr, str, caseSensitive) {
      var startIndex = 0, searchStrLen = searchStr.length;
      var index, indices = [];
      if (!caseSensitive) {
          str = str.toLowerCase();
          searchStr = searchStr.toLowerCase();
      }
      while ((index = str.indexOf(searchStr, startIndex)) > -1) {
          indices.push(index);
          startIndex = index + searchStrLen;
      }
      return indices;
  },

	serialize: function() {
		  return highlighter.serialize();
	},

	deserialize: function(serialization) {
      this._init();
      // find all of the highlight ids in the serialization:
      var indices = this._getIndicesOf(XnoteConstants.BASE_HIGHLIGHT_CLASS, serialization, false);
      var highlightIds = []
      for (var i = 0; i < indices.length; i++) {
          var index = indices[i];
          var className = serialization.slice(index, (index + 1 + XnoteConstants.BASE_HIGHLIGHT_CLASS.length) + 36);
          highlighter.addClassApplier(rangy.createCssClassApplier(className, {
        		        tagNames: ["span", "a", "p"]
        		    }));

          // adding the discussion id:
          highlightIds.push(className.slice(XnoteConstants.BASE_HIGHLIGHT_CLASS.length+1, className.length));
      }

      //  now deserializing:
      highlighter.deserialize(serialization);

      // now renderring all partial notes:
      for (i = 0; i < highlightIds.length; i++) {

          var id = highlightIds[i];
          this._renderPartialHighlights(id);
      }
	},

//BASE_HIGHLIGHT_CLASS-8f32e2ef-8558-477a-a096-fe544a08f641
//BASE_HIGHLIGHT_CLASS-8f32e2ef-8558-477a-a096-fe544a08f641

	// for a given highlight object, renders the PartialNotes associated with it.
	_renderPartialHighlights: function(highId) {
  		// get all elements associated with this note:
  		var className = XnoteConstants.BASE_HIGHLIGHT_CLASS + "-" + highId;
  		var elements = $('.' + className);
  		elements.map(function(index) {
    			// render PartialNote for this element:
    			React.render(<PartialHighlight
    							highlightId={highId}
    							partialHighlightId={index}
    							content={this.innerHTML} />, this);

          // keeping references to the elements that the components are added to:
          partialNoteComponentNodes.push(this);
  		});
	},

  _highlightSelection: function(sel, id) {
  		var className = XnoteConstants.BASE_HIGHLIGHT_CLASS + '-' + id;
  		highlighter.addClassApplier(rangy.createCssClassApplier(className, {
  	        tagNames: ["span", "a"]
  	    }));

  		// highlighting the selection using the given className
  		highlighter.highlightSelection(className, {selection: sel});
	},

	// adding a new note:
	// - add rangy highlights.
	// - add all PartialNotes associated with this note (len(partialNotes) == len(# rangy highlights));
	addHighlight: function(highlight) {
  		this.highlightFromSelectionInfo(highlight.selection, highlight.highlightId);
  		this._renderPartialHighlights(highlight.highlightId);
	},

	// deleting a note:
	// - first remove the PartialNote components associated with this note.
	// - then remove the rangy.highlights that were set for this note.
	deleteNote: function(noteId) {
  		var className = XnoteConstants.BASE_HIGHLIGHT_CLASS + '-' + noteId;
  		var elements = document.getElementsByClassName(className);

  		// remove PartialNote components for this note:
  		highlights = []
  		for (var i = 0; i < elements.length; i++) {
    			var el = elements[i];
    			// grab html contained by the PartialNote component before unmounting it:
    			var childNodeInnerHtml = el.childNodes[0].innerHTML;
    			React.unmountComponentAtNode(el);
    			// setting the inner html of the element with what was inside the component div:
    			el.innerHTML = childNodeInnerHtml;

    			highlights.push(highlighter.getHighlightForElement(el));
  		}

  		// removing highlights:
  		highlighter.removeHighlights(highlights);
	},

	// returns the start and end indices of selection.
	getIndices: function() {
		var sel = rangy.getSelection();
		// calculating the ABSOLUTE start and end indices of this selection:
		var startNode = sel.anchorNode;
		var startOffset = sel.anchorOffset;
		var endNode = sel.focusNode;
		var endOffset = sel.focusOffset;
	},

	// this is used to generate a selection dict from a selection
	//  that contains information to reproduce this selection in the future.
	getSelectionInfo: function(sel) {
		return {
			startPath: makeXPath(sel.anchorNode),
			endPath: makeXPath(sel.focusNode),
			startOffset: sel.anchorOffset,
			endOffset: sel.focusOffset,
			isBackwards: sel.isBackwards(),
			isCollapsed: sel.isCollapsed
		}
	},

	// given selInfo, adds highlight to the html page:
	highlightFromSelectionInfo: function(selInfo, id) {
		var range = this._getRangeFromInfo(selInfo);
		var sel = rangy.getSelection();
		sel.setSingleRange(range);
		this._highlightSelection(sel, id);
	},

	// selInfo is a dict containing the above keys.
	_getRangeFromInfo: function(selInfo) {
		var range = rangy.createRange();

		if (selInfo.isCollapsed) {
			return null;
		}

		if (!selInfo.isBackwards) {
			range.setStart(
					document.evaluate(selInfo.startPath,
						document,
	 					null,
	 					XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue,
					Number(selInfo.startOffset)
			);

			range.setEnd(
					document.evaluate(selInfo.endPath,
						document,
	 					null,
	 					XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue,
					Number(selInfo.endOffset)
			);
		} else {
			// reverse order:
			range.setStart(
					document.evaluate(selInfo.endPath,
						document,
	 					null,
	 					XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue,
					Number(selInfo.endOffset)
			);

			range.setEnd(
					document.evaluate(selInfo.startPath,
						document,
	 					null,
	 					XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue,
					Number(selInfo.startOffset)
			);
		}

		return range;
	},

	getSelection: function() {
		return rangy.getSelection();
	},

	// check if the selection overlaps with any existing rangy highlights.
	overlaps: function(range) {
		this._init();
		ranges = []
		ranges.push(range);
		var intersections = highlighter.getIntersectingHighlights(ranges);

		if (intersections.length > 0) {
			return true;
		} else {
			return false;
		}
	}
};

module.exports = Annotator;
