const express = require('express');
const router = express.Router();
const { viewRoute } = require('../express/server.js');

router.get("/", (req, res) => {
    res.render(viewRoute + "/home");
  });

module.exports = router;