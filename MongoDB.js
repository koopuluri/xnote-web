//Lets load the mongoose module in our program
var mongoose = require('mongoose');
var Group = require('./models/Group');
var User = require('./models/User');
var Article = require('./models/Article');
var FeedPost = require('./models/FeedPost');
var Note = require('./models/Note');
var Highlight = require('./models/Highlight');
var Chat = require('./models/Chat');  //
var Notification = require('./models/Notification');
var ObjectId = mongoose.Schema.Types.ObjectId;

var DIFFBOT_ID = '04a5a577afefc946aa9f1ad57bfc6a98';

//Lets connect to our database using the DB server URL.
try {
    mongoose.connect('mongodb://koopuluri:whyisblue@ds045882.mongolab.com:45882/xnotelabs');
} catch (err) {
    console.log('seems connection already exists');
    // do nothing.
}

var DB = {
     // add provided group for the provided user:
     addGroup: function(user, groupObj, memberList, callback) {
        var group = Group({
            createdBy: user,
            title: groupObj.title,
            description: groupObj.description,
            members: [],
            _id: groupObj._id
        });

        // get all the user._ids of the users in the members list:

        var self = this;
        group.save(function(err, savedGroup) {
            if (err) {
                callback({error: err});
                return;
            }
            console.log('group saved successfuly, now adding members for it:');
            self.addGroupMember(savedGroup._id, user, callback);
        });
     },
     

     removeGroupMembers: function() {

     },

     // ========================= ARTICLE ======================================

     addArticle: function(user, article, callback, io) {
        var self = this;
        var a = Article({
            createdBy: user._id,
            title: article.title,
            content: article.content,
            url: article.url,
            icon: article.icon,
            group: article.group,
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
            self._addFeedPostForArticle(user, savedArticle, callback);
            self.addNotifsForArticle(user, savedArticle, function(notif) {
                console.log('emiting notif for article: ' + savedArticle.group + ':' + notif.user);
                io.emit('notification:' + savedArticle.group + notif.user, 
                    {notif: notif, article: savedArticle, user: {facebook: user.facebook} }); 
            });
        });
     },

     // only can delete article if user the creator of the article.
     deleteArticle: function(user, articleId, callback) {
        Article.findOne({_id: articleRef}, function(err, article) {
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

     addArticleFromUrl: function(user, groupRef, url, callback, io) {
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
                group: groupRef,
                title: response.title,
                content: response.html,
                author: response.author,
                icon: response.icon,
                url: response.url,
                articleDate: response.date

            }
            self.addArticle(user, article, callback, io);
        });
     },

     // saves a new feedPost for an article
     _addFeedPostForArticle: function(user, article, callback) {
        var groupRef = article.group;
        var post = FeedPost({
            createdBy: user,
            lastModifiedTimestamp: {type: Date, default: Date.now},
            type: 'ArticleFeedPost',
            group: groupRef,
            article: article,
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


     // TODO: add Notification for users that have added highlight(s) to the same article / creator of the article.
     addHighlight: function(user, highlight, newSerialization, callback, io) {
        var self = this;
        var light = Highlight({
            _id: highlight._id,
            createdBy: user._id,
            article: highlight.article,
            clippedText: highlight.clippedText,
            group: highlight.group,
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
            Article.findOneAndUpdate({_id: savedHighlight.article},
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

            // adding notifs for highlight: 
            self.addNotifsForHighlight(user, savedHighlight, function(notif) {
                io.emit('notification:' + savedHighlight.group + notif.user,
                     {notif: notif, highlight: savedHighlight, user: {facebook: user.facebook} }); 
            });
        });
     },

     _addFeedPostForHighlight: function(user, hl, callback) {
         var post = FeedPost({
             createdBy: user,
             type: 'HighlightFeedPost',
             group: hl.group,
             highlight: hl,
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

     deleteHighlight: function(user, groupId, highlightRef, callback) {
        Highlight.findOne({_id: highlightRef}, function(err, obj) {
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
                    callback({highlightId: highlightRef});
                    return;
                });
            } else {
                console.log('invalid permissions, cannot delete highlight');
                callback({error: 'invalid permissions'});
            }
        });
     },

     // ========================= NOTE =========================================

     // TODO: add notifications for users that have also added notes to the same highlight / creator of highlight.
     addNote: function(user, highlightRef, noteObj, callback, io) {
        var self = this;
        var note = {
            createdBy: user,
            noteId: noteObj.noteId,
            content: noteObj.content,
            owner: {name: user.facebook.name, id: user.facebook.id}
        };

        Highlight.findOneAndUpdate({_id: highlightRef},
            {$push: {'notes': note}},
            {safe: true, upsert: true},
            function (err, savedHighlight) {
                if (err) {
                    console.log('error in finding and updating the highlight: ' + err);
                    callback({error: err});
                    return;
                }

                //self._updateTimestampForHighlightFeedObject(savedHighlight._id, callback);
                console.log('savedHighlight._id: ' + savedHighlight._id)
                FeedPost.findOneAndUpdate({highlight: savedHighlight._id},
                    {$set: {'lastModifiedTimestamp': Date.now()}},
                    {},
                    function (err, savedFeedPost) {
                        if (err || !savedFeedPost) {
                            console.log('error in finding and updating the FeedPost for highlight: ' + err);
                            callback({error: err});
                            return;
                        }

                        console.log('feedPost time updated: ' + savedFeedPost.lastModifiedTimestamp);
                        callback({note: note, highlightId: highlightRef, groupId: savedHighlight.group});
                    });

                // notifs:
                self.addNotifsForNoteAdd(user, savedHighlight, function(notif) {
                    // socket.io'ing the notif:
                    console.log('emitting notif for note add!');
                    console.log(notif);
                    io.emit('notification:' + savedHighlight.group + notif.user,
                         {notif: notif, highlight: savedHighlight, user: {facebook: user.facebook} });
                });
            });
     },

     // ========================= GROUPS =======================================

     // get all groups associated with user:
     // ONLY POPULATE WITH: {title, members, createdAt}
     getGroups: function(user, callback) {
        User.findOne({_id: user._id})
                    .populate('groups.groupRef')
                    .exec(function (err, populatedUser) {
                        callback({groups: populatedUser.groups});
        });
     },

     getHighlight: function(user, highlightRef, callback) {
        Highlight.findOne({_id: highlightRef})
                  .populate('createdBy', 'facebook.id facebook.name facebook.picture')
                  .populate('notes.createdBy', 'facebook.id facebook.name facebook.picture')
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
       getGroup: function(user, groupRef, callback) {
            Group.findOne({_id: groupRef})
               .select('createdBy members groupId title description')
               .populate('createdBy', '-_id facebook.id facebook.name facebook.picture')
               .populate('members', '-_id facebook.id facebook.name facebook.picture')
               .exec(function(err, doc) {
                    if (err || !doc) {
                        if (err)
                            console.log('err in executing the population: ' + err);
                        callback({error: 'poop'});
                        return;
                    }
                    callback({group: doc});
               });
       },

     getUserInfo: function(user, callback) {
        callback({name: user.facebook.name, id: user.facebook.id, picture: user.facebook.picture});
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


     getFeedSegmentAcrossGroups: function(user, start, count, callback) {
        var groupIds = [];
        for (var i = 0; i < user.groups.length; i++) {
            groupIds.push(user.groups[i].groupRef);
        }

        console.log('feedSegAcrosGroups: ' + groupIds + '?' + groupIds.length);

        FeedPost.find({group: {$in: groupIds} })
                .sort({'lastModifiedTimestamp': 'desc'})
                .skip(start).limit(count)
                .populate('createdBy', '-_id facebook.id facebook.name facebook.picture')
                .populate('highlight', '-createdBy')
                .populate('highlight.notes', '-createdBy')
                .populate('article', '-createdBy')
                .exec(function(err, results) {
                    if(err) {
                        console.log('getFeedSegment error: ' + err);
                        callback({error: err});
                        return;
                    }

                    Article.populate(results, {path: 'highlight.article', select: 'title _id'},
                        function(err, poppedFeedPosts) {
                            if(!err) {
                                callback({feedPosts: poppedFeedPosts});
                                return;
                            }

                            console.log('error populating feedPosts article: ' + err);
                            callback({error: 'feedPost pooped'});
                        });

                    
                });
     },

     getFeedSegment: function(user, groupRef, start, count, callback) {
        FeedPost.find({group: groupRef})
                .sort({'lastModifiedTimestamp': 'desc'})
                .skip(start).limit(count)
                .populate('createdBy', '-_id facebook.id facebook.name facebook.picture')
                .populate('highlight', '-createdBy')
                .populate('highlight.notes', '-createdBy')
                .populate('article', '-createdBy')
                .exec(function(err, results) {
                    if(err) {
                        console.log('getFeedSegment error: ' + err);
                        callback({error: err});
                        return;
                    }

                    Article.populate(results, {path: 'highlight.article', select: 'title _id'},
                        function(err, poppedFeedPosts) {
                            if(!err) {
                                callback({feedPosts: poppedFeedPosts});
                                return;
                            }

                            console.log('error populating feedPosts article: ' + err);
                            callback({error: 'feedPost pooped'});
                        });

                    
                });
     },

     getArticleListSegment: function(user, groupRef, start, count, callback) {
        Article.find({group: groupRef})
               .sort({'createdAt': 'desc'})
               .skip(start).limit(count)
               .populate('createdBy', '-_id facebook.id facebook.name facebook.picture')
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

     getChatSegment: function(user, groupRef, start, count, callback) {
        Chat.find({group: groupRef})
               .sort({'createdAt': 'desc'})
               .skip(start).limit(count)
               .populate('createdBy', '-_id facebook.id facebook.name facebook.picture')
               .exec(function(err, results) {
                  if(err) {
                      console.log('chatSegment error: ' + err);
                      callback({error: err});
                      return;
                  }
                  console.log(results.length);
                  callback({chats: results});
               });
     },

     addChat: function(user, groupRef, chatId, content, callback) {
        if (!groupRef || !content) {
            callback({error: 'poop'});
            return;
        }

        var chat = Chat({
            _id: chatId,
            group: groupRef,
            createdBy: user,
            content: content,
            chatId: chatId
        });

        var self = this;
        chat.save(function(err, savedChat) {
            if (err) {
                console.log('addChat error: ' + err);
                callback({error: err});
            }

            // chat saved!
            // time to increment chat notif count for all the users in the group
            // besides this user:
            Group.findOne({_id: groupRef}, function(err, group) {
                if(!err) {
                    for (var i = 0; i < group.members.length; i++) {
                        var mem = group.members[i];
                        // increment chat notif for this member:
                        if (!mem.equals(user._id)) {
                            self.incrementChatNotifCount({_id: mem}, group._id, function(obj) {
                                // do nothing.
                            });
                        }
                    }
                }
            });

            callback({chat: savedChat.content});
        });
     },

     addGroupMember: function(groupRef, user, callback) {
        // only gets the user if it doesn't have groupRef in its list of groups already:
        User.findOne({_id: user._id, 'groups.groupRef': {$ne: groupRef} }, 
          function(err, userToAdd) {
              if (err || !userToAdd) {
                  console.log('cannot add user because it seems user already has group: ' + err);
                  if (!userToAdd) {
                      callback({groupId: groupRef});
                      return;
                  }

                  // return the error:
                  callback({error: 'cannot add user to group'});
                  return;
              }

              Group.findOneAndUpdate({_id: groupRef},
                {$push: {members: userToAdd} },
                {},
                function(err, updatedGroup) {
                    if (err || !updatedGroup) {
                        console.log('error saving group when updating members; ' + err);
                        callback({error: 'some group fetching error'});
                    } else {
                        callback({groupId: updatedGroup._id});
                    }
                });

              // updating the groups list for the user to add:
              User.findOneAndUpdate({_id: userToAdd._id},
                  {$addToSet: {groups: {groupRef: groupRef} }},
                  {},
                  function(err, savedMem) {
                      if(err) {
                          console.log('err updating groups for a member: ' + err);
                          callback({error: 'some user fetching error for adding member(s) to group'});
                      } else {
                          console.log('user successfuly saved new group for it: ' + savedMem._id);
                      }
                  });
          });
     },

     // // ! need to check when adding user to group if user is already in group! 
     // addGroupMembers: function(user, groupRef, members, callback) {
     //    console.log('ADD GROUP MEMBERS: ' + groupRef + 'mems: ' + members.length);
     //    // getting all users with facebook.id $in [members] that are not already in groupRef group:
     //    User.find({'facebook.id': {$in: members}, 'groups.groupRef': {$ne: groupRef}}, function(err, usersToAdd) {
     //        if (err) {
     //            console.log('getting users based on member list failed: ' + members);
     //            return;
     //        }

     //        // adding these users to the group:
     //        // first: add all the users to the group's list:
     //        Group.findOneAndUpdate({_id: groupRef},
     //            {$pushAll: {members: usersToAdd}},
     //            {},
     //            function(err, updatedGroup) {
     //                if (err || !updatedGroup) {
     //                    console.log('error saving group when updating members; ' + err);
     //                    callback({error: 'some group fetching error'});
     //                } else {
     //                    callback({groupId: updatedGroup._id});
     //                }
     //            });

     //        // for each user, add the groupRef to their lists of groups they are a part of:
     //        for (var i = 0; i < usersToAdd.length; i++) {
     //            var mem = usersToAdd[i];
     //            User.findOneAndUpdate({_id: mem._id},
     //                {$addToSet: {groups: {groupRef: groupRef} }},
     //                {},
     //                function(err, savedMem) {
     //                    if(err) {
     //                        console.log('err updating groups for a member: ' + err);
     //                        callback({error: 'some user fetching error for adding member(s) to group'});
     //                    } else {
     //                        console.log('user successfuly saved new group for it: ' + savedMem.facebook.name);
     //                    }
     //                });
     //        }

     //    });

     // },

     // given article ref, goes through all members of the parent group, and 
     // adds notif for each one of them:
     addNotifsForArticle: function(creatingUser, article, callback) {
        console.log('add notif for article!: ' + article.group);
        Group.findOne({_id: article.group}).populate('members')
             .exec(function(err, doc) {
                if (err) {
                    console.log("error finding group for article in adding notifs: " + article._id);
                    return;
                }

                // now going through each user and creating a notification for them (except the creator):
                for (var i = 0; i < doc.members.length; i++) {
                    var mem = doc.members[i];
                    console.log('compare: ' + mem._id + ' vs. ' + creatingUser._id);
                    if (!mem._id.equals(creatingUser._id)) {
                        // create a notif for them:
                        var notif = Notification({
                            group: doc,
                            user: mem,
                            article: article
                        });

                        notif.save(function(err, savedNotif) {
                            if (err) {
                                console.log('notif failed to save: ' + err);
                            } else {
                                console.log('notif successfuly saved!');
                                // else: 
                                callback(notif);
                            }
                        }); 
                    }
                }
             });
     },

     // given a highlight ref, goes through all other highlights for the parent article,
     // (and the owner of the parent article).
     // and for each owner of these other highlights, sends them a notification that a 
     // new highlight has been added for the article
     addNotifsForHighlight: function(user, light, callback) {
        var articleRef = light.article;

        console.log('add notifs for highlight.articleRef: ' + articleRef);

        // now sending notif to the owner of the article that this highlight resides in:
        Article.findOne({_id: articleRef}, function(err, art) {
            if (err) {
                console.log('error finding article for highlight in highlight notifs add: ' + err);
            } else {
                // add notif for owner of the article:
                if (!art.createdBy.equals(user._id)) {
                    // add notif for this user:
                    var notif = Notification({
                        group: light.group,
                        user: art.createdBy,
                        forNote: false,
                        highlight: light._id,
                    });

                    notif.save(function(err, savedNotif) {
                        if (err) {
                            console.log('notif not saved for creator of article: ' + articleRef);
                        } else {
                            console.log('notif saved for article owner for highlight: ' + articleRef);
                            callback(savedNotif);
                        }
                    });
                }


                // finding all other highlights for this article, and sending notifs:
                Highlight.find({article: articleRef}, function(err, docs) {
                    if(err) {
                        console.log('error finding highlights with article: ' + articleRef);
                        return;
                    }

                    for (var i = 0; i < docs.length; i++) {
                        var highlight = docs[i];
                        if (!highlight.createdBy.equals(user._id) && !highlight.createdBy.equals(art.createdBy)) {
                            // for all other users besides the one who created this highlight:
                            var notif = Notification({
                                group: light.group,
                                user: highlight.createdBy,
                                forNote: false,
                                highlight: light._id,
                            });

                            notif.save(function(err, savedLight) {
                                if(err) {
                                    console.log('failed to save highlight for add notif: ' + err);
                                } else {
                                    // add notif:
                                    console.log('saved notif for highligth and now sending through io!');
                                    callback(notif);
                                }
                            });
                        }
                    }
                });
            }   
        });
     },

     // goes through each owner of the note for the highlight (and the owner of the highlightRef),
     // and sends them a notification if they don't already have a notification for this highlightRef.
     addNotifsForNoteAdd: function(noteCreator, savedHighlight, callback) {
        var notes = savedHighlight.notes;
        console.log('addNotifsForNoteAdd notes.length: ' + notes.length);

        var completedUserSet = Object.create(null);
        for(var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var user = note.createdBy;
            if (!user.equals(noteCreator._id) && 
                  (! (user._id in completedUserSet)) ) {

                completedUserSet[user._id] = true;
                // now have to check if this user already has this highlight as a notification:
                // if it does, then just update it so: (forNote = true).
                // otherwise, create a notif for this highlight for this user:

                var notif = Notification({
                    group: savedHighlight.group,
                    highlight: savedHighlight._id,
                    user: user,
                    forNote: true
                });

                console.log('savedHighlight');
                console.log(savedHighlight);

                // so finding one and updating if existing otherwise inserting.
                Notification.findOneAndUpdate({user: user, group: savedHighlight.group},
                    {$set: {
                        group: savedHighlight.group,
                        highlight: savedHighlight._id,
                        user: user,
                        forNote: true,
                        createdAt: Date.now()}
                    },
                    {upsert: true}, 
                    function(err, updatedNotif) {
                        if (err) {
                            console.log('finding and updating highlight notif for note add error: ' + err);
                        } else {
                            console.log('added notification for note add for highlight: ' + savedHighlight._id);
                            console.log(updatedNotif);
                            //console.log('updatedNotif.highlight: ' + updatedNotif.highlight);
                            callback(updatedNotif);
                        }
                    });
            }
        }

        // now also checking the owner of the highlight:
        // note that highlight.createdBy is the id iself, not user obj.
        if (!savedHighlight.createdBy.equals(noteCreator._id) && 
                  (! (savedHighlight.createdBy in completedUserSet)) ) {
          var user = savedHighlight.createdBy;

          // so finding one and updating if existing otherwise inserting.
          Notification.findOneAndUpdate({user: user, group: savedHighlight.group},
              {$set: {
                  group: savedHighlight.group,
                  highlight: savedHighlight._id,
                  user: user,
                  forNote: true,
                  createdAt: Date.now()}
              },
              {upsert: true}, 
              function(err, updatedNotif) {
                  if (err) {
                      console.log('finding and updating highlight notif for note add error: ' + err);
                  } else {
                      console.log('added notification for note add for highlight for the owner of the highlight!: ' + savedHighlight._id);
                      console.log(updatedNotif);
                      //console.log('updatedNotif.highlight: ' + updatedNotif.highlight);
                      callback(updatedNotif);
                  }
              });
        }

     },

     getNotifs: function(user, groupRef, callback) {
        var self = this;
        Notification.find({user: user._id, group: groupRef})
                    .populate('article')
                    .populate('highlight')
                    .sort({'createdAt': 'desc'})
                    .exec(function(err, notifs) {
                        if (err) {
                            console.log('could not get notifs: ' + err);
                            callback({error: ''});
                            return;
                        }

                        User.populate(notifs, [{
                            path: 'article.createdBy',
                            select: '-_id'
                        },
                        {
                            path: 'highlight.createdBy',
                            select: '-_id'
                        }], function(err, poppedNotifs) {
                            if (err) { callback({error: ''}); }
                            // got notifs:
                            // now getting the last viewed tstamp:
                            self.getNotifsLastViewed(user, groupRef, function(tstampObj) {
                                if (tstampObj.error) {
                                    callback({error: ''});
                                    return;
                                }

                                // got tstamp succesffuly:
                                console.log('getNotifs.lastViewed: ' + tstampObj.lastViewed);
                                callback({notifs: poppedNotifs, lastViewed: tstampObj.lastViewed});
                            });
                        }); 

                        // populate highlight createdBy:
                    });
     },

     getNotifCount: function(user, groupRef, callback) {
        this.getNotifsLastViewed(user, groupRef, function(obj) {
            if (obj.error) {
                callback(obj);
                return;
            }

            var lastViewed = obj.lastViewed;
            // getting the notification count for notifs past lastViewed:
            Notification.count({user: user._id,
                group: groupRef, 
                createdAt: {$gte: lastViewed}}, 

                function(err, count) {
                    if (err) {
                        callback({error: 'could not get notif count'});
                        console.log('error getting notif count: ' + err);
                        return;
                    }
                    callback({count: count});
                });
        });
     },

     // clears notif count for this user:
     clearNotifs: function(user, groupRef) {
        User.findOneAndUpdate({_id: user._id, 'groups.groupRef': groupRef}, 
            {$set: {'groups.$.notifCount': 0} },
            {},
            function(err, updatedUser) {
                if (err) {
                    console.log('failed to clear notes for user');
                } 

                console.log('cleared notifs for user: ' + user.facebook.name);
            });
     },

     setNotifsLastViewed: function(user, groupRef, callback) {
        User.findOneAndUpdate({_id: user._id, 'groups.groupRef': groupRef}, 
            {$set: {'groups.$.notifLastViewed': Date.now()} },
            {},
            function(err, updatedUser) {
                if (err) {
                    console.log('failed to set notifs viewed for user: ' + err);
                    callback({error: 'poop'});
                    return;
                } 

                console.log('set last viewed notifs for user+group: ' + Date.now());
                callback({});                                
            });
     },

     getNotifsLastViewed: function(user, groupRef, callback) {
        User.findOne({_id: user._id}, {groups: {$elemMatch: {'groupRef': groupRef} }}, 
            function(err, doc) {
                if(err) {
                    console.log('error getting last viewed: ' + user._id + ':' + groupRef + ':  ' + err);
                    callback({error: err});
                    return;
                }

                var lastViewed = doc.groups[0].notifLastViewed;
                console.log('getLastViewed: ' + lastViewed);
                callback({lastViewed: lastViewed});
            });
     },

     clearChatNotifs: function(user, groupRef, callback) {
        User.findOneAndUpdate({_id: user._id, 'groups.groupRef': groupRef}, 
            {$set: {'groups.$.chatNotifCount': 0} },
            {},
            function(err, updatedUser) {
                if (err) {
                    console.log('failed to increment chat notifs viewed for user: ' + err);
                    callback({error: 'poop'});
                    return;
                } 

                console.log('clear chat notifs for user+group: ' + updatedUser._id);
                callback({});                                
            });
     },

     incrementChatNotifCount: function(user, groupRef, callback) {
        if (!groupRef) {
            callback({error: 'invalid group'});
        }

        User.findOneAndUpdate({_id: user._id, 'groups.groupRef': groupRef}, 
            {$inc: {'groups.$.chatNotifCount': 1} },
            {},
            function(err, updatedUser) {
                if (err) {
                    console.log('failed to increment chat notifs viewed for user: ' + err);
                    callback({error: 'poop'});
                    return;
                } 

                console.log('incremented chat notifs for user+group: ' + updatedUser._id);
                callback({});                                
            });
     },

     getChatNotifCount: function(user, groupRef, callback) {
        User.findOne({_id: user._id}, {groups: {$elemMatch: {'groupRef': groupRef} }}, 
            function(err, doc) {
                if(err) {
                    console.log('error getting last viewed: ' + user._id + ':' + groupRef + ':  ' + err);
                    callback({error: err});
                    return;
                }

                var count = doc.groups[0].chatNotifCount;
                console.log('chat notif count: ' + count);
                callback({count: count});
            });
     }
};

module.exports = DB;

User.findOne({'facebook.name': 'Vignesh Prasad'}, function(err, user) {
    if (err) {
        console.log('pooped in getting user!');
    } else {
        var groupRef = ObjectId("55a25931150ef26b44db57bb");
        var groupId = "55a5efaf9c11ff0000739eba";



        var newGroupId = "55a25931150ef26b44db57yj"

        // //addGroupMembers: function(user, groupRef, members, callback)
        // DB.addGroupMembers(user, groupId, ['511989525640264', '853160004761049'], function(obj) {
        //     console.log(obj)
        // });

        // DB.setNotifsLastViewed(user, groupId, function(obj) {
        //     console.log('last viewed callbac: ' + Object.keys(obj));
        //     DB.getNotifsLastViewed(user, groupId, function(obj) {

        //     });
        // });
        console.log('running somehting!');
        DB.getNotifCount(user, "55a73e610359230000c72bf2", function(obj) {
            console.log('count: ' + obj.count);
        });


        // DB.getNotifsLastViewed(user, groupId, function(obj) {

        // });

        //DB.getNotifs(user, groupId, function(obj) {});

        // var memberList = ['511989525640264', '853160004761049'];
        // var viggy = ['853160004761049']

        // var dummyGroup = {
        //     title: 'The test group, Viggy first!',
        //     _id: newGroupId
        // }

        // DB.addGroup(user, dummyGroup, viggy, function(obj) {
        //     console.log('poop: ' + Object.keys(obj));
        // });

        // DB.addGroupMembers(user, newGroupId, memberList, function(obj) {
        //     console.log('poop: ' );
        // });


        // DB.getGroup(user, "55a25931150ef26b44db57bb", function(obj) {
        //     console.log(obj);
        // });
        // DB.addGroupMember(user, '55a25931150ef26b44db57bb', {id: user.facebook.id}, function(obj) {
        //      console.log('obj: ' + obj);
        // });

        // DB.addChat(user, groupId, mongoose.Types.ObjectId(), 'poopopopopopop', function(obj) {
        //     console.log(obj);
        // });

        // DB.getChatSegment(user, groupId, 0, 5, function(obj) {
        //     console.log('chats : ' + obj.chats);
        // });

        //addNotification: function(targetUser, groupId, highlightRef, noteId, callback)


        // DB.addNotification(user, groupId,
        //                          "55a25cf75572e8e144c4ac68",
        //                          '',
        //                          function() {
        //                             console.log('poop');
        // });

        // DB.clearNotifs(user, groupId);

        
        // //
        // DB.getArticleListSegment(user, groupId, 0, 3, function(obj) {
        //     console.log('result: ' + Object.keys(obj));
        // });

        // console.log('got user!');
        //
        // DB.getGroup(user, 'testPoopGroup', function(poop) {
        //     console.log('poop: ' + Object.keys(poop));
        // });


        // var articleId = '5599e642f836bb36631e2e9c';
        // DB.getArticle(user, articleId, function(poop) {
        //     console.log('article.title: ' + poop.article.title);
        // });

        //

        // DB.addArticleFromUrl(user, groupId, 'http://sockpuppet.org/blog/2015/07/13/starfighter/', function(poop) {
        //     console.log('poop: ' + Object.keys(poop));
        // });


        //adding note:
        // var dummyNote = {
        //     noteId: 'dummyNote1',
        //     content: 'dummy note content',
        // }
        
        // console.log('about to add note');
        // DB.addNote(user,  "55a25cf75572e8e144c4ac3d", dummyNote, function(poop) {
        //     console.log('poop: ' + poop.groupId.id);
        // });

        //
        // console.log('about to save a dummy highlight!');


        // var dummyHighlight = {
        //    _id: "55a25cf75572e8e144c4ac3d",
        //    article: "55a34592d5aeb6438bb5ebdb",
        //    group: groupId,
        //    clippedText: 'poop is the secret of my energy!',
        //    selection: {},
        //    notes: []
        // }
        
        // // saving a dummy highlight:
        // DB.addHighlight(user, dummyHighlight, '', function(poop) {
        //     console.log('poop: ' + Object.keys(poop));
        // });

        // // going to delete the dummy article added above:
        // DB.deleteHighlight(user, 'poopopo', 'dummyHighlight1', function(poop) {
        //     console.log('poop: ' + Object.keys(poop));
        // });
    }
});

