const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comments")

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    } 
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      //console.log(post)
      const comments = await Comment.find({postId : req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comments:comments});
      //whatever we pass in to the second argument of an object of "res.render," is the objects we can use in our ejs file as interpolation. From the code above, in our ejs file we will be able to access a "post" property that holds the "post" object with values from the "const post." We also found all the comments in our database with the postId of "req.params.id", which are returned in an array, so we can now include them in the property of "comments" which we named and gave it the value of "const comments" (If there are multiple documents found, mongoose will return them in an array by default as opposed to mongoDB which we had to specify that we wanted the documents in an array format.)
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes:0,
        user: req.user.id,
        likedBy: []
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    //refactored! Can update multiple properties of the document
    let post = await Post.findOne({_id : req.params.id})
    console.log(post)
    if(!post.likedBy.includes(req.user.id)){
      try {
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            likedBy: post.likedBy.concat(req.user.id)
          }
        );
        res.redirect(`/post/${req.params.id}`);
      }catch (err) {
        console.log(err);
      }
    }else{
      try {
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            likedBy: post.likedBy.filter(id => id !== req.user.id),
          }
        );
        console.log("Likes -1");
        res.redirect(`/post/${req.params.id}`);
      }catch (err) {
        console.log(err);
      }
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
