var React = require('react');
var Input = require('./Input.react');
var _ = require('underscore');

var mui = require('material-ui');
var Card = mui.Card;
var RaisedButton = mui.RaisedButton;
var CardTitle = mui.CardTitle;
var TextField = mui.TextField;

var LOGIN = 'Login';
var SIGNUP = 'Signup';


var LoginForm = React.createClass({

	getInitialState: function(){
		return {
			name: "", 
			email: "",
			password: "",
			mode: SIGNUP
		};
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

	validate: function(state){
		return {
			name: state.name.length > 0,
			email: state.email.length > 3,
			password: (state.password.length > 8 && this.state.password.match(/\d+/g) !== null)
		}
	},

	_toggleMode: function() {
		if (this.state.mode === LOGIN) {
			this.setState({mode: SIGNUP});
		} else {
			this.setState({mode: LOGIN});
		}
	},	

	render: function() {

		var bottomTagStyle = {fontSize: 14, marginTop: '10px', cursor: 'pointer'}

		if (this.state.mode === SIGNUP) {
			var valid = this.validate(this.state);

			var submitButton = <RaisedButton primary={true} disabled={true}>
									<span>Signup</span> 
								</RaisedButton>;

			if (valid.name && valid.email && valid.password) {
				submitButton = <RaisedButton primary={true}>
								 	<span>Signup</span> 
							   </RaisedButton>;
			}

			return (
				<div className="signup-form"
					style={{
						width: '400px',
						textAlign: 'center'
					}}>
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

						<RaisedButton primary={true} > <span>Login</span> </RaisedButton>
					</Card>
					<p onClick={this._toggleMode} style={bottomTagStyle}>Sign up for the first time</p> 
				</div>
			);
		}
	}
});

module.exports = LoginForm;














