var React = require('react');
var GroupSidebar = require('./GroupSidebar.react');
var AppToolbar = require('./AppToolbar.react');
var ArticleToolbar = require('./ArticleViewStuff/ArticleToolbar.react');
var SnackbarComponent = require('./SnackbarComponent.react');

var ContentView = require('./ContentView.react');
var ContentStore = require('../stores/ContentStore');
var NotifStore = require('../stores/NotificationStore');
var FeedStore = require('../stores/FeedStore');
var GroupStore = require('../stores/GroupStore');
var AddArticle = require('./AddArticle.react');
var ChatWindow = require('./ChatWindow.react');
var GroupUtils = require('../utils/GroupUtils');

var GroupActions = require('../actions/GroupActions');
var ArticleActions = require('../actions/ArticleActions');

var ArticleView = require('../components/ArticleViewStuff/ArticleView.react');
var Discussion = require('../components/ArticleViewStuff/Discussion.react');

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
        var newRoute = window.location.hash.substr(1);
        var newParams = GroupUtils.getUrlVars(newRoute);
        var oldParams = GroupUtils.getUrlVars(this.state.route);

        if(oldParams.articleId && newParams.articleId &&
             oldParams.articleId !== newParams.articleId) {
            ArticleActions.fetchAndSetArticle(newParams.articleId);
            if(newParams.highlightId) {
                ArticleActions.fetchAndSetHighlight(newParams.highlightId);
            }
        }

        this.setState({route: newRoute});
    },

    componentDidMount: function() {
        var self = this;
        var groupId = this.props.groupId;
        var userId = this.props.userId;

        window.addEventListener('hashchange', function() {
            self._onRouteChange();
        });

        GroupActions.fetchAndSetNotifs(groupId);
    
        // setting the socket to receive posts and chat:
        var socket = io.connect();

        //receiving posts:
        socket.on('feedPost:' + groupId, function(post) {
            GroupActions.socketReceivePost(post);
        });

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
            GroupActions.addNotif(notif);
        });

        socket.on('note:' + groupId, function(obj) {
            var highlightId = obj.highlightId;
            var note = obj.note;

            if (note && highlightId) {
                GroupActions.socketReceiveNote(obj.note, obj._id);
            }
        });

        socket.on('chat:' + groupId, function(chatObj) {
            GroupActions.socketReceiveChat(chatObj.chat);
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
        var params = GroupUtils.getUrlVars(this.state.route);
        if (!params || !params.articleId) {
            return (
                <div className="main-container">
                    <ContentView groupId={this.props.groupId}/>
                    <AppToolbar groupId={this.props.groupId}/>
                    <GroupSidebar groupId={this.props.groupId}/>
                    <AddArticle />
                    <SnackbarComponent />
                    <ChatWindow groupId={this.props.groupId}/>
                </div>
            );
        }  else {
            return (
                <div className="container">
                    <div className="article-container">
                        <div className="article-view col-md-8">
                            <ArticleView 
                                articleId={params.articleId}
                                highlightId={params.highlightId} />
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
    },
});

module.exports = MainContainer;