var React = require('react');
var GroupSidebar = require('./GroupSidebar.react');
var AppToolbar = require('./AppToolbar.react');
var ArticleToolbar = require('./ArticleViewStuff/ArticleToolbar.react');

var ContentView = require('./ContentView.react');
var ContentStore = require('../stores/ContentStore');
var NotifStore = require('../stores/NotificationStore');
var FeedStore = require('../stores/FeedStore');
var GroupStore = require('../stores/GroupStore');
var AddArticle = require('./AddArticle.react');

var GroupActions = require('../actions/GroupActions');

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
            selectedArticleId: ContentStore.getSelectedArticleId()
        }
        // return {
        //     selectedArticleId: null
        // }
    },

    _onChange: function() {
        this.setState(this.getInitialState());
    },

    componentWillUnmount: function() {
        ContentStore.removeArticleIdChangeListener(this._onChange);
    },

    componentDidMount: function() {
        var self = this;
        ContentStore.addArticleIdChangeListener(this._onChange);

        // setting the socket to receive posts and chat:
        var socket = io.connect();
        var groupId = this.props.groupId;

        //receiving posts:
        socket.on('feedPost:' + groupId, function(post) {
            GroupActions.socketReceivePost(post);
        });

        socket.on('note:' + groupId, function(obj) {
            var postNotifCount = NotifStore.getFeedNotifs();

            // going to grab the current feed list
            // Let 'i' be the index of the highlightId for this note in that feed list (from top)
            // if 'i' + 1 > postNotifCount, that means that this highlihgt has already been seen,
            // and there's no notification for this highlight; so we will increment the feedNotifCount.
            // if this highlight is unseen (implying one of the feedNotifcounts is for this highlight),
            // then we will NOT increment the feedNotifCount.

            var feedList = FeedStore.getFeed();
            for (var i = 0; i < feedList.length; i++) {
                var post = feedList[i];
                if (post.type === 'HighlightFeedPost' && post.highlight.highlightId === obj.highlightId) {
                    if (i+1 > postNotifCount) {
                        GroupActions.incrementFeedNotifs();
                    }
                }
            }

            GroupActions.socketReceiveNote(obj.note, obj.highlightId, postNotifCount);
        });

        socket.on('chat:'+groupId, function(chat) {
            GroupActions.socketReceiveChat(chat);
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
            },
            textField: {
                focusColor: Colors.green500
            }
        })
    },

    render: function() {
        // renderring the container
        if (!this.state.selectedArticleId) {
            return (
                <div className="main-container">
                    <ContentView />
                    <AppToolbar />
                    <GroupSidebar />
                    <AddArticle />
                </div>
            );
        }  else {
            return (
                <div className="container">

                    <div className="article-container">
                        <div className="article-view col-md-8">
                            <ArticleView articleId={this.state.selectedArticleId} />
                        </div>
                        <div className="note-view col-md-4">
                            <Discussion />,
                        </div>
                    </div>
                    <ArticleToolbar />

                </div>
            );
        }
    },
});

module.exports = MainContainer;
