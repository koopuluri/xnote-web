// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User = require('../models/User');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use('facebook', new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,

    },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                if (user) {
                    if(!user.facebook.picture) {
                        User.findOneAndUpdate({_id: user._id}, 
                            {'facebook.picture': 'http://graph.facebook.com/' + user.facebook.id + '/picture?type=large'},
                            {},
                            function(err, updatedUser) {
                                if(err) {
                                    console.log('error adding picture to existing user: ' + err);
                                    throw err;
                                }

                                return done(null, updatedUser);
                            });
                    } else {
                        return done(null, user);
                    }
                    return null;  // should not reach this statement! 
                }

                if (err) {
                    console.log('error in finding user: ' + err);
                    return done(null, false);
                }

                var email = '';
                if (profile.emails && profile.emails.length > 0) {
                    email = profile.emails[0];
                }

                console.log('new user will be created');
                // if there is no user found with that facebook id, create them
                var newUser = new User();
                // set all of the facebook information in our user model
                newUser.facebook.id    = profile.id; // set the users facebook id
                newUser.facebook.token = token; // we will save the token that facebook provides to the user
                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                newUser.facebook.email = email;
                newUser.facebook.picture = 'http://graph.facebook.com/' + profile.id + '/picture';

                // save our user to the database
                newUser.save(function(err) {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return done(null, newUser);
                });
            });
        });

    }));
}
