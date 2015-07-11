//Lets load the mongoose module in our program
var mongoose = require('mongoose');
var Group = require('./models/Group');
var User = require('./models/User');
var Article = require('./models/Article');
var FeedPost = require('./models/FeedPost');
var Note = require('./models/Note');
var Highlight = require('./models/Highlight');

var async = require('async');
var DIFFBOT_ID = '68d394da976cdc973aa825a7927660aa';



//Lets connect to our database using the DB server URL.
try {
    mongoose.connect('mongodb://localhost/myapp');
} catch (err) {
    console.log('seems connection already exists');
    // do nothing.
}

var DB = {

     // add provided group for the provided user:
     addGroup: function(user, groupObj, callback) {
        var group = Group({
            createdBy: user,
            title: groupObj.title,
            members: [user._id],
            groupId: groupObj.groupId
        });

        group.save(function(err) {
            if (err) {
                callback({error: err});
                return;
            }
            console.log('group saved successfuly!');
            callback({groupId: groupObj.groupId});
            // // now saving the ref to this group in the user object:
            // user.groups.push(group._id);
            // user.save(function(err) {
            //     if (err) {
            //         callback({error: err});
            //     } else {
            //         console.log('added group to user!');
            //     }
            // });

        });
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
            icon: article.icon,
            groupId: article.groupId,
            serialization: article.serialization,

            author: article.author,
            articleDate: article.articleDate,
            icon: article.icon,

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


     addArticleFromUrl: function(user, groupId, url, callback) {
        if (!url) {
            console.log('url is null');
            callback({error: 'empty url'});
        }

        var self = this;
        var Diffbot = require('diffbot').Diffbot;
        var diff = new Diffbot(DIFFBOT_ID);
        diff.article({
            uri: url
        }, function (err, response) {
            if (response.error) {
                console.log('diffbot error! ' + response.error);
                callback({error: response.error});
                return;
            }

            console.log('diffbot successfuly parsed! ' + response.title);

            var article = {
                groupId: groupId,
                title: response.title,
                content: response.html,
                author: response.author,
                icon: response.icon,
                url: response.url,
                articleDate: response.date

            }
            self.addArticle(user, article, callback);
        });
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

            console.log('feedPost for article successfuly created, now emitting something');
            article.createdBy = article.createdBy.facebook;
            savedObject.createdBy = user.facebook;
            callback({article: article, feedPost: savedObject});
        });
     },


     // ========================= HIGHLIGHT ====================================

     addHighlight: function(user, highlight, newSerialization, callback) {
        var self = this;
        var articleId = highlight.articleId;
        var light = Highlight({
            createdBy: user._id,
            highlightId: highlight.highlightId,
            articleId: highlight.articleId,
            clippedText: highlight.clippedText,
            groupId: highlight.groupId,
            selection: highlight.selection
        });

        light.save(function (err, savedHighlight) {
            if (err) {
                console.log('addHighlight error: ' + err);
                callback({error: err});
                return;
            }

            console.log('highlight successfuly saved');

            // now updati/ng the article serialization:
            Article.findOneAndUpdate({_id: articleId},
                {serialization: newSerialization},
                function(err, obj) {
                    if (err) {
                        console.log('article could not be updated!: ' + err);
                        callback({error: 'poop'});
                        return;
                    }

                    console.log('article serialization updtated!!!');
                    // now creating a feedPost for the highlight:
                    self._addFeedPostForHighlight(user, savedHighlight, callback);
                });

        });
     },

     _addFeedPostForHighlight: function(user, hl, callback) {
         var groupId = hl.groupId;
         console.log('HIIIIIIIIIIIIIIIGH: ' + hl);
         var hoolio = JSON.stringify(hl);
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

             console.log('saved post for highlight and returning:');
             callback({feedPost: savedObject, highlight: hl});
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

     addNote: function(user, highlightId, noteObj, callback) {
        var self = this;
        var note = {
            createdBy: user,
            noteId: noteObj.noteId,
            content: noteObj.content,
            owner: {name: user.facebook.name, id: user.facebook.id}
        };

        Highlight.findOneAndUpdate({highlightId: highlightId},
            {$push: {'notes': note}},
            {safe: true, upsert: true},
            function (err, savedHighlight) {
                if (err) {
                    console.log('error in finding and updating the highlight: ' + err);
                    callback({error: err});
                    return;
                }

                //self._updateTimestampForHighlightFeedObject(savedHighlight._id, callback);
                FeedPost.findOneAndUpdate({highlight: savedHighlight._id},
                    {$set: {'lastModifiedTimestamp': Date.now()}},
                    {},
                    function (err, savedFeedPost) {
                        if (err) {
                            console.log('error in finding and updating the FeedPost for highlight: ' + err);
                            callback({error: err});
                            return;
                        }

                        console.log('feedPost time updated: ' + savedFeedPost.lastModifiedTimestamp);
                        callback({note: note, highlightId: highlightId, groupId: savedHighlight.groupId});
                    });
            });
     },


     // ========================= FEED ========================================

     // sets last modified timestamp to NOW, only called when note added to highlight.
     // CANNOT save(), because that will cause the groups ref to be updated.
     // ===> MUST only update.
     _updateTimestampForHighlightFeedObject: function(highlightRef, callback) {
       FeedPost.findOneAndUpdate({highlight: highlightRef},
           {$set: {'lastModifiedTimestamp': Date.now()}},
           {},
           function (err, savedFeedPost) {
               if (err) {
                   console.log('error in finding and updating the FeedPost for highlight: ' + err);
                   callback({error: err});
               }

               console.log('feedPost time updated: ' + savedFeedPost.lastModifiedTimestamp);
           });
     },


     // ========================= GROUPS =======================================

     // get all groups associated with user:
     // ONLY POPULATE WITH: {title, members, createdAt}
     getGroups: function(user, callback) {
        User.findOne({_id: user._id}).populate('groups')
                    .exec(function (err, populatedUser) {
                        callback({groups: populatedUser.groups});
        });
     },

     getHighlight: function(user, highlightId, callback) {
        Highlight.findOne({highlightId: highlightId})
                  .populate('createdBy', 'facebook.id facebook.name')
                  .populate('notes.createdBy', 'facebook.id facebook.name')
                  .exec(function(err, doc) {
                      if (err) {
                          console.log('highlight populate error; ' + err);
                          callback({error: 'highlight getting messed up'});
                          return;
                      }
                      callback({highlight: doc});
                  });
     },

     // populate:
       // - user: (facebook.id, facebook.name)
       // - feedPost: (sub-populate the article / highlight ref within each feedPost)
       // - articles: (title, url; sub-populate(createdBy));
       getGroup: function(user, groupId, callback) {

          Group.findOne({groupId: groupId})
               .select('createdBy members groupId')
               .populate('createdBy', '-_id facebook.id facebook.name')
               .populate('members', '-_id facebook.id facebook.name')
               .exec(function(err, doc) {
                    if (err || !doc) {
                        if (err)
                            console.log('err in executing the population: ' + err);
                        callback({error: err});
                        return;
                    }

                    callback({group: doc});
               });
       },

     getUserInfo: function(user, callback) {
        callback({name: user.facebook.name, id: user.facebook.id});
     },

     getArticle: function(user, articleId, callback) {
        Article.findOne({_id: articleId}, function (err, obj) {
            if (err || !obj) {
                console.log('error: ' + err);
                callback({error: err});
                return;
            }

            // article found:
            console.log('article found: ' + obj.title);
            callback({article: obj});
        });
     },

     getFeedSegment: function(user, groupId, start, count, callback) {
        FeedPost.find({groupId: groupId})
                .sort({'lastModifiedTimestamp': 'desc'})
                .skip(start).limit(count)
                .populate('createdBy', '-_id facebook.id facebook.name')
                .populate('highlight', '-createdBy')
                .populate('highlight.notes', '-createdBy')
                .populate('article', '-createdBy')
                .exec(function(err, results) {
                    if(err) {
                        console.log('getFeedSegment error: ' + err);
                        callback({error: err});
                        return;
                    }

                    callback({feedPosts: results});
                });
     },

     getArticleListSegment: function(user, groupId, start, count, callback) {
        console.log('in articleListSegment!');
        Article.find({groupId: groupId})
               .sort({'createdAt': 'desc'})
               .skip(start).limit(count)
               .populate('createdBy', '-_id facebook.id facebook.name')
               .exec(function(err, results) {
                  if(err) {
                      console.log('articleListSegment: ' + err);
                      callback({error: err});
                      return;
                  }
                  console.log(results.length);
                  callback({articles: results});
               });
     },

     getChatListSegment: function(user, groupId, start, end) {

     },

     // ! need to check when adding user to group if user is already in group! 
     addGroupMember: function(user, groupId, member, callback) {

        User.findOne({'facebook.id': member.id}, function(err, userToAdd) {
            if (err) {
                console.log('add group member error: ' + err);
                callback({error: err});
                return;
            }

            console.log(userToAdd);
            // now get the group and update:
            Group.findOneAndUpdate({groupId: groupId}, 
                {$addToSet: {'members': userToAdd}}, 
                {}, 
                function(error, updatedGroup) {
                    if (err) {
                        console.log('add group member error: ' + err);
                        callback({error: err});
                        return;
                    }

                    console.log('updatedGroup: ' + updatedGroup);
                    User.update({_id: userToAdd._id}, 
                        {$addToSet: {groups: updatedGroup}},
                        {}, 
                        function(err, updatedUser) {
                            if (err) {
                                console.log('add group member error: ' + err);
                                callback({error: err});
                                return;
                            }

                            console.log('successfuly updated user and group');
                            //console.log(updatedGroup);
                            console.log(updatedUser);
                        });
                });
        });

     },

};

