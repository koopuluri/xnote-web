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
    groupId: String,
    articleId: String,
    highlightId: String,
    article: {type: mongoose.Schema.Types.ObjectId, ref: 'Article'},
    highlight: {type: mongoose.Schema.Types.ObjectId, ref: 'Highlight'},
});

feedPostSchema.pre('remove', function(next) {
    console.log('post pre remove groupId: ' + this.groupId);
    mongoose.models['Group'].findOneAndUpdate({groupId: this.groupId},
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
    mongoose.models['Group'].findOne({groupId: doc.groupId}, function(err, obj) {
        // update the ref for this and save:
        if (err || !obj) {
            console.log('error in getting the group: ' + err);
            return;
        }
        obj.feedPosts.push(doc);
        obj.save(function(err, savedGroup) {
            if (!err) {
                console.log('group saved in FeedPost.post!')
            } else {
                console.log('group NOT saved in FeedPost.post!: ' + err);
            }
        });
    });
});

module.exports = mongoose.model('FeedPost', feedPostSchema);
