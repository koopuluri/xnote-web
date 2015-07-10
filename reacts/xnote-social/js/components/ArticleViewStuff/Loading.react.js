var React = require('react');

var mui = require('material-ui');
var CircularProgress = mui.CircularProgress;
// props:
// -marginTop (optional)
// -marginLeft (optional, but if marginTop is provided, this must be too; equality ftw).
// displayType (optional)
var Loading = React.createClass({

    render: function() {
      var top = this.props.marginTop ? this.props.marginTop + "%" : "40%";
      var left = this.props.marginLeft ? this.props.marginLeft + "%" : "37%";
      var display = this.props.displayType ? this.props.displayType : 'inline-block';

      return (
          <div className="loading" style={{marginTop: top, marginLeft: left, display: display}}>
              <CircularProgress mode="indeterminate" />
          </div>
      )
    }
});

module.exports = Loading;