module.exports = DB;
//
// // testing out the highlight saving / deleting:
// User.findOne({'facebook.name': 'Vignesh Prasad'}, function(err, user) {
//     if (err) {
//         console.log('pooped in getting user!');
//     } else {

//         // DB.getGroup(user, 'testPoopGroup', function(obj) {
//         //     console.log(obj);
//         // });
//         DB.addGroupMember(user, 'testPoopGroup', {id: user.facebook.id}, function(obj) {
//             console.log('obj: ' + obj);
//         });

//         //
//         // DB.getArticleListSegment(user, 'testPoopGroup', 10, 3, function(obj) {
//         //     console.log('result: ' + Object.keys(obj));
//         // });

//         // console.log('got user!');
//         //
//         // DB.getGroup(user, 'testPoopGroup', function(poop) {
//         //     console.log('poop: ' + Object.keys(poop));
//         // });

//         // DB.addGroup(user, {
//         //     title: 'pooping the grouping',
//         //     groupId: 'testPoopGroup',
//         // }, function(poop) {
//         //     console.log('poop: ' + Object.keys(poop));
//         // });

//         // var articleId = '5599e642f836bb36631e2e9c';
//         // DB.getArticle(user, articleId, function(poop) {
//         //     console.log('article.title: ' + poop.article.title);
//         // });

