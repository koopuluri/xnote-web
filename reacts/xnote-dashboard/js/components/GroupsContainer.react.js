var React = require('react');
var Store = require('../stores/DashStore');
var Actions = require('../actions/Actions');

var Group = require('./Group.react');
var AddGroupForm = require('./AddGroupForm.react');
var AddGroupButton = require('./AddGroupButton.react');

var Groups = React.createClass({

    getInitialState: function() {
        return {
            displayAddGroupForm: false,
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

    // grabs information about a new group and adds it:
    _formSubmit: function(groupTitle, groupMembers) {
        var group = {
            title: groupTitle,
            members: []
        }

        Actions.addGroup(group);
        this.setState({displayAddGroupForm: false});
    },

    _formCancel: function() {
        this.setState({displayAddGroupForm: false});
    },

    _showForm: function() {
        this.setState({displayAddGroupForm: true});
    },

    render: function() {

        var groups = this.state.groups.map(function(group) {
            return (
                <Group group={group} />
            );
        });

        var addGroupForm = (this.state.displayAddGroupForm) ?
                    <AddGroupForm
                        onSubmit={this._formSubmit}
                        onCancel={this._formCancel} /> : '';


        console.log("about to render groups: " + groups.length)
        return (
            <div className="groups-container">
                <AddGroupButton onClick={this._showForm} />
                <div className="groups-div">
                    {groups}
                </div>
                {addGroupForm}
            </div>
        );
    }
});

module.exports = Groups;
