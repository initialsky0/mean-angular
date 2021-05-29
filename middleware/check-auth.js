const jWToken = require('jsonwebtoken');
// Custom middleware to authenticate token and allow access to routes

module.exports = (req, res, next) => {
   try {
      const token = req.headers.authorization.split(' ')[1];
      const decryptedToken = jWToken.verify(token, process.env.JWT_KEY);
      // could modify req to attach data
      req.authData = { email: decryptedToken.email, userId: decryptedToken.userId };
      next();
   } catch(error) {
      res.status(401).json({ message: "You do not have permission to continue. Please login." });
   }
}