var React = require('react');
var Store = require('../stores/DashStore');
var Navbar = require('./Navbar.react');
var GroupsContainer = require('./GroupsContainer.react');

var DashContainer = React.createClass({

    render: function() {
        return (
            <div className="dash-container">
                <Navbar />
                <GroupsContainer />
            </div>
        );
    },
});

module.exports = DashContainer;
