var React = require('react');

var mui = require('material-ui');
var FloatingActionButton = mui.FloatingActionButton;
var Dialog = mui.Dialog;
var FlatButton = mui.FlatButton;
var TextField = mui.TextField;
var CircularProgress = mui.CircularProgress;


var AddGroupButton = React.createClass({

    getInitialState: function() {
        return null;
    },

    _onChange: function() {
    },

    componentDidMount: function() {
    },

    componentWillMount: function() {
    },

    _openDialog: function() {
        this.refs.addGroupDialog.show();
    },

    _onArticleSubmit: function() {
    },

    render: function() {
        var self = this;
        var addGroupActions = [
            { text: 'Cancel', primary: true },
            { text: 'Next', onTouchTap: self._onGroupNext, primary: true}
        ];
        return (
            <div className = "add-group-container">
                <Dialog
                    title = "Add Group"
                    actions={addGroupActions}
                    ref = "addGroupDialog"
                    modal={true}>
                    <div>
                        <TextField
                            fullWidth = {true}
                            hintText="Enter Group Name"
                            ref = 'addArticle' />
                    </div>
                </Dialog>
                <span className='add-group-button'>
                    <FloatingActionButton
                        onTouchTap = {this._openDialog} />
                </span>
            </div>
        );
    }
});

module.exports = AddGroupButton;
