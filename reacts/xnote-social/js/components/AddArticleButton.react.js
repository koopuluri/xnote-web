var React = require('react');

var mui = require('material-ui');
var FloatingActionButton= mui.FloatingActionButton;

var AddArticleButton = React.createClass({
    render: function() {
        return (
            <div className='add-article-button'>
                <FloatingActionButton />
            </div>
        );
    }
});

module.exports = AddArticleButton;
