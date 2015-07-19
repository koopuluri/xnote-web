var React = require('react');
var Store = require('../stores/DashStore');
var FeedStore = require('../stores/FeedStore');
var Navbar = require('./Navbar.react');
var GroupsContainer = require('./GroupsContainer.react');
var Utils = require('../utils/Utils');
var Actions = require('../actions/Actions');
var FeedContainer = require('./FeedContainer.react');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

var DashContainer = React.createClass({

    getInitialState: function() {
        return {
            currentUser: Store.getCurrentUser()
        }
    },

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
        });
    },

    _onChange: function() {
        this.setState(this.getInitialState());
    },

    componentDidMount: function() {
        Actions.fetchAndSetUser();
        Store.addChangeListener(this._onChange);
    },
    
    render: function() {

        var feedStyle = {
            height: 'calc(100% - 40px)',
            marginTop: '40px',
            position: 'fixed',
            right: 0,
            overflow: 'scroll',
            width: '60%',
            zIndex: -3
        }

        return (
            <div className="dash-container">
                <Navbar />
                <GroupsContainer />
                <FeedContainer
                    style={feedStyle}

                    FeedStore={FeedStore} 
                    groupId={null} 
                    currentUser={this.state.currentUser}
                    clearFeed={Actions.clearFeed}
                    segSize={5}

                    fetchFeedSegment={Actions.fetchFeedSegment}
                    addNote={Actions.addNote}
                    removeNote={Actions.removeNote}
                    generateUUID={Utils.generateUUID}
                    getCurrentTimestamp={Utils.getTimestamp}/>
            </div>
        );
    },
});

module.exports = DashContainer;
