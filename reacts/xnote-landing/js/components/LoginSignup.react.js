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

var LOGIN = 'Login';
var SIGNUP = 'Signup';


var LoginForm = React.createClass({

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

	_login: function() {

	},

	_signup: function() {
		console.log('singup! ' + this.state.name + '::' + this.state.email + '::' + this.state.password);
		Actions.signup(this.state.name, this.state.email, this.state.password);
	},

	render: function() {

		var bottomTagStyle = {fontSize: 14, marginTop: '10px', cursor: 'pointer'}
		var errorStyle = {fontSize: 14, marginBottom: '10px', color: 'red'}

		var errorMessage = '';

		if (this.state.error) {
			errorMessage = <p style={errorStyle}>{this.state.error}</p> 
		}

		if (this.state.mode === SIGNUP) {
			var valid = this.validate(this.state);

			var submitButton = <RaisedButton primary={true} disabled={true}>
									<span>Signup</span> 
								</RaisedButton>;

			if (valid.name && valid.email && valid.password) {
				submitButton = <RaisedButton primary={true} onTouchTap={this._signup}>
								 	<span>Signup</span> 
							   </RaisedButton>;
			}


			return (
				<div className="signup-form"
					style={{
						width: '400px',
						textAlign: 'center'
					}}>
					{errorMessage}
					<Card>
						<CardTitle
				            title="Sign up" />

						<div className="login-input-name">
							<Input valid={valid.name}
								errorMessage='name must be atleast one character long'
								value={this.state.name} 
								onChange={this.handleNameChange} 
								placeholder="name"/>
						</div>

						<div className="login-input-email">
							<Input valid={valid.email}
								errorMessage='invalid email'
								value={this.state.email} 
								onChange={this.handleEmailChange} 
								placeholder="email"/>
						</div>

						<div className="login-input-pwd">
							<Input valid={valid.password}
								errorMessage='password must be at last 8 characters long with at least 1 number'
								value={this.state.password}
								onChange={this.handlePasswordChange}
								placeholder="password" 
								type="password"/>
						</div>
						{submitButton}
					</Card>
					<p onClick={this._toggleMode} style={bottomTagStyle}>Already a user?</p> 
				</div>
			);
		} else {
			// login mode:
			return (
				<div className="login-form"
					style={{
						width: '400px',
						textAlign: 'center'
					}}>
					{errorMessage}
					<Card>
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

						<RaisedButton primary={true} 
							onTouchTap={this._login}> <span>Login</span> </RaisedButton>
					</Card>
					<p onClick={this._toggleMode} style={bottomTagStyle}>Sign up for the first time</p> 
				</div>
			);
		}
	}
});

module.exports = LoginForm;














