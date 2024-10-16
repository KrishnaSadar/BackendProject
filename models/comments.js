const { model, Schema } = require("mongoose");

const commentSchema = new Schema({
    content : {
        type: String,
        required: true,
    },
    createdBy : {
        type: Schema.Types.ObjectId,
        ref : "User" ,
    }, 
    blogID : {
        type: Schema.Types.ObjectId,
        ref : "Blog" ,
    }, 
}, {
    timestamps: true
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;
