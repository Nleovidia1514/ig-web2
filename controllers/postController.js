const Comment = require("../models/Comment");
const Post = require("../models/Post");

const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

module.exports = {
  getPosts: async (req, res) => {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "uploader",
        },
      },
    ]);

    res.render("home", {
      posts: posts.map((x) => ({
        ...x,
        uploader: x.uploader[0],
        createdDate: `${x.createdDate.getUTCDate()} de ${months[x.createdDate.getUTCMonth()]} del ${x.createdDate.getFullYear()}`
      })),
    });
  },

  uploadPost: (req, res) => {
    console.log(req.file);
    if (req.user) {
      const post = new Post();
      post.userId = req.user._id;
      post.title = req.body.title;
      post.imageUrl = `/images/uploads/${req.user.username}/${req.file.filename}`;
      post
        .save()
        .then((image) => {
          return res.status(200).redirect("/");
        })
        .catch((err) => res.status(400).json({ msg: err.message }));
    } else {
      return res.status(401).json({
        msg: "Must be logged in to upload images.",
      });
    }
  },

  addComment: (req, res) => {
    if (req.user !== null) {
      const comment = new Comment({ ...req.body.comment });
      comment.commenter = req.user._id;
    }
  },

  addLike: (req, res) => {
    if (req.user !== null) {
      Image.findOne({ _id: req.params.id }).then((image) => {
        if (image.likes.find(req.user) !== -1) {
          image
            .updateOne({
              $set: {
                likes: [...likes, req.user],
              },
            })
            .then((img) => {
              res.status(200).json({
                ok: true,
                msg: "Like added",
              });
            });
        } else {
          res.status(203).json({
            ok: false,
            msg: "You already liked this post",
          });
        }
      });
    } else {
      res.status(403).json({
        ok: false,
        msg: "You're not logged in",
      });
    }
  },
};
