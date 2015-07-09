var React = require('react');
var GroupStore = require('../stores/GroupStore');
var GroupActions = require('../actions/GroupActions');

var mui = require('material-ui');
var ListItem = mui.ListItem;
var ListDivider = mui.ListDivider;
var Colors = mui.Styles.Colors;
var DropDownIcon = mui.DropDownIcon;


var NoteComponent = React.createClass ({

	_menuOptions: function(e, key, payload) {
		if(payload.text === "Delete") {
			this.props.actions.deleteNote(payload.payload);
		}
	},

	render: function() {
		var note = this.props.note
		var self = this
		var noteOptions = [
	  		{ payload: note, text: 'Delete' },
		];
		var options = null
		if (this.props.user.facebook.id === note.createdBy.facebook.id) {
			var options =
				<DropDownIcon
					menuItems={noteOptions}
					closeOnMenuItemTouchTap = {true}
					onChange = {self._menuOptions}> +
				</DropDownIcon>
		}
		var secondaryText =
			<p style = {
				{
					fontSize : 10,
					lineHeight : "10px",
				}
			}> {note.createdAt} </p>
		return (
			<div>
				<ListItem
					secondaryText = {secondaryText}
					disableTouchTap	= {true}
					rightIconButton={options}
					style = {
						{
							fontSize : 16,
							lineHeight : "16px",
							backgroundColor : Colors.green50
						}
					}>
					<p className = 'post-note-username' style = {{fontSize : 12}}>{note.createdBy.facebook.name}</p>
					<p className = 'post-note-content'>{note.content}</p>
				</ListItem>
				<ListDivider />
			</div>
		);
	}
});

module.exports = NoteComponent;
