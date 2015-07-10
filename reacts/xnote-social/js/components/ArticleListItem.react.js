var React = require('react');

var ArticleActions = require('../actions/ArticleActions');

var mui = require('material-ui');
var Card = mui.Card;
var CardTitle = mui.CardTitle;
var CardHeader = mui.CardHeader;
var Avatar = mui.Avatar;
var CardActions = mui.CardActions;
var FlatButton = mui.FlatButton;

var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;
// expected prop:
// - article
var ArticleListItem = React.createClass({

    _onClick: function() {
        console.log('_onClick! articleId: ' + this.props.article._id);
        ArticleActions._setSelectedArticleId(this.props.article._id);
    },

    render: function() {
        var article = this.props.article;
        return (
            <Card className='article-list-item'>
            <CardActions>
                <FlatButton onClick={this._onClick} label={article.title}/>
            </CardActions>

                <CardHeader
                    subtitle={<a href={article.url}>{article.url}</a>}
                    avatar={<Avatar src={article.icon}/>}/>
            </Card>
        );
    }
});

module.exports = ArticleListItem;
