const express = require('express');

// Initiates express app
const app = express();

// use define or register middlewares for express app
// app.use((req, res, next) => {
//    console.log('Test middleware');
//    // need next() to proceed to next middleware
//    next();
// });

// body-parser is deprecated because it's built-in for express now
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// manual setup for CORS handle
app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Headers", 
      "Origin, X-Requested-With, Content-Type, Accept");
   res.setHeader("Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS");
   next();
});

// posts path and methods
app.post('/api/posts', (req, res, next) => {
   const post = req.body;
   console.log(post);
   res.status(201).json({message: "Post received successfully."});
});

app.get('/api/posts', (req, res) => {
   const posts = [
      {
         id: "001", 
         title: "First post from server", 
         content: "This is first post's content from server"
      }, 
      {
         id: "002", 
         title: "Second post from server", 
         content: "This is second post's content from server"
      }
   ];
   // does not require return, will return by default, do not use next() if sending response
   res.status(200).json({
      message: "Post fetched successfully.", 
      posts: posts
   });
});

module.exports = app;

