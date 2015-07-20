var React = require('react');
var GroupActions = require('../actions/ArticleActions');
var Constants = require('../constants/Constants');
var SnackStore = require('../stores/SnackStore');


var mui = require('material-ui');
var Snackbar = mui.Snackbar;


// state:
// - message
var SnackbarComponent = React.createClass({
	getInitialState: function() {
		return {
			message : SnackStore.getMessage(),
		}
	},

	componentDidMount: function() {
		SnackStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		SnackStore.removeChangeListener(this._onChange);
	},

	componentDidUpdate: function(prevProps, prevState) {
		if(this.state.message) {
			this.refs.SnackbarComponent.show();
		}
	},

	_dismiss: function() {
		this.refs.SnackbarComponent.dismiss();
	},

	_onChange: function() {
		this.setState(this.getInitialState());
	},

	render: function() {
		if(this.state.message) {
			return (
				<Snackbar
	  				message={this.state.message}
	  				ref = 'SnackbarComponent'
  					action='DONE'
	  				autoHideDuration={5000}
  					onActionTouchTap={this._dismiss}/>
  			);
  		} else {
  			return (
  				<div></div>
  			);
  		}
	}
});

module.exports = SnackbarComponent;
