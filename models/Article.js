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

var articleSchema = mongoose.Schema({
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now},
    title: String,
    content: String,
    url: String,
    group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
    icon: String,
    serialization: {type: String, default: ''}
});

articleSchema.pre('remove', function(next) {
    console.log('article pre remove groupId: ' + this.group);
    mongoose.models['Group'].findOneAndUpdate({_id: this.group},
        {$pull: {articles: {_id: this._id}}}, function(err, data) {
            if (!err) {
                console.log("group's article ref is removed");
            } else {
                console.log("ERROR in group's article ref is removed");
            }
        });
    next();

});

articleSchema.post('save', function(doc) {
    // UPDATE the parent group's refs (remember don't SAVE!);
    mongoose.models['Group'].findOneAndUpdate({_id: doc.group},
      {$push: {'articles': doc}},
      {},
      function (error, savedGroup) {
          if (!error) {
              console.log('group saved in Article.post!')
          } else {
              console.log('group NOT saved in Article.post!: ' + err);
          }
      });
});




module.exports = mongoose.model('Article', articleSchema);
