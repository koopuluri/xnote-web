var DB = require('./MongoDB');

var  _dbCallback = function(res) {
        return function(dbOutput) {
            res.send(dbOutput);
        }
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
             successRedirect : '/social',
             failureRedirect : '/'
         }));

     // route for logging out
     app.get('/logout', function(req, res) {
         req.logout();
         res.redirect('/');
     });


     // get list of friends for the user (using facebook api):
     app.get('/_friends', isLoggedIn, function(req, res) {

     });


     app.get('/social/', isLoggedIn, function(req, res) {
        //var groupId = req.query.groupId;
        var groupId = 'testPoopGroup';
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

        // testing Graph API:
        var FB = require('fb');
//        FB.setAccessToken(req.user.facebook.token);
        resThing.render('dash.ejs', {
            user : req.user // get the user out of session and pass to template
        });

    });


    // =========================================================================
    app.get('/_my_groups', isLoggedIn, function(req, res) {
        DB.getGroups(req.user, _dbCallback(res));
    });

    app.get('/_group', isLoggedIn, function(req, res) {
        var groupId = req.query.groupId;
        console.log('groupId: ' + groupId);
        DB.getGroup(req.user, groupId, _dbCallback(res));
    });

    app.post('/_add_group', isLoggedIn, function(req, res) {
         var groupObj = req.body.group;
         DB.addGroup(req.user, groupObj, _dbCallback(res));
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

    app.get('/_get_user_info', isLoggedIn, function(req, res) {
        DB.getUserInfo(req.user, _dbCallback(res));
    });

    // -------------------------------------------------------------------------

    app.get('/_article', isLoggedIn, function(req, res) {
        var articleId = req.query.articleId;
        DB.getArticle(req.user, articleId, _dbCallback(res));
    });

    app.post('/_add_article_from_url', isLoggedIn, function(req, res) {
        var url = req.body.url;
        var groupId = req.body.groupId;
        DB.addArticleFromUrl(req.user, groupId, url, _dbCallback(res));
    });

    app.post('/_delete_article', isLoggedIn, function(req, res) {
        var articleId = req.body.articleId;
        DB.deleteArticle(req.user, articleId, _dbCallback(res));
    });

    // -------------------------------------------------------------------------

    app.get('/_highlight', isLoggedIn, function(req, res) {
        var highlightId = req.query.highlightId;
        DB.getHighlight(req.user, highlightId, _dbCallback(res));
    });

    app.post('/_add_highlight', isLoggedIn, function(req, res) {
        var highlightObj = req.body.highlight;
        var serialization = req.body.serialization;
        DB.addHighlight(req.user, highlightObj, serialization, _dbCallback(res));
    });

    app.post('/_remove_highlight', isLoggedIn, function(req, res) {
        var highlightId= req.body.highlightId;
        DB.removeHighlight(req.user, highlightId, _dbCallback(res));
    })

    // -------------------------------------------------------------------------

    app.post('/_add_note', isLoggedIn, function(req, res) {
        var note = req.body.note;
        var highlightId = req.body.highlightId;
        DB.addNote(req.user, highlightId, note, _dbCallback(res));
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
