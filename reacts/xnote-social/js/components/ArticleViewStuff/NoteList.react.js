var React = require('react');
var Note = require('./NoteListItem.react');

// expects props:
// - notes: a list of note objects
var NoteList = React.createClass({
    render: function() {
        var noteList = this.props.notes.map(function(note) {

          return (
            <Note note={note} />
          );
        });

        return (
            <div className="discussion-note-list">
                {noteList}
            </div>
        );
    }
});

module.exports = NoteList;
