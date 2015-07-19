var React = require('react');

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
// - group
var GroupListItem = React.createClass({
    _onClick: function() {
        window.location = '/group?id=' + this.props.group.groupRef._id;
    },

    render: function() {
        var group = this.props.group.groupRef;
        return (
            <ListItem
                secondaryText={
                    <p> {group.members.length + ' members'} </p>
                }

                onTouchTap = {this._onClick}>
                    <p style={{fontSize: '20px', fontWeight: 650}}> {group.title} </p>
            </ListItem>
        );
    }
});

module.exports = GroupListItem;
