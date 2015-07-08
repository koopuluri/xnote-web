var React = require('react');
var GroupSidebar = require('./GroupSidebar.react');
var AppToolbar = require('./AppToolbar.react');
var ContentView = require('./ContentView.react');
var ContentStore = require('../stores/ContentStore');

var ArticleView = require('../components/ArticleViewStuff/ArticleView.react');
var Discussion = require('../components/ArticleViewStuff/Discussion.react');
var AddArticleButton = require('../components/AddArticleButton.react');

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
        });
    },

    componentDidMount: function() {
        var self = this;
        ContentStore.addChangeListener(function() {
            self.setState(self.getInitialState());
        });
    },

    render: function() {
        // renderring the container
        if (!this.state.selectedArticleId) {
            return (
                <div className="main-container">
                    <ContentView />
                    <AppToolbar />
                    <GroupSidebar />
                    <AddArticleButton />
                </div>
            );
        }  else {
            return (
                <div className="container">
                    <div className="row">
                        <div className="article-view col-md-8">
                            <ArticleView articleId={this.state.selectedArticleId} />
                        </div>
                        <div className="note-view col-md-4">
                            <Discussion />,
                        </div>
                    </div>

                </div>
            );
        }
    },
});

module.exports = MainContainer;