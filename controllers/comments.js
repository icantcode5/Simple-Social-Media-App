const Comment = require("../models/Comments");
const Post = require("../models/Post");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        postId: req.params.id,
        userComment: req.user.id,
        likes : 0,
      });
      res.redirect("/post/"+ req.params.id);
      console.log("Comment has been added!");
    } catch (err) {
      console.log(err);
    }
  },
  deleteComment: async (req, res) => {
    try {
      await Comment.deleteOne({ _id: req.params.commentId });
      console.log("Deleted Comment!!!!!");
      res.redirect("/post/" + req.params.id);
    } catch (err) {
      res.redirect("/post/" + req.params.id);
    }
  },
  getComment : async (req,res) => {
    try{
      const post = await Post.findById({ _id : req.params.id})
      const comments = await Comment.find({_id : req.params.commentId}).lean()//.find() query returns an array in mongoose
      res.render("editComment.ejs", {post: post, user: req.user, comments : comments})
      console.log(comments)
    }catch(err){
      console.log(err)
      res.redirect("/post/" + req.params.id)
    }
  },
  updateComment :async (req,res) => {
    try{
      await Comment.findOneAndUpdate(
        {_id: req.params.commentId},
        {
          comment : req.body.editedComment
        }
      )
      res.redirect("/post/" + req.params.id)
      console.log("hello from try")
    }catch(err){
      console.log(err)
      res.redirect("/post/" + req.params.id)
    }
  }
}
