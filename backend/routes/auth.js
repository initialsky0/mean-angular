const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jWToken = require('jsonwebtoken');
const user = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res) => {
   bcrypt.hash(req.body.password, 10)
      .then(hash => {
         const user = new User({
            email: req.body.email, 
            password: hash
         });
         user.save().then(result => {
            res.status(201).json({
               message: "Sign up success."
            });
         }).catch(error => {
            res.status(500).json({
               error
            });
         });
      });
});

router.post("/login", (req, res) => {
   let tempUser;
   User.findOne({ email: req.body.email }).then(user => {
      // fetch user, if exist compare hashed password
      if(!user) {
         // this is a reject promise, and will end the chain
         return res.status(401).json({ message: "Authenication failed." });
      }
      tempUser = user
      return bcrypt.compare(req.body.password, user.password);
   }).then(result => {
      // if password is valid, respond with a authentication token
      if(!result) {
         return res.status(401).json({ message: "Authenication failed." });
      }
      const token = jWToken.sign(
         { email: tempUser.email, userId: tempUser._id }, 
         "This_is_supposed_to_be_long_and_random_because_its_a_secret", 
         { expiresIn: "1h" }
      );
      res.status(200).json({ 
         token, 
         expiresIn: 3600 
      });
   }).catch(err => {
      // handle error
      return res.status(401).json({ error: err });
   })
});

module.exports = router;
