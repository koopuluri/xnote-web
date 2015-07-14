var React = require('react');

var mui = require('material-ui');
var Card = mui.Card;
var ToolbarGroup = mui.ToolbarGroup;
var ListItem = mui.ListItem;

// props:
// - group
var Group = React.createClass({

	_onSelect: function() {
		window.location = '/group?id=' + this.props.group.groupRef._id;
	},

    render: function() {
        var group = this.props.group;
        return (
        	<ToolbarGroup float="left" style={{padding:10}}>
        		<Card zDepth={1} style={{padding:10}}>
            	    <ListItem 
                        primaryText = {group.groupRef.title}
                        onClick={this._onSelect} />
            	</Card>
            </ToolbarGroup>
        );
    }
});

module.exports = Group;
