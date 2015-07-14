var React = require('react');

var mui = require('material-ui');
var Card = mui.Card;
var ToolbarGroup = mui.ToolbarGroup;

// props:
// - group
var Group = React.createClass({

	_onSelect: function() {
		window.location = '/group?id=' + this.props.group._id;
	},

    render: function() {
        var group = this.props.group;
        return (
        	<ToolbarGroup float="left" style={{padding:10}}>
        		<Card onClick={this._onSelect} zDepth={1} style={{padding:10}}>
            	    <p>{group.title}</p>
            	</Card>
            </ToolbarGroup>
        );
    }
});

module.exports = Group;