//         //
//         // DB.addArticleFromUrl(user, 'testPoopGroup', 'http://paulgraham.com/ds.html', function(poop) {
//         //     console.log('poop: ' + Object.keys(poop));
//         // });



//         // var dummyGroup = {
//         //     title: 'dummy group thing!',
//         //     groupId: 'dummyGroup1'
//         // }
//         //
//         // DB.addGroup(user, dummyGroup, function(poop) {
//         //     console.log('poop: ' + Object.keys(poop));
//         // });

//         // // adding note:
//         // var dummyNote = {
//         //     noteId: 'dummyNote1',
//         //     content: 'dummy note content',
//         // }
//         //
//         // console.log('about to add note');
//         // DB.addNote(user, dummyNote, 'pooplight', function(poop) {
//         //     console.log('poop: ' + Object.keys(poop));
//         // });

//         //
//         // console.log('about to save a dummy highlight!');
//         // var dummyHighlight = {
//         //    articleId: '559cdcc98b120d12312b2315',
//         //    highlightId: 'pooplight',
//         //    groupId: 'testPoopGroup',
//         //    clippedText: 'poop is the secret of my energy!',
//         //    selection: {},
//         //    notes: []
//         // }
//         //
//         // // saving a dummy highlight:
//         // DB.addHighlight(user, dummyHighlight, '', function(poop) {
//         //     console.log('poop: ' + Object.keys(poop));
//         // });

//         // // going to delete the dummy article added above:
//         // DB.deleteHighlight(user, 'poopopo', 'dummyHighlight1', function(poop) {
//         //     console.log('poop: ' + Object.keys(poop));
//         // });
//     }
// });

