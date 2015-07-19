var React = require('react');
var ArticleToolbar = require('./ArticleToolbar.react');
var ArticleStore = require('../stores/ArticleStore');
var NotifStore = require('../stores/NotificationStore');
var GroupStore = require('../stores/GroupStore');
var ArticleActions = require('../actions/ArticleActions');

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
            route: window.location.hash.substr(1)
        }
    },

    _onRouteChange: function() {
        // var newRoute = window.location.hash.substr(1);
        // var newParams = GroupUtils.getUrlVars(newRoute);
        // var oldParams = GroupUtils.getUrlVars(this.state.route);

        // if(oldParams.articleId && newParams.articleId &&
        //      oldParams.articleId !== newParams.articleId) {
        //     ArticleActions.fetchAndSetArticle(newParams.articleId);
        //     if(newParams.highlightId) {
        //         ArticleActions.fetchAndSetHighlight(newParams.highlightId);
        //     }
        // }

        // this.setState({route: newRoute});
    },

    componentDidMount: function() {
        var self = this;
        var groupId = this.props.groupId;
        var userId = this.props.userId;

        window.addEventListener('hashchange', function() {
            self._onRouteChange();
        });

        ArticleActions.fetchAndSetNotifs(groupId);
    
        // setting the socket to receive posts and chat:
        var socket = io.connect();

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
            NotifActions.addNotif(notif);
        });

        socket.on('note:' + groupId, function(obj) {
            var highlightId = obj.highlightId;
            var note = obj.note;

            if (note && highlightId) {
                NotifActions.socketReceiveNote(obj.note, obj._id);
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
                                highlightId={this.props.highlightId} />
                        </div>
                        <div className="note-view col-md-4">
                            <Discussion />,
                        </div>
                    </div>
                    <ArticleToolbar groupId={this.props.groupId}/>
                    <SnackbarComponent />
                </div>
            );
    }
});

module.exports = MainContainer;