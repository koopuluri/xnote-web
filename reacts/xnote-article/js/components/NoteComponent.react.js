var React = require('react');

var mui = require('material-ui');
var Avatar = mui.Avatar;
var ListItem = mui.ListItem;
var Card = mui.Card;
var CardText = mui.CardText;
var CardTitle = mui.CardTitle;
var Colors = mui.Styles.Colors;
var FontIcon = mui.FontIcon;
var IconButton = mui.IconButton;

var NoteComponent = React.createClass ({

		_menuOptions: function() {
			this.props.actions.deleteNote(this.props.note, this.props.highlightId);
		},

		render: function() {
				var note = this.props.note
				var self = this
				var options = null;
				if (this.props.user && this.props.user.facebook.id === note.owner.id) {
					var options =
						<FontIcon 
							style={{
								right: 0,
								color:Colors.grey500,
								cursor:"pointer",
							}}
							onClick = {this._menuOptions}
							className="material-icons">
									delete
						</FontIcon>
				}

				var ownerName = note.owner ? note.owner.name : 'PoopNoteOwner';
				return (
					<ListItem
						disabled={true}
						style ={{
							padding : 10,
							backgroundColor : Colors.green50,
						}}
						rightIconButton={options} >
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
							<p style = {
									{
										paddingBottom : 0,
										fontSize : 15,
										fontColor : Colors.DarkBlack
									}
								}>
								{note.content}
							</p>
					</ListItem>


				);
		}
});

module.exports = NoteComponent;
