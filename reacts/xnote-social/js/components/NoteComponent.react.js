var React = require('react');
var GroupStore = require('../stores/GroupStore');
var GroupActions = require('../actions/GroupActions');

var mui = require('material-ui');
var Avatar = mui.Avatar;
var ListItem = mui.ListItem;
var Card = mui.Card;
var CardText = mui.CardText;
var CardTitle = mui.CardTitle;
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

				var ownerName = note.owner ? note.owner.name : 'PoopNoteOwner'

				return (
					<ListItem
							disabled={true}
							style ={{
								padding : 10,
								backgroundColor : Colors.green50,
							}}
							primaryText = {
								<p style = {
									{
										fontSize : 13,
										lineHeight : 1,
										fontWeight: 800,
										paddingBottom : 0,
									}
								}>
									{ownerName}
								</p>	
								} 
							secondaryText = {
								<p style = {
									{
										paddingBottom : 0,
										fontSize : 15,
										fontColor : Colors.DarkBlack
									}
								}>
									{note.content}
								</p>
							}
							rightIconButton={options} />
				);
		}
});

module.exports = NoteComponent;
