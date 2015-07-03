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

     });

     app.get('/_groups', isLoggedIn, function(req, res) {
        DB.getGroups(req.user, _dbCallback(res));
     });

     app.post('/_add_group', isLoggedIn, function(req, res) {
        var groupObj = req.body.group;
        DB.addGroup(req.user, groupObj, _dbCallback(res));
     });


     app.get('/social/', isLoggedIn, function(req, res) {
        var groupId = req.query.groupId;
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
        // console.log('req.user: ' + Object.keys(req.user));
        // console.log('req.user.facebook.token: ' + req.user.facebook.token);

        FB.setAccessToken(req.user.facebook.token);
        // FB.api(req.user.facebook.id, function (res) {
        //     if(!res || res.error) {
        //        console.log(!res ? 'error occurred' : res.error);
        //        return;
        //     }
        //
        //     console.log(res.id);
        //     console.log(res.name);
        // });

        // FB.api('', 'post', {
        //     batch: [
        //         {method: 'get', relative_url: 'me/friends?limit=50'}
        //     ]
        // }, function(res) {
        //     if(!res || res.error) {
        //         console.log(!res ? 'error occurred' : res.error);
        //     } else {
        //         res0 = JSON.parse(res[0].body);
        //         if(res0.error) {
        //             console.log(res0.error);
        //         } else {
        //             console.log(res0);
        //         }
        //
        //         resThing.render('profile.ejs', {
        //             user : req.user // get the user out of session and pass to template
        //         });
        //     }
        //

        resThing.render('dash.ejs', {
            user : req.user // get the user out of session and pass to template
        });

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
