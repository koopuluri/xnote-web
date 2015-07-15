var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// allowed in schema:
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array

var groupSchema = new Schema({
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    feedPosts: [{type: mongoose.Schema.Types.ObjectId, ref: 'FeedPost'}],
    articles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Article'}],
    title: String,
    description: String,
    createdAt: {type: Date, default: Date.now},
});

groupSchema.post('save', function(doc) {
    // get all the members of this group and add ref to this group for each member obj:
    for (var i = 0; i < doc.members.length; i++) {
        var userRef = doc.members[i];
        mongoose.models['User'].findOneAndUpdate({_id: userRef},
          {$push: {'groups': {groupRef: doc, notifCount: 0} }},
          {},
          function (error, savedUser) {
              if (error) {
                  console.log('error adding group ref to user upon group save: ' + error);
              } else {
                  console.log('user updated with group ref upon group save!');
              }
          });
    }
});


module.exports = mongoose.model('Group', groupSchema);
