const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jWToken = require('jsonwebtoken');

exports.userSignup = (req, res) => {
   bcrypt.hash(req.body.password, 10)
      .then(hash => {
         const user = new User({
            email: req.body.email, 
            password: hash
         });
         user.save().then(() => {
            res.status(201).json({
               message: "Sign up success."
            });
         }).catch(() => {
            res.status(500).json({
               message: "Invalid sign up credentials, this email is already registered."
            });
         });
      });
};

exports.userLogin = (req, res) => {
   // cache variables
   let tempUser;

   User.findOne({ email: req.body.email }).then(user => {
      // fetch user, if exist compare hashed password
      if(!user) {
         // this value will be passed to the next then chain (result) if user doesn't exist
         return false;
      }
      tempUser = user
      return bcrypt.compare(req.body.password, user.password);
   }).then(result => {
      // if password is valid, respond with a authentication token
      if(!result) {
         return res.status(401).json({ message: "Authenication failed. Please enter a valid credential." });
      }
      const token = jWToken.sign(
         { email: tempUser.email, userId: tempUser._id }, 
         process.env.JWT_KEY, 
         { expiresIn: "1h" }
      );
      res.status(200).json({ 
         token, 
         userId: tempUser._id, 
         expiresIn: 3600 
      });
   }).catch(() => {
      // handle error
      return res.status(401).json({ message: "Authenication failed. An error occurred during login." });
   })
}