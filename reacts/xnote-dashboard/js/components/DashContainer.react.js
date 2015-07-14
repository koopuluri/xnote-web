var React = require('react');
var Store = require('../stores/DashStore');
var Navbar = require('./Navbar.react');
var GroupsContainer = require('./GroupsContainer.react');
var Actions = require('../actions/Actions');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

var DashContainer = React.createClass({

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
            focusColor: Colors.green500
        });
        ThemeManager.setComponentThemes({
            appBar: {
                backgroundColor: Colors.green500,
                height: 30
            },
            menuSubheader: {
                textColor: Colors.green500,
            },
            flatButton: {
                primaryTextColor: Colors.green500,
                secondaryTextColor: Colors.green500,
            },
            textField: {
                focusColor: Colors.green500
            }
        })
    },

    componentDidMount: function() {
        Actions.fetchAndSetUser();
    },
    
    render: function() {
        return (
            <div className="dash-container">
                <Navbar />
                <GroupsContainer />
            </div>
        );
    },
});

module.exports = DashContainer;
