var React = require('react');
// expects following properties:
// x: coordinates on the screen.
// y
// onButtonClick
var mui = require('material-ui');
var FloatingActionButton = mui.FloatingActionButton;
var FontIcon = mui.FontIcon;
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
			<div className="add-note-button"
			 style={this._getStyle()}>
	        	<FloatingActionButton onClick={this.props.onButtonClick}>
	        		<FontIcon 
                  		style={{
                    		color:"#FFF",
                  		}}
                  		className="material-icons">
                    		add
	                </FontIcon>
	            </FloatingActionButton>
		    </div>
		);
	}
});

module.exports = AddNoteButton;
