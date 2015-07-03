var React = require('react');

// props:
// - group
var Group = React.createClass({

    render: function() {
        var group = this.props.group;

        return (
            <div className="group-div">
                {group.title}
            </div>
        );
    }
});

module.exports = Group;
