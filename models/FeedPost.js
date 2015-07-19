var mongoose = require('mongoose');

// allowed in schema:
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array

var feedPostSchema = mongoose.Schema({
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    lastModifiedTimestamp: {type: Date, default: Date.now},
    type: String,
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
    article: {type: mongoose.Schema.Types.ObjectId, ref: 'Article'},
    highlight: {type: mongoose.Schema.Types.ObjectId, ref: 'Highlight'},
});

feedPostSchema.pre('remove', function(next) {
    console.log('post pre remove groupId: ' + this.group);
    mongoose.models['Group'].findOneAndUpdate({_id: this.group},
        {$pull: {posts: {_id: this._id}}}, function(err, data) {
            if (!err) {
                console.log("group's feedPost ref is removed");
            } else {
                console.log("ERROR in group's feedPost ref is removed");
            }
        });
    next();

});

feedPostSchema.post('save', function(doc) {
    // update the parent group's refs
    mongoose.models['Group'].findOneAndUpdate({_id: doc.group},
        {$push: {'feedPosts': doc}},
        {},
        function (error, savedGroup) {
            if (!error) {
                console.log('group saved in FeedPost.post!')
            } else {
                console.log('group NOT saved in FeedPost.post!: ' + err);
            }
        });

});

module.exports = mongoose.model('FeedPost', feedPostSchema);
