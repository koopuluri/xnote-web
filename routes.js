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

            var groupId = feedPost.group;
            console.log('emitting feedPOst! for group: ' + groupId);
            io.emit('feedPost:' + groupId, feedPost);
        }

        res.send(dbOutput);
    };
};

var _callbackChatAdd = function(res, io) {

};

var SOCIAL = 'Social';
var LOCAL = 'Local';

// executed after user authenticated and when the user is about to be logged in
// (req.logIn(user)):
// - type: "SOCIAL" / "LOCAL"
var postLogin = function(req, res, next, err, user, info, type) {
    var redirectUrl = '/dashboard';


    if(err) { return res.send({error: 'Failed to authenticate. Check your credentials and try again in a few moments.'}); }

    if (!user) { 
        if (SOCIAL) {
            return res.redirect('/loginerror');
        } else {
            return res.send({error: 'Failed to authenticate. Check your credentials and try again in a few moments.'}); 
        }
    }

    // If we have previously stored a redirectUrl, use that, 
    // otherwise, use the default.
    var groupId = req.session.groupId;
    var articleId = req.session.articleId;

    if(groupId && !articleId) {
        redirectUrl = '/group?groupId=' + groupId;
        req.session.groupId = null;
    } else if (groupId && articleId) {
        redirectUrl = '/article?groupId=' + groupId + '&articleId=' + articleId;
        req.session.groupId = null;
        req.session.articleId = null;
    }

    req.logIn(user, function(err){
        if (err) { return next(err); }

        // if this user is not part of the group to redirect to (if group exists)
        // then add this user to that group:
        // note: this is only for when the user tries to get into a group alone, not article!
        if (groupId && !articleId) {
            console.log('adding user to group! groupId: ' + groupId);
            DB.addGroupMember(groupId, user, function(obj) {
                if(obj.error) {
                    console.log('error adding new user to group after login: ' + groupId);
                    if (SOCIAL) {
                        return res.redirect('/loginerror');
                    }
                    return res.send({error: 'Failed to login.'});
                }

                // no issues:
                if (SOCIAL) {
                    return res.redirect(redirectUrl);
                }
                return res.send({redirect: redirectUrl});
            });
        } else {
            if (SOCIAL) {
                return res.redirect(redirectUrl);
            }
            return res.send({redirect: redirectUrl});
        }
    });
};


