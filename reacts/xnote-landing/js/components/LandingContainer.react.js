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
var CircularProgress = mui.CircularProgress;

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
            isLoading: LandingStore.getLoading()
        }
    },

    _onChange: function() {
        this.setState(this.getInitialState());
    },


    componentDidMount: function() {
        LandingStore.addChangeListener(this._onChange);
    },
    
    render: function() {
        var groupMessage ='';
        var groupCard ='';
        var group = this.state.group;

        if(this.state.isLoading) {
            return (
                <div>
                    <p> Hey! Welcome to Tatr! </p>
                    <p> {groupMessage} </p>
                    <div style={{padding:10}}>
                        <CircularProgress mode="indeterminate" />
                    </div>
                    <p> To get started log in with Facebook.</p>
                    <RaisedButton 
                        linkButton={true}
                        href='/auth/facebook/poop'
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
        }

        if(group) {
            var groupMessage =  "Your have been invited to join this group "
            var members = group.members.map(function(member) {
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
                <div style={{padding:10}}>
                    <Card zDepth={1} style={{
                            width:450,
                            'text-align':'center',
                            'margin':'auto'}}>
                        <ListItem 
                            primaryText = {group.title}
                            secondaryText = {group.description}
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
                </div>
        }


        return (
            <div>
                <p> Welcome to Xnote! </p>
                <p> {groupMessage} </p>
                {groupCard}
                <p> To get started log in with Facebook.</p>
                <div style={{paddingTop:10}}>
                    <RaisedButton 
                        linkButton={true}
                        href='/auth/facebook/'
                        style={{lineHeight:1}}>
                        <p style={
                            {
                                color:"#fff",
                                paddingLeft:10,
                                paddingRight:10,
                                paddingTop: 3
                            }
                        }>Facebook</p>
                    </RaisedButton>
                </div>
            </div>
        );
    },
});

module.exports = LandingContainer;
