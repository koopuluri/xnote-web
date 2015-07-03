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

     // ========================= ARTICLE ======================================

     addArticle: function(user, article) {
        var a = Article({
            createdBy: user._id,
            title: article.title,
            content: article.content,
            url: article.url,
            articleId: article.articleId,
            serialization: article.serialization
        });

        a.save(function(err) {
            if (err) {
                callback({error: err});
                return;
            }

            console.log('article saved successfuly');
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
                  callback({articleId: articleId});
                  console.log('article deleted successfuly!');
              });
        });
     },


     // ========================= HIGHLIGHT ====================================


     addHighlight: function(user, highlight) {
        var light = Highlight({
            createdBy: user._id,
            highlightId: highlight.highlightId,
            articleId: highlight.articleId,
            clippedText: highlight.clippedText,
        });

        light.save(function (err, obj) {
            if (err) {
                callback({error: err});
                return;
            }

            callback({id: obj.highlightId});
            console.log('highlight added!');
        });
     },

     deleteHighlight: function(user, highlightId) {
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
            }

            console.log('invalid permissions, cannot delete highlight');
            return callback({error: 'invalid permissions'});
        });
     },

     // ========================= NOTE =========================================

     addNote: function(user, noteObj) {
        var highlightId = note.highlightId;
        if (!highlightId) {
            callback({error: 'invalid highlightId'});
        }

        // creating the note model obj:
        var note = Note({
            createdBy: user._id,
            noteId: noteObj.noteId,
            content: noteObj.content,
            highlightId: highlightId
        });


        note.save(function (err, savedNote) {
            if (err) {
                console.log('note could not be saved: ' + err);
                callback({error: 'note could not be saved'});
                return;
            }

            // now update the highlight with the note ref:
            Highlight.findOne({highlightId: highlightId}, function (err, highlight) {
                if (err) {
                    callback({error: 'highlight could not be found for note'});
                    console.log('highlight note found to add note to: ' + highlightId);
                    return;
                }

                // highlight found, adding ref to this note to it's note list:
                highlight.notes.push(savedNote._id);
                highlight.save(function (err, savedHighlight) {
                    if (err) {
                        console.log('could not save highlight after adding note: ' + err);
                        callback({error: 'could not save highlight after adding note'});
                        return;
                    }

                    // now updating the lastModifiedTimestamp of the FeedObject associated with this highlight:
                    FeedPost.findOne({highlightId: highlightId}, function (err, obj) {
                        if (err) {
                            console.log('could not find feedPost for highlightId: ' + highlightId);
                            callback({error: 'feedPost not found for highlight'});
                            return;
                        }

                        // found feedPost, now updating its lastModifiedTimestamp:
                        obj.lastModifiedTimestamp = Date.now;

                        // now saving this feedPost:
                        obj.save(function (err, savedObj) {
                            if (err) {
                                console.log('could not save the updated feedPost');
                                callback({error: 'could not save the updated feedPost'});
                                return;
                            }

                            console.log('feedPost updated and saved; note added successfuly!');
                            callback({noteId: noteObj.noteId});
                        });
                    });
                });
            });
        });

        console.log('addNote, shouldnt even be here!');
        callback({error: ""});
     },

     deleteNote: function(user, noteId) {
        if (!noteId) {
            console.log('noteId is nothing: ' + noteId);
            callback({error: 'noteId is nothing'});
            return;
        }

        Note.findOne({noteId: noteId}, function (err, obj) {
            if (err) {
                console.log('deleteNote(): note not found for id: ' + noteId);
                callback({error: 'note not found'});
                return;
            }

            if (obj.createdBy.equals(user._id)) {
                // ok this user can delete this note:
                obj.remove(function (error, deletedNote) {
                    if (error) {
                        callback({error: error});
                        return;
                    }

                    // note was deleted:
                    callback({noteId: noteId});
                    console.log('note deleted successfuly!');
                    return;
                });
            }

            callback({error: 'no permission to delete this note!'});
            return;
        });
     },

     editNote: function(user, noteId, newContent) {
         if (!noteId) {
             console.log('editNote(): noteId is nothing: ' + noteId);
             callback({error: 'noteId is nothing'});
             return;
         }

         Note.findOne({noteId: noteId}, function (err, obj) {
             if (err) {
                 console.log('editNote(): note not found for id: ' + noteId);
                 callback({error: 'note not found'});
                 return;
             }

             if (obj.createdBy.equals(user._id)) {
                 // ok this user can delete this note:
                 obj.content = newContent;
                 obj.save(function (error, savedNote) {
                      if (error) {
                          console.log('editNote(): note could not be saved after found');
                          callback({error: 'note could not be saved'});
                      }

                      // note was deleted:
                      callback({noteId: noteId});
                      console.log('note deleted successfuly!');
                      return;
                 });
             }

             callback({error: 'no permission to delete this note!'});
             return;
         });
     },

     // ========================= FEED ======================================

     addArticleFeedObject: function(user, article) {

     },

     addHighlightFeedObject: function(user, highlightId) {

     },

     // sets last modified timestamp to NOW, only called when note added to highlight.
     updateTimestampForHighlightFeedObject: function(user, groupId, highlightId) {

     },
}

module.exports = DB;

// testing out groups fetch and group save:
// getting user, and then saving a group for the user:
// User.findOne({'facebook.name': 'Karthik Uppuluri'}, function(err, obj) {
//     if (err) {
//         console.log('pooped in getting user!');
//     } else {
//         // creating group and saving it for this user:
//         // groupObj = {
//         //     title: 'poopGroop',
//         //     groupId: 'thirdOne'
//         // }
//         // console.log('about to add to group!!!');
//         // DB.addGroup(obj, groupObj);
//
//         // getting all groups for this user:
//         console.log('got user! their groups: ' + obj.groups);
//         DB.getGroups(obj, function(res) {
//             if (res.error) {
//                 console.log('error in getting groups: ' + res.error);
//             } else {
//                 var groups = res.result;
//                 console.log('num of groups: ' + groups.length);
//                 console.log('groups for user: ' + res.result);
//             }
//         });
//     }
// });
