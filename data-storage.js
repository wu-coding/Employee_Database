var multer = require("multer");
var path = require("path");

// Initialize Storage
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
module.exports.upload = multer({ storage: storage });

  