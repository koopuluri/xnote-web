var React = require('react');
var GroupContainer = require('./GroupContainer.react');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;


//Using material UI themes
//http://material-ui.com/#/customization/themes

var GroupSidebar = React.createClass({


    childContextTypes : {
        muiTheme: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    componentWillMount: function() {
        ThemeManager.setPalette({
            primary1Color: Colors.green500,
            accent1Color: Colors.green500,
        });
    },

    render: function() {
        // renderring the container
        return (
            <div className="group-sidebar-container">
                <GroupContainer/>
            </div>
        );
    },
});

module.exports = GroupSidebar;
