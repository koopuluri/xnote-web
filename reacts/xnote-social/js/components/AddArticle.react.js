var React = require('react');
var GroupActions = require('../actions/GroupActions');
var ContentStore = require('../stores/ContentStore');
var GroupStore = require('../stores/GroupStore');

var mui = require('material-ui');
var FloatingActionButton = mui.FloatingActionButton;
var Dialog = mui.Dialog;
var FlatButton = mui.FlatButton;
var TextField = mui.TextField;
var CircularProgress = mui.CircularProgress;


var AddArticle = React.createClass({

		getInitialState: function() {
			return {
				isParsing: ContentStore.getParsing()
			};
		},

		_onChange: function() {
			var storeIsParsing = ContentStore.getParsing();
			if (storeIsParsing !== this.state.isParsing) {
				this.setState(this.getInitialState());
			}
		},

		componentDidMount: function() {
				var self = this;
				ContentStore.addChangeListener(this._onChange);
		},

		componentWillMount: function() {
				ContentStore.removeChangeListener(this._onChange);
		},

		_openDialog: function() {
				this.refs.addArticleDialog.show();
		},

		_onArticleSubmit: function() {
				url = this.refs.addArticle.getValue();
				if(url) {
						this.refs.addArticle.clearValue();
						this.refs.addArticleDialog.dismiss();
						GroupActions.addArticleFromUrl(url, GroupStore.getGroupId());
				}
		},

		render: function() {
				if (this.state.isParsing) {
						return this.renderLoading();
				}

				return this.renderFAB();
		},


		// for when the article is parsing:
		renderLoading: function() {
				return (
						<div className="add-article-button">
								<CircularProgress mode="indeterminate" />
						</div>
				);
		},

    renderFAB: function() {
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
            	<div className='add-article-button'>
	            	<FloatingActionButton
	            		onTouchTap = {this._openDialog} />
    	        </div>
    	    </div>
        );
    }
});

module.exports = AddArticle;
