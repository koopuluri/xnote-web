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
        console.log('_onChange called in GroupsContainer!');
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
                    <GroupListItem group={group} />
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
                    width: '40%',
                    position: 'fixed',
                    left: 0,
                }}>
                    <AddGroupComponent/>

                    <Card style={{height: '100%', overflow: 'scroll'}} zDepth = {1} >
                        <List>
                            {groups}
                        </List>
                    </Card>

            </div>
        );
    }
});

module.exports = Groups;
