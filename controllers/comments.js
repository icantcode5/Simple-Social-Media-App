const { findById } = require("../models/Comments");
const Comment = require("../models/Comments");

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
      console.log(req.params.commentId)
      res.redirect("/post/" + req.params.id);
    }
  },
};
