//Lets load the mongoose module in our program
var mongoose = require('mongoose');
var Group = require('./models/Group');
var User = require('./models/User');
var Article = require('./models/Article');
var FeedPost = require('./models/FeedPost');
var Note = require('./models/Note');
var Highlight = require('./models/Highlight');


//Lets connect to our database using the DB server URL.
try {
    mongoose.connect('mongodb://localhost/myapp');
} catch (err) {
    console.log('seems connection already exists');
    // do nothing.
}

var DB = {

     // get all groups associated with user:
     getGroups: function(user, callback) {
        User.findOne({_id: user._id}).populate('groups')
                    .exec(function (err, populatedUser) {
                        callback({groups: populatedUser.groups});
        });
     },

     // add provided group for the provided user:
     addGroup: function(user, groupObj, callback) {
        var group = Group({
            title: groupObj.title,
            users: [user._id],
            groupId: groupObj.groupId
        });

        group.save(function(err) {
            if (err) {
                callback({error: err});
                return;
            }
            console.log('group saved successfuly!');
            // now saving the ref to this group in the user object:
            user.groups.push(group._id);
            user.save(function(err) {
                if (err) {
                    callback({error: err});
                } else {
                    console.log('added group to user!');
                }
            });

        });
     },

     addGroupMembers: function() {

     },

     removeGroupMembers: function() {

     },

     // ========================= ARTICLE ======================================

     addArticle: function(user, article, callback) {
        var self = this;
        var a = Article({
            createdBy: user._id,
            title: article.title,
            content: article.content,
            url: article.url,
            articleId: article.articleId,
            groupId: article.groupId,
            serialization: article.serialization
        });

        a.save(function(err, savedArticle) {
            if (err) {
                callback({error: err});
                return;
            }

            // adding a feedPost for this article:
            self._addFeedPostForArticle(user, savedArticle, callback)
        });
     },

     // only can delete article if user the creator of the article.
     deleteArticle: function(user, articleId, callback) {
        Article.findOne({articleId: articleId}, function(err, article) {
              article.remove(function (error, deletedArticle) {
                  if (error) {
                      callback({error: error});
                      return;
                  }

                  // article was deleted:
                  console.log('article deleted successfuly!');
                  callback({articleId: articleId});
              });
        });
     },

     addArticleFromUrl: function(user, groupId, url) {

     },

     // saves a new feedPost for an article
     _addFeedPostForArticle: function(user, article, callback) {
        var groupId = article.groupId;
        var post = FeedPost({
            createdBy: user,
            lastModifiedTimestamp: {type: Date, default: Date.now},
            type: 'ArticleFeedPost',
            groupId: article.groupId,
            article: article,
            articleId: article.articleId
        });

        post.save(function (err, savedObject) {
            if (err) {
                callback({error: err});
                return;
            }

            console.log('feedPost for article successfuly created!');
            callback({feedPostId: savedObject._id});
        });
     },


     // ========================= HIGHLIGHT ====================================


     addHighlight: function(user, highlight, callback) {
        var self = this;
        var light = Highlight({
            createdBy: user._id,
            highlightId: highlight.highlightId,
            articleId: highlight.articleId,
            clippedText: highlight.clippedText,
            groupId: highlight.groupId
        });

        light.save(function (err, savedHighlight) {
            if (err) {
                console.log('addHighlight error: ' + err);
                callback({error: err});
                return;
            }

            console.log('highlight successfuly saved');
            // now creating a feedPost for this highlight:
            self._addFeedPostForHighlight(user, savedHighlight, callback);
        });
     },

     _addFeedPostForHighlight: function(user, hl, callback) {
         var groupId = hl.groupId;
         var post = FeedPost({
             createdBy: user,
             lastModifiedTimestamp: {type: Date, default: Date.now},
             type: 'HighlightFeedPost',
             groupId: groupId,
             highlight: hl,
             highlightId: hl.highlightId
         });

         post.save(function (err, savedObject) {
             if (err) {

                 console.log('feedPost for highlight save error: ' + err);
                 callback({error: err});
                 return;
             }

             console.log('feedPost for highlight successfuly created!');
             callback({feedPostId: savedObject._id});
         });
     },

     deleteHighlight: function(user, groupId, highlightId, callback) {
        Highlight.findOne({highlightId: highlightId}, function(err, obj) {
            if (err) {
                callback({error: err});
                return;
            }

            console.log('highlight found to delete');

            // now checking if user owns the highlight:
            if (obj.createdBy.equals(user._id)) {
                // this user can delete this highlight:
                obj.remove(function (error, deletedObj) {
                    if (error) {
                        callback({error: error});
                        return;
                    }

                    console.log('highlight deleted successfuly');
                    callback({highlightId: highlightId});
                    return;
                });
            } else {
                console.log('invalid permissions, cannot delete highlight');
                callback({error: 'invalid permissions'});
            }
        });
     },

     // ========================= NOTE =========================================

     addNote: function(user, noteObj, highlightId, callback) {
        var self = this;
        var note = {
            createdBy: user,
            noteId: noteObj.noteId,
            content: noteObj.content,
        };

        Highlight.findOneAndUpdate({highlightId: highlightId},
            {$push: {'notes': note}},
            {safe: true, upsert: true},
            function (err, savedHighlight) {
                if (err) {
                    console.log('error in finding and updating the highlight: ' + err);
                    callback({error: err});
                }

                self._updateTimestampForHighlightFeedObject(savedHighlight._id, callback);
            });
     },


     _findNote: function(noteId, highlightId, callback) {
          Highlight.findOne({'highlightId': highlightId, 'notes.noteid': noteId},
            function (err, obj) {
                callback(err, obj);
            });
     },


     // ========================= FEED ======================================

     // sets last modified timestamp to NOW, only called when note added to highlight.
     _updateTimestampForHighlightFeedObject: function(highlightRef, callback) {
        console.log('_updatetimestamp: ' + highlightRef);
        FeedPost.findOne({highlight: highlightRef}, function (err, obj) {
            if (err) {
                console.log('could not get feed post to update its timestamp: ' + err);
                callback({error: err});
                return;
            }

            console.log('got the feedPost object for the highlight!');
            obj.lastModifiedTimestamp = Date.now();
            obj.save(function (err, savedPost) {
                if (err) {
                    console.log('could not save post after updat: ' + err);
                    callback({error: err});
                    return;
                }

                console.log('feedPost updated successfuly');
                callback({feedPostId: savedPost._id});
            });
        });
     },
}

