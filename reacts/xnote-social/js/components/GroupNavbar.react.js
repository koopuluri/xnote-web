var React = require('react');
var GroupActions = require('../actions/GroupActions');
var GroupConstants = require('../constants/GroupConstants');
var SidebarStore = require('../stores/SidebarStore');


var Boot = require('react-bootstrap');
var Nav = Boot.Nav;
var Navbar = Boot.Navbar;


var GroupNavbar = React.createClass({
    getInitialState: function() {
        return {
            mode: SidebarStore.getViewMode()
        }
    },

    componentDidMount: function() {
        var self = this;
        SidebarStore.addChangeListener(function() {
            self.setState({mode: SidebarStore.getViewMode()});
        });
    },

    _onChatIconClick: function() {
        GroupActions.setViewMode(GroupConstants.SIDEBAR_CHAT_VIEW);
    },

    _onFeedIconClick: function() {
        GroupActions.setViewMode(GroupConstants.SIDEBAR_FEED_VIEW);
    },

    render: function() {
        var mode = this.state.mode;
        var feedIcon = '';
        var chatIcon = '';

        if (mode === GroupConstants.SIDEBAR_FEED_VIEW) {
            feedIcon = 'FEED';
        } else {
            feedIcon = 'DEEF';
        }

        if (mode === GroupConstants.SIDEBAR_CHAT_VIEW) {
            chatIcon = 'CHAT';
        } else {
            chatIcon = 'TAHC';
        }


        return (
            <Navbar className="discussion-view-navbar">
                <Nav>
                    <p className="navbar-item"
                            onClick={this._onChatIconClick}>{chatIcon}</p>
                    <p className="navbar-item"
                            onClick={this._onFeedIconClick}>{feedIcon}</p>
                </Nav>
            </Navbar>
        );
    }
});

module.exports = GroupNavbar;