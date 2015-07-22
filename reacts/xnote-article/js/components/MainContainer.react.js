var React = require('react');
var ChatActions = require('../actions/ChatActions');
var ArticleStore = require('../stores/ArticleStore');
var NotifStore = require('../stores/NotificationStore');
var GroupStore = require('../stores/GroupStore');
var ArticleActions = require('../actions/ArticleActions');
var ChatWindow = require('./ChatWindow.react')

var ArticleToolbar = require('./ArticleToolbar.react');
var ArticleView = require('./ArticleView.react');
var Discussion = require('./Discussion.react');
var SnackbarComponent = require('./SnackbarComponent.react');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;
//Using material UI themes
//http://material-ui.com/#/customization/themes

var MainContainer = React.createClass({

    getInitialState: function() {
        return {
            currentUser: GroupStore.getCurrentUser()
        }
    },

    _onGroupChange: function() {
        this.setState(this.getInitialState());
    },

    componentDidMount: function() {
        GroupStore.addChangeListener(this._onGroupChange);
        var socket = io.connect();
        socket.on('chat:' + this.props.groupId, function(chatObj) {
            ChatActions.socketReceiveChat(chatObj.chat);
        });
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
            primary1Color: '#FFFFFF',
            accent1Color: Colors.green500,
            focusColor: Colors.green500
        });
        ThemeManager.setComponentThemes({
            appBar: {
                textColor: Colors.green500,
                height: 30
            },
            menuSubheader: {
                textColor: Colors.green500,
            },
            flatButton: {
                primaryTextColor: Colors.green500,
                secondaryTextColor: Colors.green500,
                disabledTextColor: Colors.green500
            },
            textField: {
                focusColor: Colors.green500
            }
        })
    },

    render: function() {
        // renderring the container
            return (
                <div className="container">
                    <div className="article-container">
                        <div className="article-view col-md-8">
                            <ArticleView
                                highlightId={this.props.highlightId}
                                currentUser={this.state.currentUser} />
                        </div>
                        <div className="note-view col-md-4">
                            <Discussion currentUser={this.state.currentUser}/>,
                        </div>
                    </div>
                    <ArticleToolbar groupId={this.props.groupId}/>
                    <SnackbarComponent />
                    <ChatWindow groupId={this.props.groupId}/>
                </div>
            );
    }
});

module.exports = MainContainer;