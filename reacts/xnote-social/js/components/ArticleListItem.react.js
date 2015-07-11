var React = require('react');

var ArticleActions = require('../actions/ArticleActions');
var GroupActions = require('../actions/GroupActions');

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
        ArticleActions._setSelectedArticleId(this.props.article._id);
        GroupActions.resetFeedAndArticleListAndChatSegments();
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
