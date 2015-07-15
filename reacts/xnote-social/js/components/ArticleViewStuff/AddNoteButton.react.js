var React = require('react');
// expects following properties:
// x: coordinates on the screen.
// y
// onButtonClick
var mui = require('material-ui');
var FloatingActionButton = mui.FloatingActionButton;

var AddNoteButton = React.createClass({

	_getStyle: function() {
		return {
			top: this.props.y,
			left: this.props.x
		}
	},

	render: function() {
		if (!this.props.render) {
			return (<div></div>);
		}

		return (
			<div className="add-note-button" onClick={this.props.onButtonClick}
			 style={this._getStyle()}>
	        	<FloatingActionButton />
		    </div>
		);
	}
});

module.exports = AddNoteButton;
