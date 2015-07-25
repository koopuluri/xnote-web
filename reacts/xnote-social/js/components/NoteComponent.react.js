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


// props:
// - removeNote(note, highlightId)
var NoteComponent = React.createClass ({

		_menuOptions: function() {
			this.props.removeNote(this.props.note, this.props.highlightId);
		},

		render: function() {
				var note = this.props.note
				var self = this
				var options = null;
				if (!note.owner) {
					return '';
				}
				if (this.props.user && this.props.user.id === note.owner.id) {
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
					<div
						disabled={true}
						style ={{
							paddingLeft: 10,
							paddingRight: 10,
							paddingTop: 10,
							paddingBottom: 0
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
					</div>


				);
		}
});

module.exports = NoteComponent;