module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    app.get('/loginerror', function(req, res) {
        res.render('index.ejs', {
            error: 'could not login',
            group: ''
        });
    });

    app.get('/', function(req, res) {
        var groupId = req.query.groupId;
        var articleId = req.query.articleId;

        req.session.groupId = groupId;
        req.session.articleId = articleId;

        res.render('index.ejs', {
            group: groupId,
            error: ''
        });
    });


    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope : ['email'] }));
    

    app.get('/auth/facebook/callback', function(req, res, next) {
        passport.authenticate('facebook', function(err, user, info) {
            return postLogin(req, res, next, err, user, info, SOCIAL);
        }) (req, res, next);
    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback', function(req, res, next) {
        passport.authenticate('google', function(err, user, info) {
            return postLogin(req, res, next, err, user, info, SOCIAL);
        }) (req, res, next);
    });

    app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            // check if email already taken error occured:
            if (!user) {
                // return the error to client side so it renders error message:
                res.send({error: 'Email already taken.'});
                return;
            }

            return postLogin(req, res, next, err, user, info, LOCAL);
        })(req, res, next);
    });


    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (!user) {
                // return error to client side to render error message for user:
                res.send({error: 'Email or password incorrect.'});
                return;
            }

            return postLogin(req, res, next, err, user, info, LOCAL);
        })(req, res, next);
    });

    // ===================================== GENERAL =====================================

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
            if(obj && obj.length > 0) {
                var friends = JSON.parse(obj[0].body).data;
                res.send({friends: friends});
            }
        });
    });


    app.get('/group/', isLoggedIn, function(req, res) {
        var groupId = req.query.groupId;
        for (var i = 0; i < req.user.groups.length; i++) {
            var group = req.user.groups[i];
            console.log(group.groupRef + 'vs.' + groupId);
            if (group.groupRef == groupId) {
                res.render('social.ejs', {
                    groupId: groupId,
                    userId: req.user._id
                });
                return;
            }
        }
        console.log('this user is not in group!: ' + req.user._id + ':' + groupId);
        res.redirect('/');
    });


    app.get('/article/', isLoggedIn, function(req, res) {
        var groupId = req.query.groupId;
        var articleId = req.query.articleId;

        console.log('/article: ' + groupId + '::' + articleId);
        res.render('article.ejs', {
            user: {facebook: req.user.facebook, _id: req.user._id},
            groupId: groupId,
            articleId: articleId
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

    app.post('/_clear_chat_notifs', isLoggedIn, function(req, res) {
        var groupId = req.body.groupId;
        DB.clearChatNotifs(req.user, groupId, _dbCallback(res));  
    });

    app.get('/_get_chat_notif_count', isLoggedIn, function(req, res) {
        var groupId = req.query.groupId;
        DB.getChatNotifCount(req.user, groupId, _dbCallback(res));
    });

    app.get('/_get_notif_count', isLoggedIn, function(req, res) {
        var groupId = req.query.groupId;
        DB.getNotifCount(req.user, groupId, _dbCallback(res));
    });

    app.post('/_viewed_notifs', isLoggedIn, function(req, res) {
        var group = req.body.groupId;
        DB.setNotifsLastViewed(req.user, group, _dbCallback(res));
    });

    app.get('/_notifs', isLoggedIn, function(req, res) {
        console.log('/notifs ');
        var groupRef = req.query.groupId;
        DB.getNotifs(req.user, groupRef, _dbCallback(res));
    });

    app.get('/_user_info', isLoggedIn, function(req, res) {
        console.log('hit /_user_info: ' + req.user.facebook.name);
        res.send({user: {facebook: {
                                name: req.user.facebook.name,
                                id: req.user.facebook.id,
                                picture: req.user.facebook.picture}
                            }});
    });

    app.get('/_get_feed_segment_across_groups', isLoggedIn, function(req, res) {
        var start = req.query.start;
        var count = req.query.count;
        DB.getFeedSegmentAcrossGroups(req.user, start, count, _dbCallback(res));
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

    app.get('/_group', function(req, res) {
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

    app.get('/_article', function(req, res) {
        var articleId = req.query.articleId;
        DB.getArticle(req.user, articleId, _dbCallback(res));
    });

    app.post('/_add_article_from_url', isLoggedIn, function(req, res) {
        var url = req.body.url;
        var groupId = req.body.groupId;
        DB.addArticleFromUrl(req.user, groupId, url, _callbackPostAdd(req.user, res, req.io), req.io);
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
        DB.addHighlight(req.user, highlightObj, serialization, _callbackPostAdd(req.user, res, req.io), req.io);
    });

    app.post('/_remove_highlight', isLoggedIn, function(req, res) {
        var highlightId= req.body.highlightId;
        DB.removeHighlight(req.user, highlightId, _dbCallback(res));
    })

    // -------------------------------------------------------------------------

    app.post('/_add_note', isLoggedIn, function(req, res) {
        var note = req.body.note;
        var highlightId = req.body.highlightId;
        DB.addNote(req.user, highlightId, note, _callbackNoteAdd(req.user, res, req.io), req.io);
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

    var groupId = req.query.groupId;
    var articleId = req.query.articleId;

    console.log('isLoggedIn: ' + groupId + '::' + articleId);
    if(groupId && !articleId) {
        // this means that this is a share link, that when logged in through will 
        // add the member to the group and open the group page.
        res.redirect('/?groupId=' + groupId);
        return;
    } else if (groupId && articleId) {
        // no ids at all, vanilla landing page.
        res.redirect('/?groupId=' + 
            groupId + 
            '&articleId=' + articleId);
        return;
    } 
    
    res.redirect('/');
    return;
}






















