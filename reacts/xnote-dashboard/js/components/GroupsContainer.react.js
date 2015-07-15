var React = require('react');
var Store = require('../stores/DashStore');
var Actions = require('../actions/Actions');

var Group = require('./Group.react');
var AddGroupComponent = require('./AddGroupComponent.react');

var Groups = React.createClass({

    getInitialState: function() {
        return {
            groups: Store.getGroups()
        }
    },

    _onChange: function() {
        this.setState({groups: Store.getGroups()});

    },


    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        Actions.fetchAndSetGroups();
    },

    render: function() {
        var groups = this.state.groups.map(function(group) {
            return (
                <Group group={group} />
            );
        });

        return (
            <div className="groups-container">
                <AddGroupComponent/>
                <div className="groups-div">
                    {groups}
                </div>
            </div>
        );
    }
});

module.exports = Groups;
