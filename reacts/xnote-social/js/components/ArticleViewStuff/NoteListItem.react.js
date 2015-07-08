var React = require('react');
var Utils = require('./utils/NoteUtils');
var AddNoteInput = require('./AddNoteInput.react');
var Actions = require('../../actions/GroupActions');

var VIEW = 'view';
var EDIT = 'edit';

// props:
// - note
// - highlightId
var Note = React.createClass({

    getInitialState: function() {
        return {
            mode: VIEW
        }
    },

    _toggleMode: function() {
        if (this.state.mode == VIEW) {
            this.setState({mode: EDIT});
        } else {
            this.setState({mode: VIEW});
        }
    },


    _editSubmit: function(newNoteContent) {
        var note = this.props.note;
        // start the action:
        Actions.editNote(note.noteId, this.props.highlightId, newNoteContent);

        // going back to view mode:
        this._toggleMode();

    },

    render: function() {
      var topRow = null;

      // escaping the note content:
      var note = this.props.note;
      var content = note.content.replace(/\n/g, "<br />");

      var contentComp = null;
      var editIcon = null;
      if (this.state.mode == VIEW) {
          contentComp = (
                    <div key="a" className="col-md-12 discussion-note-content"
                          dangerouslySetInnerHTML={{__html: content}}>
                    </div>);

          editIcon = (
              <div className="col-md-2">
                  <img className="note-edit-icon" src="/static/edit-web.png" onClick={this._toggleMode}></img>
              </div>
          );
      } else {
          // content is now a textarea:
          contentComp = (
              <div key="b" className="col-md-12 discussion-note-content">
                  <AddNoteInput
                        textareaClassName="edit-note-text"
                        startingContent={note.content}
                        onSave={this._editSubmit}
                        textareaClassName="edit-note-text">
                  </AddNoteInput>
              </div>
          );

          // now replacing the edit icon with a cancel button:
          var editIcon = (
            <div className="col-md-2">
                <img className="note-edit-icon" src="/static/cross-note-web.png" onClick={this._toggleMode}></img>
            </div>
          );
      }




      if (this.props.note.canEdit) {
          topRow = (
            <div className="row note-row">
                <div className="col-md-6">
                    <div className="discussion-note-author"> {this.props.note.owner} </div>
                </div>
                <div className="col-md-4">
                    <div className="discussion-note-timestamp">{Utils._secondsToDate(this.props.note.timestamp)} </div>
                </div>

                {editIcon}
            </div>
          );
      } else {
          topRow = (
            <div className="row note-row">
                <div className="col-md-6">
                    <div className="discussion-note-author"> {this.props.note.owner} </div>
                </div>
                <div className="col-md-4">
                    <div className="discussion-note-timestamp">{Utils.timeSince(this.props.note.timestamp)} </div>
                </div>
            </div>
          );
      }

      return (
          <div className="discussion-note">

              {topRow}

              <div className="row note-row">
                  {contentComp}
              </div>
          </div>
      );
    }
});

module.exports = Note;
