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
var FlatButton = mui.FlatButton;

var LoginSignup = require('./LoginSignup.react');

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
        ThemeManager.setPalette({
            textColor:"#FFF"
        })
        ThemeManager.setComponentThemes({
            raisedButton: {
                color: '#3b5998'
            },
        })
    },
	getInitialState: function() {
        return {
            group: LandingStore.getGroup(),
            isLoading: LandingStore.getLoading(),
            displayForm: false
        }
    },

    _onChange: function() {
        this.setState(this.getInitialState());
    },


    componentDidMount: function() {
        LandingStore.addChangeListener(this._onChange);
    },

    _toggleFormDisplay: function() {
        if (!this.state.displayForm)
            this.setState({displayForm: true});
        else 
            this.setState({displayForm: false});
    },

    facebookLogin: function() {
        //Actions.loginFacebook();
        window.location = '/auth/facebook';
    },

    googleLogin: function() {
        window.location = '/auth/google';
    },

    render: function() {
        var groupMessage ='';
        var groupCard ='';
        var group = this.state.group;

        var facebookButtonText = "Sign in with Facebook";
        var googleButtonText = "Sign in with Google";
        var standardLoginButtonText = "Sign in with email";

        var errorComp = '';
        if (this.props.error && (this.props.error !== null)) {
            errorComp = <p className="error" style={{color: 'red', fontSize: 14}}>
                There was an error logging in. Please try again in a few moments. 
            </p>
        }

        if(this.state.isLoading) {
            return (
                <div>
                    <div style={{padding:10}}>
                        <CircularProgress mode="indeterminate" />
                    </div>
                    {loginOptions}
                </div>
            );
        }

        if(group) {
            var facebookButtonText = "Join with Facebook";
            var googleButtonText = "Join with Google";
            var standardLoginButtonText = "Join with email";
            var groupMessage =  "You have been invited to join this group "
            var count = 0;

            var displayForm = this.state.displayForm ? <LoginSignup /> : '';

            var members = group.members.map(function(member) {
                count++;
                if(count < 5) {
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
                }
            });

            // adding group description:
            groupDescription='';
            if(group.description) {
                groupDescription = <p style={{color:"#FFF", maxWidth:"100%"}}>{group.description}</p>
            }


            var groupCard = 
                <div
                    style={{padding:30}}>
                    <Card zDepth={5} style={{
                            width:450,
                            'text-align':'center',
                            background:"rgba(150, 150, 150, 0.3)",
                            'margin':'auto'}}>
                        <div style={{
                            color:"#FFF",
                            paddingTop:20,
                            fontSize:16,
                            fontWeight:500,
                        }}>{groupMessage}</div>
                        <ListItem 
                            primaryText = {<p style={{color:"#FFF", maxWidth:"100%"}}>{group.title}</p>}
                            secondaryText = {groupDescription}
                            secondaryTextLines = {2}
                            disabled={true} 
                            style={{paddingBottom: 0}}/>
                        <Toolbar style={{
                            width:500,
                            backgroundColor:"default",
                            'text-align':'center',
                            'margin':'auto'}}>
                                {members}
                        </Toolbar>
                        <div></div>
                    </Card>
                </div>
        }

        var loginOptions=
            <div>
                <div style={{paddingTop:20}}>
                <span style={{padding:5}}>
                    <a onClick={this.facebookLogin} className="btn btn-facebook btn-xl btn-social">
                         <i className="fa fa-facebook"></i> {facebookButtonText}
                    </a>
                </span>
                <span style={{padding:5}}>
                    <a onClick={this.googleLogin} className="btn btn-google btn-xl btn-social">
                         <i className="fa fa-google"></i> {googleButtonText}
                    </a>
                </span>
                </div>
                <div style={{
                        paddingTop: 20,
                        paddingBottom: 20,
                        fontSize: 15,
                        fontFamily: "sans-serif",
                        fontWeight: 400,
                        color:"#F6F6F6",
                        cursor: 'pointer'
                    }} onClick={this._toggleFormDisplay}>
                    {standardLoginButtonText}
                </div>

                {displayForm}

            </div>

        return (
            <div classNam="row">
                {groupCard}
                {loginOptions}
            </div>
        );
    },
});

module.exports = LandingContainer;
