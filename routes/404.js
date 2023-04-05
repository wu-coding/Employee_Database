const express = require('express');
const router = express.Router();


router.use(function (req, res) {
    res.sendFile('/home/atfwu/Employee_Database/views/404.html');
  });

module.exports = router;