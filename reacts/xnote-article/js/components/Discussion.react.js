var React = require('react');
var Actions = require('../actions/ArticleActions');

var DiscussionStore = require('../stores/DiscussionStore');
var NoteUtils = require('../utils/NoteUtils');

var FeedPost = require('./FeedPost.react');

var Loading = require('./Loading.react');

var NO_NOTES_MESSAGE_WITH_USER = 'Use the form to start a discussion.';
var NO_DISC_SELECTED_MESSAGE = 'Select a highlight to see its notes or start a discussion by highlighting a part of the content to your right.';

// var socket = io();

// props:
// - currentUser
var Discussion = React.createClass({
    getInitialState: function() {
        return {
            highlight: DiscussionStore.getHighlight(),
            error: DiscussionStore.getError(),
            isLoading: DiscussionStore.getLoading(),
        }
    },

    // simplify, simplify, simplify... ... ...
    _onChange: function() {
        this.setState(this.getInitialState());
    },

    componentDidMount: function() {
        DiscussionStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        DiscussionStore.removeChangeListener(this._onChange);
    },

    _socketGotNote: function(note) {
        if (DiscussionStore.getLastAddedNoteId() != note.noteId) {
            var light = this.state.highlight;
            light.notes.unshift(note);
            this.setState({highlight: light});
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
        Actions.addNote(this.state.highlight._id, newNote);
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
                  createdBy: this.state.highlight.createdBy,
              }

              comp = <FeedPost post={post} actions="Article" isLink = {false}/>
          } else {
              var messageStyle = {marginTop: '30%', marginLeft: '5%'};
              comp = <div className="message" style={messageStyle}>
                         <p> {NO_DISC_SELECTED_MESSAGE} </p>
                     </div>;
          }

          return (
              <div className="discussion-view-container">
                  <div className="discussion-view-contents">
                      {comp}
                  </div>
              </div>
          );
    }
});

module.exports = Discussion;
