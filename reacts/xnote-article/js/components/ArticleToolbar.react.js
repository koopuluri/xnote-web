var React = require('react');
var NotificationStore = require('../stores/NotificationStore');
var ArticleActions = require('../actions/ArticleActions');
var FeedNotifications = require('./FeedNotifications.react');
var GroupStore = require('../stores/GroupStore');
var mui = require('material-ui');

var AppBar = mui.AppBar;
var FlatButton = mui.FlatButton;
var Colors = mui.Styles.Colors;
var FontIcon = mui.FontIcon;

function getState() {
    return {
        currentUser: GroupStore.getCurrentUser(),
        groupTitle: GroupStore.getGroupTitle(),
        notifs: NotificationStore.getNotifs()
    }
}


var ArticleToolbar = React.createClass({
    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        NotificationStore.addChangeListener(this._onNotifChange);
        GroupStore.addChangeListener(this._onGroupChange);
        ArticleActions.fetchAndSetNotifs(this.props.groupId);
    },

    componentWillUnmount: function() {
        NotificationStore.removeChangeListener(this._onNotifChange);
        GroupStore.removeChangeListener(this._onGroupChange);
    },

    _onNotifChange: function() {
        this.setState({
            notifs: NotificationStore.getNotifs()
        });
    },

    _onGroupChange: function() {
        this.setState({
            currentUser: GroupStore.getCurrentUser(),
            groupTitle: GroupStore.getGroupTitle()
        });
    },

    _showMenuBar: function() {
        this.refs.menuBar.toggle();
    },

    _onBackButtonPressed: function(e, selectedIndex, menuItem) {
        window.location.hash = '#';
    },

    render: function() {
      //Stores the username in the right of the appbar.
      var usernameElement = '';
      var me = this.state.currentUser;
      if (me && me.facebook.name) {
          usernameElement = (
              <FlatButton 
                  primary={true} 
                  label={me.facebook.name}
                  disabled={true} />
          );
      }
      return (
        <div>
          <AppBar
            title= {
              <p style={{
                color: Colors.grey500,
                paddingTop:8,
                fontSize:20,
                fontWeight:500,
                lineHeight:1
              }}>
                  {this.state.groupTitle}
              </p>
            }
            zDepth={1}
            showMenuIconButton = {true}
            iconElementLeft = {
              <FontIcon 
                  style={{
                    color:Colors.green500,
                    cursor:"pointer",
                    fontSize:24,
                    paddingTop:15
                  }}
                  onClick = {this._onBackButtonPressed}
                  className="material-icons">
                    arrow_back
              </FontIcon>
            }>
            <FeedNotifications groupId={this.props.groupId}/>
              {usernameElement}
          </AppBar>
        </div>
      );
    }
});

module.exports = ArticleToolbar;
