var React = require('react');
var mui = require('material-ui');
var ArticleListItem = require('./ArticleListItem.react');
var ContentStore = require('../stores/ContentStore');
var GroupActions = require('../actions/GroupActions');
var Loading = require('./ArticleViewStuff/Loading.react');

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
            articleList: ContentStore.getArticleList(),
            index: ContentStore.getIndex(),
            isLoading: ContentStore.getLoading(),
        }
    },

    _onChange: function() {
        if (this.isMounted()) {
            this.setState(this.getInitialState());
        }
    },

    _onScroll: function() {
        var node = this.getDOMNode();
        if (node.scrollTop + node.clientHeight >= node.scrollHeight) {

            // load more items if not reached limit:
            if (ContentStore.isLazy()) {
                GroupActions.fetchArticleListSegment(this.props.groupId, this.state.index, ContentStore.SEG_SIZE);
            }
        }
    },

    componentDidMount: function() {
        ContentStore.addChangeListener(this._onChange);
        GroupActions.fetchArticleListSegment(this.props.groupId, 0, ContentStore.SEG_SIZE);
    },

    componentWillUnMount: function() {
        ContentStore.removeChangeListener(this._onChange);
        //GroupActions.clearArticleList();
    },

    render: function() {
        if(this.state.isLoading) {
            return (
                <div className="content-view" onScroll={this._onScroll} style = {{padding : 10}}>
                    <Loading marginTop={30} marginLeft={43}/>
                </div>
            );
        } else {
            if (this.state.articleList.length === 0) {
                return (
                    <div className="content-view" onScroll={this._onScroll} style = {{padding : 10}}>
                        <p className = 'no-articles-message'>
                            You have no articles. Click on the green
                            button in the bottom right to add one.
                        </p>
                    </div>
                );
            }

            var articles = this.state.articleList.map(function(article) {
                return (
                    <ArticleListItem article={article} />
                );
            });

            return (
                <div className="content-view" onScroll={this._onScroll} style = {{padding : 10}}>
                    <Card zDepth = {1} >
                        <List>
                            {articles}
                        </List>
                    </Card>
                </div>
            );
        }
    }
});

module.exports = ContentView;
