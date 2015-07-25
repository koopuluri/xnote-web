var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var TextField = mui.TextField;

var Input = React.createClass({
    getInitialState: function(){
        // we don't want to validate the input until the user starts typing
        return {
            validationStarted: false
        };
    },

    prepareToValidate: function(){},

    componentWillMount: function(){
        var startValidation = function(){
            this.setState({
                validationStarted: true
            })
        }.bind(this);

        // if non-blank value: validate now
        if (this.props.value) {
           startValidation();
        }
        // wait until they start typing, and then stop
        else {
            this.prepareToValidate = _.debounce(startValidation, 1000);
        }
    },

    _handleChange: function(e){
        if (!this.state.validationStarted) {
            this.prepareToValidate();
        }
        this.props.onChange && this.props.onChange(e);
    },

    render: function(){
        var className = "";
        if (this.state.validationStarted) {
            if (this.props.valid) {
                // return with green outline and no errortext:
                return (
                    <TextField
                        hintText={this.props.placeholder}
                        value={this.props.value}
                        onChange={this._handleChange}
                        type={this.props.type} />
                );
            } else {
                return (
                    <TextField
                        hintText={this.props.placeholder}
                        value={this.props.value}
                        onChange={this._handleChange}
                        value={this.props.value}
                        errorText={this.props.errorMessage}
                        type={this.props.type} />
                );
            }
        } else {
            return (
                <TextField
                    hintText={this.props.placeholder}
                    value={this.props.value}
                    onChange={this._handleChange}
                    type={this.props.type} />
            );
        }
    }
});

module.exports = Input;








