var React = require('react');


var mui = require('material-ui');
var Colors = mui.Styles.Colors;
var ListItem = mui.ListItem;

var getOnFeedPostClickedFunction = function(post) {
  return function() {
    if (post.type === ARTICLE) {
      window.location.hash = '#articleId=' + post.article._id;
    } else if (post.type === HIGHLIGHT) {
      window.location.hash = '#articleId=' + post.highlight.articleId + '&&highlightId=' + post.highlight.highlightId;
    } else {
      // fuck 
    }
  }
}

// state:
// - message
var FeedNotificationsItem = React.createClass({
  render: function() {
    return (
      <div>
          <ListItem 
            secondaryTextLines={this.props.secondaryTextLines}
            style = {{width: 500}}
            primaryText = {
                <p style = {
                    {
                        fontSize : 13,
                        lineHeight : 1,
                        fontWeight: 800,
                        paddingBottom : 0,
                    }
                }>
                    {this.props.feedOwner}
                </p>
            }
            secondaryText = {
              <p style = {
                  {
                    paddingBottom : 0,
                    fontSize : 16,
                    fontColor : Colors.DarkBlack
                  }
              }>
                  {this.props.feedText}
              </p>
            }
            onClick = {getOnFeedPostClickedFunction(this.props.post)}/>
      </div>
    );
  }
});

module.exports = FeedNotificationsItem;


