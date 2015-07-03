var React = require('react');
var Boot = require('react-bootstrap');

var Modal = Boot.Modal;
var Input = Boot.Input;
var Button = Boot.Button;

var ModalHeader = require('react-bootstrap/lib/ModalHeader');
var ModalTitle = require('react-bootstrap/lib/ModalTitle');
var ModalFooter = require('react-bootstrap/lib/ModalFooter');
var ModalBody = require('react-bootstrap/lib/ModalBody');

// props:
// - onSubmit(groupTitle, groupMembers)
// - onCancel()
var GroupForm = React.createClass({

    getInitialState: function() {
        return {
            titleValue: ''
        }
    },

    _handleInputChange: function() {
      // This could also be done using ReactLink:
      // http://facebook.github.io/react/docs/two-way-binding-helpers.html
      this.setState({
          titleValue: this.refs.input.getValue()
      });
    },

    _submit: function() {
        this.props.onSubmit(this.state.titleValue, []);
    },

    render: function() {
      var modalInstance = (
          <div className='add-group-modal'>
              <Modal
                  enforceFocus={false}
                  autoFocus={false}
                  backdrop={false}
                  animation={false}
                  onHide={function(){console.log('onHide()!')}}>

                  <ModalHeader>
                      <ModalTitle>Add Group</ModalTitle>
                  </ModalHeader>

                  <ModalBody>
                      <Input
                         type='text'
                         value={this.state.titleValue}
                         placeholder='Group title'
                         hasFeedback
                         ref='input'
                         groupClassName='group-class'
                         labelClassName='label-class'
                         onChange={this._handleInputChange} />
                  </ModalBody>

              <ModalFooter>
                  <Button onClick={this.props.onCancel}>Close</Button>
                  <Button onClick={this._submit} bsStyle='primary'>Save changes</Button>
              </ModalFooter>

              </Modal>
          </div>
      );

      return modalInstance;
    }
});

module.exports = GroupForm;
