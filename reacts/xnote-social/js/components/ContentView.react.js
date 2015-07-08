var React = require('react');
var mui = require('material-ui');
var ArticleListItem = require('./ArticleListItem.react');
var ContentStore = require('../stores/ContentStore');

var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

//Using material UI themes
//http://material-ui.com/#/customization/themes

var ContentView = React.createClass({

    getInitialState: function() {
        return {
            articleList: ContentStore.getArticleList()
        }
    },

    componentDidMount: function() {
        var self = this;
        ContentStore.addChangeListener(function() {
            self.setState(self.getInitialState());
        });
    },

    render: function() {

        var articles = this.state.articleList.map(function(article) {
            return (
               <ArticleListItem article={article} />
            );
        });

        return (
            <div className="content-view">
                {articles}
            </div>
        );
    }
});

module.exports = ContentView;
