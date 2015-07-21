window.React = require('react');
var API = require('./utils/API')
var MainContainer = require('./components/MainContainer.react');
var injectTapEventPlugin = require("react-tap-event-plugin");
var Actions = require('./actions/ArticleActions');

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var articleId = $('.article-id-span').attr('id');
var groupId = $('.group-id-span').attr('id');
var highlightId = window.location.hash.slice(1);

var user = $('.user-span').attr('id');

var user = JSON.parse(user);
var currentUser = {};
currentUser.facebook = user;

// set the article associated with the articleId in the stores:
Actions.fetchAndSetArticle(articleId);
Actions.fetchAndSetGroup(groupId);

if (highlightId) {
	Actions.fetchAndSetHighlight(highlightId);
}

//Render Flux Group App
React.render(
	<MainContainer groupId={groupId} currentUser={currentUser}/>,
	document.getElementById('main-container')
);