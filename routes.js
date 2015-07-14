var DB = require('./MongoDB');

var  _dbCallback = function(res) {
    return function(dbOutput) {
        res.send(dbOutput);
    }
};


var _callbackNoteAdd = function(user, res, io) {
    return function(dbOutput) {
        if (!dbOutput.error) {
            var note = dbOutput.note;
            note.createdBy = null;
            var highlightId = dbOutput.highlightId;
            var groupId = dbOutput.groupId;
            note.createdBy = {facebook: user.facebook};

            // now emitting through socket for the group channel:
            io.emit('note:' + groupId, {note: note, highlightId: highlightId, groupId: dbOutput.groupId});
            console.log('note emitted!');
        }

        res.send(dbOutput);
    };
};


var _callbackPostAdd = function(user, res, io) {
    return function(dbOutput) {
        if (!dbOutput.error) {
            // dbOutput guaranteed to have 'feedPost'
            // emit socket change:

            var feedPost = dbOutput.feedPost.toObject();
            feedPost.createdBy = {facebook: user.facebook};

            if (feedPost.type === 'HighlightFeedPost') {
                var highlight = dbOutput.highlight.toObject();
                highlight.createdBy = {facebook: user.facebook};
                feedPost.highlight = highlight;
            } else if (feedPost.type === 'ArticleFeedPost') {
                var article = dbOutput.article.toObject();
                article.content = '';
                article.createdBy = {facebook: user.facebook};
                feedPost.article = article;
            } else {
                console.log('INVALID POST TYPE: ' + feedPost.type);
            }

            var groupId = feedPost.groupId;
            io.emit('feedPost:' + groupId, feedPost);
        }

        res.send(dbOutput);
    };
};


var _callbackChatAdd = function(res, io) {

};

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email', 'user_friends'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/dashboard',
        failureRedirect : '/'
    }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // get list of friends for the user (using facebook api):
    app.get('/_friends', isLoggedIn, function(req, res) {
        var FB = require('fb');
        FB.setAccessToken(req.user.facebook.token);
        FB.api('', 'post', {
            batch: [
                { method: 'get', relative_url: 'me/friends' }
            ]
        }, function(obj) {
            var friends = JSON.parse(obj[0].body).data;
            res.send({friends: friends});
        });
    });


    app.get('/group/', isLoggedIn, function(req, res) {
        var groupId = req.query.id;
        console.log('going to group: ' + groupId);
        res.render('social.ejs', {
            groupId: groupId
        });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/dashboard', isLoggedIn, function(req, resThing) {
        resThing.render('dash.ejs', {

        });
    });


    // =========================================================================

    app.get('/_notifs', isLoggedIn, function(req, res) {
        console.log('/notifs ');
        var groupRef = req.query.groupId;
        DB.getNotifs(req.user, groupRef, _dbCallback(res));
    });

    app.get('/_user_info', isLoggedIn, function(req, res) {
        console.log('hit /_user_info: ' + req.user.facebook.name);
        res.send({user: {facebook: {name: req.user.facebook.name, id: req.user.facebook.id} } });
    });

    app.get('/_get_feed_segment', isLoggedIn, function(req, res) {
        var groupId = req.query.groupId;
        var start = req.query.start;
        var count = req.query.count;
        DB.getFeedSegment(req.user, groupId, start, count, _dbCallback(res));
    });

    app.get('/_get_chat_segment', isLoggedIn, function(req, res) {
        var groupId = req.query.groupId;
        var start = req.query.start;
        var count = req.query.count;
        DB.getChatSegment(req.user, groupId, start, count, _dbCallback(res));
    });

    app.get('/_get_article_list_segment', isLoggedIn, function(req, res) {
        var groupId = req.query.groupId;
        var start = req.query.start;
        var count = req.query.count;
        DB.getArticleListSegment(req.user, groupId, start, count, _dbCallback(res));
    });

    app.get('/_groups', isLoggedIn, function(req, res) {
        DB.getGroups(req.user, _dbCallback(res));
    });

    app.get('/_group', isLoggedIn, function(req, res) {
        var groupId = req.query.groupId;
        console.log('groupId: ' + groupId);
        DB.getGroup(req.user, groupId, _dbCallback(res));
    });

    app.post('/_add_chat', isLoggedIn, function(req, res) {
        var chat = req.body.chat;
        var groupId = req.body.groupId;

        // sending through socket right away:
        req.io.emit('chat:' + groupId, {chat: chat, groupId: groupId});

        DB.addChat(req.user, groupId, chat.chatId, chat.content, _dbCallback(res));
    });

    app.post('/_add_group', isLoggedIn, function(req, res) {
         var groupObj = req.body.group;
         var members = req.body.members;
         DB.addGroup(req.user, groupObj, members, _dbCallback(res));
    });

    app.post('/_add_group_members', isLoggedIn, function(req, res) {
        var members = req.body.members;
        var groupId = req.body.groupId;
        DB.addGroupMembers(req.user, groupId, members, _dbCallback(res));
    });

    app.post('/_remove_group_members', isLoggedIn, function(req, res) {
        var members = req.body.members;
        var groupId = req.body.groupId;
        DB.removeGroupMembers(req.user, groupId, members, _dbCallback(res));
    });


    // -------------------------------------------------------------------------

    app.get('/_article', isLoggedIn, function(req, res) {
        var articleId = req.query.articleId;
        DB.getArticle(req.user, articleId, _dbCallback(res));
    });

    app.post('/_add_article_from_url', isLoggedIn, function(req, res) {
        var url = req.body.url;
        var groupId = req.body.groupId;
        DB.addArticleFromUrl(req.user, groupId, url, _callbackPostAdd(req.user, res, req.io));
    });

    app.post('/_delete_article', isLoggedIn, function(req, res) {
        var articleId = req.body.articleId;
        DB.deleteArticle(req.user, articleId, _dbCallback(res));
    });

    // -------------------------------------------------------------------------

    app.get('/_highlight', isLoggedIn, function(req, res) {
        var highlightId = req.query.highlightId;
        DB.getHighlight(req.user, highlightId, _dbCallback(res), req.io);
    });

    app.post('/_add_highlight', isLoggedIn, function(req, res) {
        var highlightObj = req.body.highlight;
        var serialization = req.body.serialization;
        console.log(highlightObj);
        DB.addHighlight(req.user, highlightObj, serialization, _callbackPostAdd(req.user, res, req.io));
    });

    app.post('/_remove_highlight', isLoggedIn, function(req, res) {
        var highlightId= req.body.highlightId;
        DB.removeHighlight(req.user, highlightId, _dbCallback(res));
    })

    // -------------------------------------------------------------------------

    app.post('/_add_note', isLoggedIn, function(req, res) {
        var note = req.body.note;
        var highlightId = req.body.highlightId;
        DB.addNote(req.user, highlightId, note, _callbackNoteAdd(req.user, res, req.io));
    });

    app.post('/_delete_note', isLoggedIn, function(req, res) {
        var noteId = req.body.noteId;
        var highlightId = req.body.highlightId;
        DB.deleteNote(req.user, highlightId, noteId, _dbCallback(res));
    });

    app.post('/_edit_note', isLoggedIn, function(req, res) {
        var noteId = req.body.noteId;
        var highlightId = req.body.highlightId;
        var content = req.body.content;
        DB.editNote(req.user, highlightId, noteId, content, _dbCallback(res));
    });



};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log('req is authenticated!');
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}
