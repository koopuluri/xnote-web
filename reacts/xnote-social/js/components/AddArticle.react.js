var React = require('react');
var GroupActions = require('../actions/GroupActions');
var ContentStore = require('../stores/ContentStore');

var mui = require('material-ui');
var FloatingActionButton = mui.FloatingActionButton;
var Dialog = mui.Dialog;
var FlatButton = mui.FlatButton;
var TextField = mui.TextField;


var AddArticle = React.createClass({

	getInitialState: function() {
		return ({
			isParsing: ContentStore.getParsing()
		});
	},

	_openDialog: function() {
		this.refs.addArticleDialog.show();
	},

	_onArticleSubmit: function() {
		url = this.refs.addArticle.getValue();
		if(url) {
			this.refs.addArticle.clearValue();
			this.refs.addArticleDialog.dismiss();
			GroupActions.addArticle(url);
		}
	},

    render: function() {
    	var self = this;
    	var addArticleActions = [
  			{ text: 'Cancel', primary: true },
  			{ text: 'Add', onTouchTap: self._onArticleSubmit, primary: true}
		];
        return (
        	<div className = "add-article-container">
        		<Dialog
        			title = "Add Article"
  					actions={addArticleActions}
  					ref = "addArticleDialog"
  					modal={true}>
  					<div>
  						<TextField
  							fullWidth = {true}
  							hintText="> Paste URL here"
	  						ref = 'addArticle' />
	  				</div>
				</Dialog>
				<div className ='add-article-button'>
	            	<FloatingActionButton
		            	onTouchTap = {this._openDialog} />
	            </div>
    	    </div>
        );
    }
});

module.exports = AddArticle;
