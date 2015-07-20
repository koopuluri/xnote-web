var React = require('react');

var mui = require('material-ui');
var Colors = mui.Styles.Colors;
var ListItem = mui.ListItem;

var getOnFeedPostClickedFunction = function(post) {
  return function() {
    if (post.article) {
      window.location.hash = '#articleId=' + post.article._id;
    } else if (post.highlight) {
      window.location.hash = '#articleId=' + post.highlight.article + '&&highlightId=' + post.highlight._id;
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


