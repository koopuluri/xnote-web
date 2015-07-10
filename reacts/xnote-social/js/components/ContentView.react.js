var React = require('react');
var mui = require('material-ui');
var ArticleListItem = require('./ArticleListItem.react');
var ContentStore = require('../stores/ContentStore');

var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;
var List = mui.List;
var Card = mui.Card;
var CardText = mui.CardText;

//Using material UI themes
//http://material-ui.com/#/customization/themes

var ContentView = React.createClass({

    getInitialState: function() {
        return {
            articleList: ContentStore.getArticleList()
        }
    },

    _onChange: function() {
        this.setState(this.getInitialState());
    },

    componentDidMount: function() {
        ContentStore.addChangeListener(this._onChange);
    },

    componentWillMount: function() {
        ContentStore.removeChangeListener(this._onChange);
    },

    render: function() {

        var articles = this.state.articleList.map(function(article) {
            return (
                <ArticleListItem article={article} />
            );
        });

        return (
            <div className="content-view">
                <Card>
                    <List>
                        {articles}
                    </List>
                </Card>
            </div>
        );
    }
});

module.exports = ContentView;
