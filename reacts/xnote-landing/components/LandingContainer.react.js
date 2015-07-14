var React = require('react');
var LandingStore = require('../stores/LandingStore');
var Actions = require('../actions/Actions');

var LandingContainer = React.createClass({

	getInitialState: function() {
        return {
            group: LandingStore.getGroup();
            inviter: LandingStore.getInviter();
        }
    },

    _onChange: function() {
        this.setState(this.getInitalState());
    },


    componentDidMount: function() {
        LandingStore.addChangeListener(this._onChange);
    },
    
    render: function() {
        var inviter = this.state.inviter;
        var group = this.state.group;
        if(inviter && group) {
            var groupMessage = "Hey! Welcome to Tatr!\n"
            groupMessage = groupMessage +  "Your friend " + inviter 
                                + " invited you to join the group "
                                + group.groupRef.title + "."
                                + "To join click the button below."; 
        } else {
            var groupMessage = "Hey! Welcome to Tatr!\n"
                                + "To get started log in with Facebook.";
        }
        return (
            <div>
                <p>
                    {groupMessage}
                </p>
            </div>
        );
    },
});

module.exports = LandingContainer;
