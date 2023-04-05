const express = require('express');
const router = express.Router();
var fs = require("fs");
var data_storage = require('../data-storage.js');
const { viewRoute } = require('../express/server.js');

router.get("/", (req, res) => {
  fs.readdir("./public/images/uploaded", function (err, files) {
    res.render(viewRoute + '/images', { data: files });
  });
});

router.get("/add", (req, res) => {
  res.render(viewRoute + "/addImage");
});



router.post("/add", data_storage.upload.single("imageFile"), function (req, res) {
  res.redirect("/images");
});

module.exports = router;