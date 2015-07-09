var React = require('react');
var ContentStore = require('../stores/ContentStore');
var GroupStore = require('../stores/GroupStore');
var mui = require('material-ui');

var Toolbar = mui.Toolbar;
var AppBar = mui.AppBar;
var ToolbarGroup = mui.ToolbarGroup;
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

var MENU_ITEMS = [
  { payload: '1', text: 'Download' },
  { payload: '2', text: 'More Info' }
];

var AppToolbar = React.createClass({

    getInitialState: function() {
        return {
            selectedArticle: ContentStore.getSelectedArticle(),
            title: GroupStore.getGroupTitle()
        }
    },

    componentDidMount: function() {
        var self = this;
        ContentStore.addChangeListener(function() {
            self.setState({selectedArticle: ContentStore.getSelectedArticle()});
        });

        GroupStore.addChangeListener(function() {
            self.setState({title: GroupStore.getGroupTitle()});
        });
    },

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
            primary1Color: Colors.green500,
            accent1Color: Colors.green500,
        });
        ThemeManager.setSpacing(10);
    },


    render: function() {
        if (true) {
            return (
              <Toolbar zDepth={2} className="app-toolbar">
                  <ToolbarGroup key={0} float="left">
                      <mui.FontIcon className="mui-icon-sort"> Dash </mui.FontIcon>
                  </ToolbarGroup>
                  <ToolbarGroup key={1} float="right">
                      <mui.FontIcon className="icon-navigation-refresh">chat</mui.FontIcon>
                      <mui.FontIcon>feed</mui.FontIcon>

                      <mui.DropDownIcon iconClassName="icon-navigation-expand-more" menuItems={MENU_ITEMS}> d </mui.DropDownIcon>
                  </ToolbarGroup>
              </Toolbar>
            );
        }
    }
});

module.exports = AppToolbar;
