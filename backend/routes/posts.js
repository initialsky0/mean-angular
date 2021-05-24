const express = require('express');
const router = express.Router();
const Post = require('../models/post')

// posts path and methods
router.post('', (req, res) => {
   const post = new Post({
      title: req.body.title, 
      content: req.body.content
   });
   // Mongoose schema will auto generate query when call .save method
   post.save().then(saveRes => {
      res.status(201).json({
         message: "Post stored successfully.", 
         id: saveRes._id 
      });
   });
});

router.get('', (req, res) => {
   // does not require return, will return by default, do not use next() if sending response
   Post.find()
      .then(dbRes => {
         res.status(200).json({
            message: "Post fetched successfully.", 
            posts: dbRes
         });
      });
});

router.get('/:id', (req, res) => {
   Post.findById(req.params.id).then(
      resPost => {
         if(resPost) {
            res.status(200).json(resPost);
         } else {
            res.status(404).json();
         }
      }
   );
});

router.patch('/:id', (req, res) => {
   const post = {
      // if put, create new Post(), make sure to also set _id: req.params.id for update
      title: req.body.title, 
      content: req.body.content
   };
   Post.updateOne({_id: req.params.id}, post).then(
      () => {
         res.status(200).json({message: "Edit successful."});
      }
   );
});

router.delete('/:id', (req, res) => {
   Post.deleteOne({ _id: req.params.id }).then(delRes => {
      console.log(delRes);
      res.status(200).json({ message: "Post deleted." });
   });
});

module.exports = router;

