var React = require('react');
var Input = require('./Input.react');
var _ = require('underscore');
var Actions = require('../actions/LandingActions');

var mui = require('material-ui');
var Card = mui.Card;
var RaisedButton = mui.RaisedButton;
var CardTitle = mui.CardTitle;
var TextField = mui.TextField;
var LoginStore = require('../stores/LoginStore');

var Colors = mui.Styles.Colors;
var ThemeManager = new mui.Styles.ThemeManager();

var LOGIN = 'Login';
var SIGNUP = 'Signup';


var LoginForm = React.createClass({

	childContextTypes : {
      muiTheme: React.PropTypes.object
    },

    getChildContext: function() { 
      return {
        muiTheme: ThemeManager.getCurrentTheme()
      }
    },

    componentWillMount: function() {
      	ThemeManager.setPalette({
            primary1Color: Colors.green500,
            focusColor: Colors.green500
        });
        ThemeManager.setComponentThemes({
            raisedButton: {
                primaryColor: Colors.green500,
        		primaryTextColor: "#FFF",
            },
        })
    },

	getInitialState: function(){
		return {
			name: "", 
			email: "",
			password: "",
			mode: SIGNUP,
			error: ''
		};
	},

	componentDidMount: function() {
		var self = this;
		LoginStore.addChangeListener(function() {
			self.setState({error: LoginStore.getError()});
		});
	},

	handleEmailChange: function(e){
		this.setState({
			email: e.target.value
		});
	},

	handlePasswordChange: function(e){
		this.setState({
			password: e.target.value
		});
	},

	handleNameChange: function(e) {
		this.setState({
			name: e.target.value
		});
	},

	_validateEmail: function(email) {
	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	    return re.test(email);
	},

	validate: function(state){
		return {
			name: state.name.length > 0,
			email: this._validateEmail(this.state.email),
			password: (state.password.length > 8 && this.state.password.match(/\d+/g) !== null)
		}
	},

	_toggleMode: function() {
		console.log("HMM");
		Actions._setError('');
		if (this.state.mode === LOGIN) {
			this.setState({
				mode: SIGNUP,
				name: '',
				email: '',
				password: ''
			});
		} else {
			this.setState({
				mode: LOGIN,
				name: '',
				email: '',
				password: ''
			});
		}
	},	

	_signup: function() {
		Actions.signup(this.state.name, this.state.email, this.state.password);
	},

	render: function() {

		var bottomTagStyle = {color: Colors.grey500, fontSize: 14, marginTop: '10px', cursor: 'pointer'}
		var errorStyle = {fontSize: 14, marginBottom: '10px', color: 'red'}

		var errorMessage = '';

		if (this.state.error) {
			errorMessage = <p style={errorStyle}>{this.state.error}</p> 
		}

		if (this.state.mode === SIGNUP) {
			var valid = this.validate(this.state);

			var submitButton = <RaisedButton 
									label="Sign Up"
									primary={true}
									disabled={true}/>;

			if (valid.name && valid.email && valid.password) {
				submitButton = <RaisedButton 
									primary={true}
									label="Sign Up"
									onTouchTap={this._signup}/>;
			}


			return (
				<div className="signup-form" style={{}}
					style={{
						textAlign: 'center'
					}}>
					{errorMessage}
					<CardTitle
				        title="Sign up" />
				        <div>
							<div className="login-input-name">
								<Input valid={valid.name}
									errorMessage='Name must be atleast one character long'
									value={this.state.name} 
									onChange={this.handleNameChange} 
									placeholder="name"/>
							</div>

							<div className="login-input-email">
								<Input valid={valid.email}
									errorMessage='Invalid email'
									value={this.state.email} 
									onChange={this.handleEmailChange} 
									placeholder="email"/>
							</div>

							<div className="login-input-pwd">
								<Input valid={valid.password}
									errorMessage='Password must be at last 8 characters long with at least 1 number'
									value={this.state.password}
									onChange={this.handlePasswordChange}
									placeholder="password" 
									type="password"/>
							</div>
						</div>
						{submitButton}
					<p onClick={this._toggleMode} style={bottomTagStyle}>Already a user?</p> 
					<span style={{padding:5}}>
                	    <a className="btn btn-facebook2 btn-social">
                        	<i className="fa fa-facebook"></i> Login with Facebook
                    	</a>
                	</span>
                	<span style={{padding:5}}>
                    	<a className="btn btn-google2 btn-social">
                         	<i className="fa fa-google"></i> Login with Google
                    	</a>
                	</span>
				</div>
			);
		} else {
			// login mode:
			return (
				<div className="login-form"
					style={{
						textAlign: 'center'
					}}>
					{errorMessage}
					<CardTitle
				        title="Login" />
		            <div className="login-email">
					    <TextField
							hintText='email'
							value={this.state.email}
							onChange={this.handleEmailChange} />
					</div>
					<div className="login-password">
						<TextField
							hintText="password"
							value={this.state.password}
							onChange={this.handlePasswordChange}
							type="password" />
					</div>
					<RaisedButton primary={true} label="Login" 
						onTouchTap={this._login} />
					<p onClick={this._toggleMode} style={bottomTagStyle}>Sign up for the first time</p> 
					<span style={{padding:5}}>
                	    <a className="btn btn-facebook2 btn-social">
                        	<i className="fa fa-facebook"></i> Login with Facebook
                    	</a>
                	</span>
                	<span style={{padding:5}}>
                    	<a className="btn btn-google2 btn-social">
                         	<i className="fa fa-google"></i> Login with Google
                    	</a>
                	</span>
				</div>
			);
		}
	}
});

module.exports = LoginForm;














