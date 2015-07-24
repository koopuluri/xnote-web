var React = require('react');
var Store = require('../stores/DashStore');
var Actions = require('../actions/Actions');

var GroupListItem = require('./GroupListItem.react');
var AddGroupComponent = require('./AddGroupComponent.react');
var mui = require('material-ui');
var Card = mui.Card;
var List = mui.List;

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
            if (group.groupRef) {
                return (
                    <GroupListItem group={group} groupId={group.groupRef._id}/>
                );
            } else {
                // do nothing. TODO: figure out why!!!?!?!
            }
        });

        return (
            <div className="groups-container" 
                style={{
                    height: 'calc(100% - 40px)',
                    marginTop: '40px',
                }}>
                    <AddGroupComponent/>
                    <List>
                        {groups}
                    </List>
            </div>
        );
    }
});

module.exports = Groups;
