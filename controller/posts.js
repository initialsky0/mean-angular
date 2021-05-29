const Post = require('../models/post');

exports.createPost = (req, res) => {
   // generate url
   const url = `${req.protocol}://${req.get('host')}`;
   const post = new Post({
      title: req.body.title, 
      content: req.body.content, 
      imagePath: `${url}/images/${req.file.filename}`, 
      author: req.authData.userId
   });
   // Mongoose schema will auto generate query when call .save method
   post.save().then(saveRes => {
      res.status(201).json({
         message: "Post stored successfully.", 
         post: {
            ...saveRes.toObject(), 
            id: saveRes._id
         }
      });
   }).catch(() => {
      res.status(500).json({ message: "Post creation failed." });
   });
}

exports.fetchPosts = (req, res) => {
   const pageSize = +req.query.pagesize;
   const currentPage = +req.query.page;
   const fetchQueryPosts = Post.find();
   let dbRes;
   if(pageSize && currentPage) {
      fetchQueryPosts
         .skip(pageSize * (currentPage - 1))
         .limit(pageSize);
   }
   // does not require return, return pass object to then chain, do not use next() if sending response
   fetchQueryPosts.then(response => {
      dbRes = response
      return Post.countDocuments();  
   }).then(count => {
      res.status(200).json({
         message: "Post fetched successfully.", 
         posts: dbRes, 
         maxPosts: count
      });
   }).catch(() => {
      res.status(500).json({ message: "Posts fetching failed." });
   });
}

exports.fetchPostById = (req, res) => {
   Post.findById(req.params.id).then(
      resPost => {
         if(resPost) {
            res.status(200).json(resPost);
         } else {
            res.status(404).json({ message: "This post does not exist." });
         }
      }
   ).catch(() => {
      res.status(500).json({ message: "Post fetching failed." });
   });
}

exports.editPost = (req, res) => {
   const imagePath = req.file 
      ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
      : req.body.imagePath;
   const post = {
      // if put, create new Post(), make sure to also set _id: req.params.id for update
      title: req.body.title, 
      content: req.body.content, 
      imagePath
   };
   Post.updateOne({ _id: req.params.id, author: req.authData.userId }, post).then(
      result => {
         if(result.n > 0) {
            res.status(200).json({ message: "Edit successful." });
         } else {
            res.status(401).json({ message: "Edit failed, permission denied." });
         }
      }
   ).catch(() => {
      res.status(500).json({message: "Post update failed." });
   });
}

exports.deletePost = (req, res) => {
   Post.deleteOne({ _id: req.params.id, author: req.authData.userId }).then(delRes => {
      if(delRes.n > 0) {
         res.status(200).json({ message: "Post deleted." });
      } else {
         res.status(401).json({ message: "Delete failed, permission denied." });
      }
   }).catch(() => {
      res.json(500).json({ message: "Delete failed. Please try again later." });
   });
}