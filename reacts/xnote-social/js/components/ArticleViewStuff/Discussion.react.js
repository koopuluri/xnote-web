var React = require('react');
var Actions = require('../../actions/ArticleActions');

var DiscussionStore = require('../../stores/DiscussionStore');
var GroupStore = require('../../stores/GroupStore');

var NoteList = require('./NoteList.react');
var AddNoteInput = require('./AddNoteInput.react');
var NoteUtils = require('./utils/NoteUtils');

var FeedPost = require('../FeedPost.react');

var Loading = require('./Loading.react');

var NO_NOTES_MESSAGE_WITH_USER = 'Use the form above to start a discussion.';
var NO_NOTES_MESSAGE_WITHOUT_USER = 'There are no notes for this highlight.'

var NO_DISC_SELECTED_MESSAGE = 'Select a highlight to see its notes or start a discussion by highlighting a part of the content to your right.';
var NO_DISC_SELECTED_AND_NO_USER = 'Select a highlight to see the notes.';

// var socket = io();

// props:
// - currentUser
var Discussion = React.createClass({
    getInitialState: function() {
        return {
            highlight: DiscussionStore.getHighlight(),
            error: DiscussionStore.getError(),
            isLoading: DiscussionStore.getLoading()
        }
    },

    // simplify, simplify, simplify... ... ...
    _onChange: function() {
        this.setState(this.getInitialState());
    },

    componentDidMount: function() {
        DiscussionStore.addChangeListener(this._onChange);
    },


    _socketGotNote: function(note) {
        if (DiscussionStore.getLastAddedNoteId() != note.noteId) {
            var disc = this.state.discussion;
            disc.notes.unshift(note);
            this.setState({discussion: disc});
        }
        // if this note has already been added, do nothing.
    },


    _addNoteFormOnSave: function(noteContent) {
        // logic to save this.state.text here
        var currentUser = GroupStore.getCurrentUser();
        if (!currentUser) {
            window.location.reload();
        } else {
            var newNote = {
                noteId: NoteUtils.generateUUID(),
                createdBy: GroupStore.getCurrentUser(),
                content: noteContent,
                createdAt: Math.floor(Date.now() / 1000)
            }
        }

        Actions.addNote(newNote, this.state.discussion.highlightId);
    },


    render: function() {
          var comp;

          if (this.state.error) {
              return (<p> error brah </p>);
          }

          if (this.state.isLoading) {
              return (<Loading />);
          }

          if (this.state.highlight) {

              var post = {
                  type: 'HighlightFeedPost',
                  highlight: this.state.highlight,
                  createdBy: {facebook: {name: 'Karthik Uppuluri', id: 'dkjsfkjs'}}
              }

              comp = <FeedPost post={post} actions="Article"/>
          } else {
              comp = 'Fuck you';
          }

          return (
              <div className="discussion-view-container">
                  <div className="discussion-view-contents">
                      {comp}
                  </div>
              </div>
          );
    },



    //
    // render: function() {
    //     if (this.state.error) {
    //         return (<p> error brah </p>);
    //     }
    //
    //     if (this.state.isLoading) {
    //         return (<Loading />);
    //     }
    //
    //     var messageStyle = {marginTop: '30%'};
    //
    //     // if there's no discussion selected:
    //     if (!this.state.highlight && !this.props.currentUser) {
    //         return (
    //             <div className="discussion-view-container">
    //                 <div className="discussion-view-contents">
    //                     <div className="message" style={messageStyle}>
    //                         <p> {NO_DISC_SELECTED_AND_NO_USER} </p>
    //                     </div>
    //                 </div>
    //             </div>
    //         );
    //     } else if (!this.state.highlight && this.props.currentUser) {
    //         return (
    //             <div className="discussion-view-container">
    //                 <div className="discussion-view-contents">
    //                     <div className="message" style={messageStyle}>
    //                         <p> {NO_DISC_SELECTED_MESSAGE} </p>
    //                     </div>
    //                 </div>
    //             </div>
    //         );
    //     }
    //
    //     var notes = this.state.highlight.notes;
    //
    //     // if there is a discussion selected, but it has no notes:
    //     if (notes.length == 0 && !this.props.currentUser) {
    //         return (
    //             <div className="discussion-view-contents">
    //                 <div className="message" style={messageStyle}>
    //                     <p> {NO_NOTES_MESSAGE_WITHOUT_USER} </p>
    //                 </div>
    //             </div>
    //         );
    //     } else if (notes.length == 0 && this.props.currentUser) {
    //         return (
    //             <div className="discussion-view-contents">
    //                 <AddNoteInput
    //                       highlightId={this.state.discussion.highlightId}
    //                       articleId={this.state.discussion.articleId}
    //                       onSave={this._addNoteFormOnSave}
    //                       textareaClassName="add-note-text">
    //                 </AddNoteInput>
    //                 <div className="message" style={messageStyle}>
    //                     <p> {NO_NOTES_MESSAGE_WITH_USER} </p>
    //                 </div>
    //             </div>
    //         );
    //     }
    //
    //     // means there's a dicusssion selected and it has notes:
    //     return (
    //         <div className="discussion-view-contents">
    //             <AddNoteInput
    //                   highlightId={this.state.discussion.highlightId}
    //                   articleId={this.state.discussion.articleId}
    //                   onSave={this._addNoteFormOnSave}
    //                   textareaClassName="add-note-text">
    //             </AddNoteInput>
    //             <div className="note-list-thing">
    //                 <NoteList notes={this.state.discussion.notes} />
    //             </div>
    //         </div>
    //     );
    // }
});

module.exports = Discussion;
