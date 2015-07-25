var React = require('react');
var Store = require('../stores/DashStore');
var Actions = require('../actions/Actions');

var GroupListItem = require('./GroupListItem.react');
var AddGroupComponent = require('./AddGroupComponent.react');
var mui = require('material-ui');
var Colors = mui.Styles.Colors;
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

        if(groups.length > 0) {
            return (
                <div className="groups-container" 
                    style={{
                        backgroundColor: Colors.grey150,
                        height: 'calc(100% - 40px)',
                        marginTop: '40px',
                    }}>
                        <AddGroupComponent/>
                        <List style={{backgroundColor: Colors.grey150}}>
                            {groups}
                        </List>
                </div>            
            );
        } else {
            return (
                <div className='groups-container'>
                    <div className = "no-groups-message"
                        style={{backgroundColor: Colors.grey150}}>
                        <p>You have no groups. Add one by clicking on the green button
                            on the bottom right of your screen.</p>
                    </div>
                    <AddGroupComponent/>
                </div>
            )
        }
    }
});

module.exports = Groups;
