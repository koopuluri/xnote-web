var React = require('react');

var ArticleActions = require('../actions/ArticleActions');

var mui = require('material-ui');
var List = mui.List;
var ListItem = mui.ListItem;
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
            <ListItem
                leftAvatar={<Avatar src={article.icon}/>}
                secondaryText={
                    <div>
                        <p> {article.createdAt} </p>
                    </div>
                }
                secondaryTextLines={2}
                onTouchTap = {this._onClick}>
                {article.title}
            </ListItem>
        );
    }
});

module.exports = ArticleListItem;
