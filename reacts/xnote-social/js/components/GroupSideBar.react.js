var React = require('react');
var GroupConstants = require('../constants/GroupConstants');
var GroupActions = require('../actions/GroupActions');

var FeedContainer = require('./FeedContainer.react');
var ChatContainer = require('./ChatContainer.react');
var GroupNavbar = require('./GroupNavbar.react');
var SidebarStore = require('../stores/SidebarStore');


function getViewMode() {
    return {
        mode: SidebarStore.getViewMode(),
    }
}

var GroupSidebar = React.createClass({
    getInitialState: function() {
        return getViewMode();
    },

    componentDidMount: function() {
        SidebarStore.addChangeListener(this._onChange);
    },

    render: function() {
        var comp = null;
        if (this.state.mode === GroupConstants.SIDEBAR_FEED_VIEW) {
            comp = (<FeedContainer/>);
        } else {
            comp = (<ChatContainer/>)
        }

        // renderring the toggling mode view along with the component to display:
        return (
            <div className="discussion-view-container">
                <GroupNavbar/>
                {comp}
            </div>
        );
    },

    _onChange: function() {
        this.setState(getViewMode());
    }
});

module.exports = GroupSidebar;