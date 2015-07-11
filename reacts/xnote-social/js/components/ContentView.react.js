var React = require('react');
var mui = require('material-ui');
var ArticleListItem = require('./ArticleListItem.react');
var ContentStore = require('../stores/ContentStore');
var GroupStore = require('../stores/GroupStore');

var GroupActions = require('../actions/GroupActions');

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
        //console.log('ContentView.setState: ' + this.isMounted());
        if (this.isMounted()) {
            this.setState(this.getInitialState());
        }
    },

    _onScroll: function() {
        var node = this.getDOMNode();
//        console.log('onScroll: ' + node.scrollTop + '/ ' + node.clientHeight + ';' + node.scrollHeight);
        if (node.scrollTop + node.clientHeight >= node.scrollHeight) {

            // load more items:
            var index = ContentStore.getIndex();
            GroupActions.fetchArticleListSegment(GroupStore.getGroupId(), index, 5);
        }
    },

    componentDidMount: function() {
        ContentStore.addChangeListener(this._onChange);
    },

    componentWillUnMount: function() {
        ContentStore.removeChangeListener(this._onChange);
        console.log('ContentView.unmount');
    },

    render: function() {

        var articles = this.state.articleList.map(function(article) {
            return (
                <ArticleListItem article={article} />
            );
        });

        return (
            <div className="content-view" onScroll={this._onScroll}>
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
