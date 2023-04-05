
var express = require("express");
var path = require("path");
const bodyParser = require("body-parser");
const {app} = require( __dirname + '/express/server');
const exphbs = require("express-handlebars");
var data_service = require("./data-service.js");


app.use(bodyParser.urlencoded({ extended: true }));


// Set class to active for use in navigation bar

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\$/, "");
  next();
});

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",

    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);

//Set view path
app.set('views',path.join(__dirname,'views'));

//Initialize view engine
app.set("view engine", ".hbs");
app.use(express.static("public"));

//Set routes
let home = require('./routes/home')
let about = require('./routes/about')
let departments = require('./routes/departments')
let employees = require('./routes/employees')
let images = require('./routes/images')
let notfound = require('./routes/404')
app.use('/', home)
app.use('/about', about)
app.use('/departments', departments)
app.use('/employees', employees)
app.use('/images', images)
app.use('*', notfound)


// set port
let HTTP_PORT = process.env.PORT || 8080;

app.listen(HTTP_PORT, function () {
  data_service
    .initialize()
    .then(function (data) {
    })
    .catch((error) => {
    });
});
