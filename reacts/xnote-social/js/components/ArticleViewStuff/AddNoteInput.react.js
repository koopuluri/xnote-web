// handles receiving user input to add note to the discussion:
var React = require('react');
var NoteUtils = require('./utils/NoteUtils');
var Actions = require('../../actions/ArticleActions');
//var ContentEditable = require('react-wysiwyg');

// expected props:
// - discussionId
// - articleId
// - textareaClassName
// - onSave(text)
// - startingContent

var AddNoteInput = React.createClass({
    render: function() {
      console.log('textareaClassName: ' + this.props.textareaClassName);
        return (
            <div className="add-note-textarea-container">
                <textarea placeholder="Add note..." rows="1" cols="1" name="text" className={this.props.textareaClassName}></textarea>
            </div>
        );
    },

    // detecting shift + enter: ---> http://stackoverflow.com/questions/6014702/how-do-i-detect-shiftenter-and-generate-a-new-line-in-textarea
    componentDidMount: function() {
      // handling the text area for enter and shift-enter:
      // on submit of the textarea:
      var self = this;
      $('.' + this.props.textareaClassName).submit(function() {
          var noteContent = $('.' + self.props.textareaClassName).val();
          $('.' + self.props.textareaClassName).val('');
          self.props.onSave(noteContent);

      });

      $('.' + this.props.textareaClassName).keyup(function (event) {
          if (event.keyCode == 13) {
              var content = this.value;
              var caret = self._getCaret(this);
              if(event.shiftKey){
                  this.value = content.substring(0, caret - 1) + "\n" + content.substring(caret, content.length);
                  event.stopPropagation();
              } else {
                  this.value = content.substring(0, caret - 1) + content.substring(caret, content.length);
                  $('.' + self.props.textareaClassName).submit();
              }
          }
      });

      if (this.props.startingContent) {
          $('.' + this.props.textareaClassName).val(this.props.startingContent);
          $('.' + this.props.textareaClassName).focus();
      }
    },

    _getCaret: function(el) {
        if (el.selectionStart) {
            return el.selectionStart;
        } else if (document.selection) {
            el.focus();
            var r = document.selection.createRange();
            if (r == null) {
                return 0;
            }
            var re = el.createTextRange(), rc = re.duplicate();
            re.moveToBookmark(r.getBookmark());
            rc.setEndPoint('EndToStart', re);
            return rc.text.length;
        }
        return 0;
    },
});

module.exports = AddNoteInput;
