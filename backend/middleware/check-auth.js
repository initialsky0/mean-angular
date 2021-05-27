const jWToken = require('jsonwebtoken');
// Custom middleware to authenticate token and allow access to routes

module.exports = (req, res, next) => {
   try {
      const token = req.headers.authorization.split(' ')[1];
      jWToken.verify(token, "This_is_supposed_to_be_long_and_random_because_its_a_secret");
      next();
   } catch(error) {
      res.status(401).json({ message: "Token authorization failed." });
   }
}