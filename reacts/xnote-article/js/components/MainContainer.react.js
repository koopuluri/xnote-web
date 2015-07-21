var React = require('react');
var ArticleToolbar = require('./ArticleToolbar.react');
var ArticleStore = require('../stores/ArticleStore');
var NotifStore = require('../stores/NotificationStore');
var GroupStore = require('../stores/GroupStore');
var ArticleActions = require('../actions/ArticleActions');

var ArticleView = require('./ArticleView.react');
var Discussion = require('./Discussion.react');
var SnackbarComponent = require('./SnackbarComponent.react');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;
//Using material UI themes
//http://material-ui.com/#/customization/themes

// props:
// - currentUser 
var MainContainer = React.createClass({

    childContextTypes : {
        muiTheme: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    componentWillMount: function() {
        ThemeManager.setPalette({
            primary1Color: '#FFFFFF',
            accent1Color: Colors.green500,
            focusColor: Colors.green500
        });
        ThemeManager.setComponentThemes({
            appBar: {
                textColor: Colors.green500,
                height: 30
            },
            menuSubheader: {
                textColor: Colors.green500,
            },
            flatButton: {
                primaryTextColor: Colors.green500,
                secondaryTextColor: Colors.green500,
                disabledTextColor: Colors.green500
            },
            textField: {
                focusColor: Colors.green500
            }
        })
    },

    render: function() {
        // renderring the container
            return (
                <div className="container">
                    <div className="article-container">
                        <div className="article-view col-md-8">
                            <ArticleView
                                highlightId={this.props.highlightId}
                                currentUser={this.props.currentUser} />
                        </div>
                        <div className="note-view col-md-4">
                            <Discussion currentUser={this.props.currentUser}/>,
                        </div>
                    </div>
                    <ArticleToolbar groupId={this.props.groupId}/>
                    <SnackbarComponent />
                </div>
            );
    }
});

module.exports = MainContainer;