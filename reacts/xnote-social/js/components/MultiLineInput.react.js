var React = require('react');

// expected props:
// - onSave(text)
// - startingContent
// - width

var MultiLineInput = React.createClass({
    render: function() {
        return (
            <div className = 'multiline-input-textarea-container'>
                <textarea 
                  placeholder={this.props.startingContent}
                  rows="1" cols={this.props.width}
                  className={this.props.textareaClassName}></textarea>
            </div>
        );
    },

    // detecting shift + enter: ---> http://stackoverflow.com/questions/6014702/how-do-i-detect-shiftenter-and-generate-a-new-line-in-textarea
    componentDidMount: function() {
      // handling the text area for enter and shift-enter:
      // on submit of the textarea:
      var self = this;
      $('.' + self.props.textareaClassName).submit(function() {
          var noteContent = $('.' + self.props.textareaClassName).val();
          $('.' + self.props.textareaClassName).val('');
          self.props.onSave(noteContent);

      });

      $('.' + self.props.textareaClassName).keyup(function (event) {
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

module.exports = MultiLineInput;
