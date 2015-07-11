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
			  		{payload: note, text: 'Delete'},
				];
				var options = null
				if (note.owner) {
						if (this.props.user.facebook.id === note.owner.id) {
								var options =
									<DropDownIcon
										menuItems={noteOptions}
										closeOnMenuItemTouchTap = {true}
										onChange = {self._menuOptions}> +
									</DropDownIcon>
						}
				}

				var ownerName = note.owner ? note.owner.name : 'CrapNoteOwner'

				return (
						<div style = {{marginLeft : 12, backgroundColor : Colors.green50}}>
							<div style={{padding : 10}}>
								<p style = {{fontSize : 12, lineHeight: 0}}> {ownerName} </p>
								<p style = {{fontSize : 10, color : Colors.grey500}}> {note.createdAt} </p>
								<p>{note.content}</p>
							</div>
						</div>
				);
		}
});

module.exports = NoteComponent;
