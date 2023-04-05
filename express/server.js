const express = require('express')
const app = express();
const serverless = require('serverless-http');
const router = express.Router();
const path = require('path')

let views = path.join(__dirname, '../');
console.log(views)

// Home route.
router.get('/', (req, res) => {
  res.sendFile('dist/index.html', { root: views });
});


const functionRoute = 'server'
const basePath =  `/.netlify/functions/${functionRoute}/`


app.use(basePath, router);

module.exports.viewRoute = path.join(__dirname, '../' ,'views')
module.exports.app = app
module.exports.handler = serverless(app);