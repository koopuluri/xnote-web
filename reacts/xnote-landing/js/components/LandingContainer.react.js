var React = require('react');
var LandingStore = require('../stores/LandingStore');
var Actions = require('../actions/LandingActions');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var RaisedButton = mui.RaisedButton;
var Colors = mui.Styles.Colors;
var Card = mui.Card;
var ListItem = mui.ListItem;
var Avatar = mui.Avatar;
var ToolbarGroup = mui.ToolbarGroup;
var Toolbar = mui.Toolbar;

var LandingContainer = React.createClass({

    childContextTypes : {
        muiTheme: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    componentWillMount: function() {
        ThemeManager.setComponentThemes({
            raisedButton: {
                color: '#3b5998'
            },
        })
    },
	getInitialState: function() {
        return {
            group: LandingStore.getGroup(),
            inviter: LandingStore.getInviter()
        }
    },

    _onChange: function() {
        this.setState(this.getInitalState());
    },


    componentDidMount: function() {
        LandingStore.addChangeListener(this._onChange);
    },
    
    render: function() {
        var groupMessage ='';
        var groupCard ='';
        var group = this.state.group;
        var inviter = this.state.inviter;
        if(inviter && group) {
            var groupMessage =  "Your friend " + inviter + " invited you to join the group "
            var members = group.groupRefs.members.map(function(member) {
                var picture = member.facebook.picture;
                if(picture) {
                    var leftAvatar = 
                        <Avatar src={picture} size={35} />
                } else {
                    var avatarCharacter = message.createdBy.facebook.name.substring(0, 1);
                    var leftAvatar = <Avatar size={35}>{avatarCharacter}</Avatar>
                }
                return (
                    <ToolbarGroup float="left">
                        <ListItem 
                            primaryText = {member.facebook.name}
                            leftAvatar = {leftAvatar}
                            disabled = {true}/>
                    </ToolbarGroup>
                );
            })
            var groupCard = 
                <Card zDepth={1} style={{
                        width:450,
                        'text-align':'center',
                        'margin':'auto'}}>
                    <ListItem 
                        primaryText = {group.groupRefs.title}
                        secondaryText = {group.groupRefs.description}
                        secondaryTextLines = {2}
                        disabled={true} 
                        style={{paddingBottom: 0}}/>
                    <Toolbar style={{
                        backgroundColor:"#fff",
                        width:500,
                        'text-align':'center',
                        'margin':'auto'}}>
                        {members}
                    </Toolbar>
                    <div></div>
                </Card>


        }
        return (
            <div>
                <p> Hey! Welcome to Tatr! </p>
                <p> {groupMessage} </p>
                <div style={{padding:10}}>
                    {groupCard}
                </div>
                <p> To get started log in with Facebook.</p>
                <RaisedButton 
                    linkButton={true}
                    href='/auth/facebook'
                    style={{lineHeight:1}}>
                    <p style={
                        {
                            color:"#fff",
                            paddingLeft:10,
                            paddingRight:10,
                            paddingTop: 2
                        }
                    }>Facebook</p>
                </RaisedButton>
            </div>
        );
    },
});

module.exports = LandingContainer;
