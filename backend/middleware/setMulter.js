const multer = require('multer');

// multer setup for image upload
const MIME_TYPE_MAP = {
   'image/png': 'png', 
   'image/jpeg': 'jpg', 
   'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
   destination: (req, file, callback) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type.");
      if(isValid) {
         error = null;
      }
      callback(error, "./images");
   }, 
   filename: (req, file, callback) => {
      const name = file.originalname.toLowerCase().split(' ').join('_');
      const ext = MIME_TYPE_MAP[file.mimetype];
      callback(null, `${name}-${Date.now()}.${ext}`);
   }
});

module.exports = multer({ storage }).single('image');