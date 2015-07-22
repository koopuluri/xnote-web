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

// props:
// - currentUser 
var MainContainer = React.createClass({

    componentDidMount: function() {
        var groupId = this.props.groupId;
        var userId = this.props.currentUser._id;
        ArticleActions.fetchAndSetNotifs(groupId);

        socket = io.connect();
        socket.on('notification:' + groupId + userId, function(obj) {
            var notif = obj.notif;
            var createdUser = obj.user;
            if (notif.article) {
                notif.article = obj.article;
                notif.article.createdBy = createdUser;
            } else if (notif.highlight) {
                notif.highlight = obj.highlight;
                notif.highlight.createdBy = createdUser;
            } else {
                // should not reach this!
            }
            ArticleActions.addNotif(notif);
        });

        socket.on('note:' + groupId, function(obj) {
            var highlightId = obj.highlightId;
            var note = obj.note;

            if (note && highlightId) {
                ArticleActions.socketReceiveNote(note, highlightId);
            }
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
                                currentUser={this.props.currentUser} />
                        </div>
                        <div className="note-view col-md-4">
                            <Discussion currentUser={this.props.currentUser}/>,
                        </div>
                    </div>
                    <ArticleToolbar groupId={this.props.groupId}/>
                    <SnackbarComponent />
                    <ChatWindow currentUser={this.props.currentUser} groupId={this.props.groupId}/>
                </div>
            );
    }
});

module.exports = MainContainer;