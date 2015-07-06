var React = require('react');
var GroupActions = require('../actions/GroupActions');
var GroupConstants = require('../constants/GroupConstants');
var SidebarStore = require('../stores/SidebarStore');

var FeedContainer = require('./FeedContainer.react');
var ChatContainer = require('./ChatContainer.react');

var mui = require('material-ui');
var Tabs = mui.Tabs;
var Tab = mui.Tab;
var Colors = mui.Styles.Colors;

var GroupContainer = React.createClass({

    _onChange: function(tabIndex, tab) {
        console.log(tabIndex, tab);
    },

    render: function() {

        var containerStyle = {
            backgroundColor: "#FFFFFF",
        }

        var contentStyle = {
            color: Colors.green500,
        }

        return ( 
            <Tabs
                tabItemContainerStyle = {containerStyle}
                className = 'discussion-view-tabs'>

                <Tab label="Chat"
                    style = {contentStyle} > 
                    <div> 
                        <ChatContainer />
                    </div>
                </Tab>
                
                <Tab label="Feed"
                    style = {contentStyle}> 
                    <div> 
                        <FeedContainer />
                    </div> 
                </Tab>
            </Tabs> 
        );
    }
});

module.exports = GroupContainer;