module.exports = DB;

// testing out groups fetch and group save:
// getting user, and then saving a group for the user:
// User.findOne({'facebook.name': 'Karthik Uppuluri'}, function(err, user) {
//     if (err) {
//         console.log('pooped in getting user!');
//     } else {
//         console.log('about to save a dummy article!');
//         var dummyArticle = {
//             articleId: 'dummyArticle2!',
//             groupId: 'poopopo',
//             content: 'aksld;fjakl;fjklajfk;lasjdkfl;ajdklf;j',
//             title: 'dummyArticle! dude',
//             url: 'www.xnote.io',
//         }
//         // saving a dummy article:
//         DB.addArticle(user, dummyArticle, function(poop) {
//             console.log('poop: ' + Object.keys(poop));
//         });
//         //
//         // // going to delete the dummy article added above:
//         // DB.deleteArticle(user, 'dummyArticle!', function(poop) {
//         //     console.log('poop: ' + Object.keys(poop));
//         // });
//     }
// });


// testing out the highlight saving / deleting:
User.findOne({'facebook.name': 'Karthik Uppuluri'}, function(err, user) {
    if (err) {
        console.log('pooped in getting user!');
    } else {

        // adding note:
        var dummyNote = {
            noteId: 'dummyNote1',
            content: 'dummy note content',
        }

        console.log('about to add note');
        DB.addNote(user, dummyNote, 'pooplight', function(poop) {
            console.log('poop: ' + Object.keys(poop));
        });

        //
        // console.log('about to save a dummy highlight!');
        // var dummyHighlight = {
        //     articleId: 'dummyArticle2!',
        //     highlightId: 'pooplight',
        //     groupId: 'poopopo',
        //     clippedText: 'poop is the secret of my energy!',
        // }
        //
        // // saving a dummy highlight:
        // DB.addHighlight(user, dummyHighlight, function(poop) {
        //     console.log('poop: ' + Object.keys(poop));
        // });

        // // going to delete the dummy article added above:
        // DB.deleteHighlight(user, 'poopopo', 'dummyHighlight1', function(poop) {
        //     console.log('poop: ' + Object.keys(poop));
        // });
    }
});
