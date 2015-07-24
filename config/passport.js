// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/User');

// load the auth variables
var configAuth = require('./auth');

var _validateEmail = function(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
};

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
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, name, email, done) {
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;

        if (! (name.length > 0 &&
                 _validateEmail(email) && 
                (password.length > 8 && password.match(/\d+/g) !== null))) {
            // invalid login params, break out:
            console.log('invalid login params!: ' + name);
            return done('Invalid Login Params.');
        }

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false);
            } else {

                // // if there is no user with that email
                // // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.local.name = name;
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    }

                    console.log('SAVED NEW USER!!!: ' + newUser.local.name);
                    return done(null, newUser);
                });
            }
        });

    });

    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, name, email, password, done) { // callback with email and password from our form

        // MUST REMOVE FOLLOWING LINE WHEN DEPLOYING! DONT EVER STORE PASSWORDS IN LOG FILES LIKE THAT!
        console.log('login: ' + name + ' email: ' + email + ' password: ' + password);
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });
    }));

    // =========================================================================
    // GOOGLE ================================================================
    // =========================================================================
    passport.use('google', new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(null, false);

                if (user) {
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser = new User();

                    var email = '';
                    if (profile.emails && profile.emails.length > 0) {
                        email = profile.emails[0].value;
                    }

                    if (!profile) {
                        return done(null, false);
                    }

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = email; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err) {
                            console.log('error saving user!');
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });

    }));


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
                    if (err) {
                        console.log('saving user!');
                        throw err;
                    }

                    // if successful, return the new user
                    return done(null, newUser);
                });
            });
        });

    }));
}
