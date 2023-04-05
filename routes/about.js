const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render(__dirname + "views/about");
  });

module.exports = router;