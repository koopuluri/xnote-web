var React = require('react');

// props:
// onClick()
var Butt = React.createClass({
    render: function() {
        buttonComp = (
            <div className="add-group-button turquoise"
                onClick={this.props.onClick}
                bsStyle='primary'
                bsSize='large'
                block>
                  Add Group
            </div>
        );
        return buttonComp;
    }
});

module.exports = Butt;
