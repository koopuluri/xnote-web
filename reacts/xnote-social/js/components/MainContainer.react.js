var React = require('react');
var GroupSideBar = require('./GroupSideBar.react');
var AppToolbar = require('./AppToolbar.react');
var ContentView = require('./ContentView.react');

//Using material UI themes
//http://material-ui.com/#/customization/themes

var MainContainer = React.createClass({

    render: function() {
        // renderring the container
        return (
            <div className="main-container">
                <ContentView />
                <AppToolbar />
                <GroupSideBar />
            </div>
        );
    },
});

module.exports = MainContainer;
