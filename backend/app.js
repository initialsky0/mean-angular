require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

// routers
const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth');

// Initiates express app
const app = express();

// Setup mongoose connection and handle deprecation
const uri = `mongodb+srv://admin:${process.env.DB_AUTHPASS}@cluster0.w6zgq.mongodb.net/mean-project?retryWrites=true&w=majority`;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(uri)
   .then(
      () => {
         console.log('Connected successful to MangoDB.');
   })
   .catch(
      err => {
         console.log(err);
   });

// use define or register middlewares for express app
// app.use((req, res, next) => {
//    console.log('Test middleware');
//    // need next() to proceed to next middleware
//    next();
// });

// body-parser is deprecated because it's built-in for express now
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// allow access to static files
app.use('/images', express.static(path.join('backend/images')));

// manual setup for CORS handle
app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Headers", 
      "Origin, X-Requested-With, Content-Type, Accept, Authorization");
   res.setHeader("Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS");
   next();
});

// move all routes to different route modules
app.use('/api/posts', postsRoute);
app.use('/api/auth', authRoute);

module.exports = app;

