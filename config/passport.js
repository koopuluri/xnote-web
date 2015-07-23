// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;
//var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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

    // =========================================================================
    // GOOGLE ================================================================
    // =========================================================================
    // passport.use('google', new GoogleStrategy({

    //     clientID        : configAuth.googleAuth.clientID,
    //     clientSecret    : configAuth.googleAuth.clientSecret,
    //     callbackURL     : configAuth.googleAuth.callbackURL,

    // },
    // function(token, refreshToken, profile, done) {

    //     // make the code asynchronous
    //     // User.findOne won't fire until we have all our data back from Google
    //     process.nextTick(function() {

    //         // try to find the user based on their google id
    //         User.findOne({ 'google.id' : profile.id }, function(err, user) {
    //             if (err)
    //                 return done(err);
    //             if (user) {
    //                 // if a user is found, log them in
    //                 return done(null, user);
    //             } else {
    //                 // if the user isnt in our database, create a new user
    //                 var newUser          = new User();

    //                 // set all of the relevant information
    //                 newUser.google.id    = profile.id;
    //                 newUser.google.token = token;
    //                 newUser.google.name  = profile.displayName;
    //                 newUser.google.email = profile.emails[0].value; // pull the first email

    //                 // save the user
    //                 newUser.save(function(err) {
    //                     if (err)
    //                         throw err;
    //                     return done(null, newUser);
    //                 });
    //             }
    //         });
    //     });

    // }));


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
