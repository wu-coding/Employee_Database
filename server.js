var HTTP_PORT = process.env.PORT || 8080;

var express = require("express");
var path = require("path");
var fs = require("fs");
var multer = require("multer");
const bodyParser = require("body-parser");
var app = express();
const exphbs = require("express-handlebars");
var data_service = require("./data-service.js");


const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
app.use(bodyParser.urlencoded({ extended: true }));

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

app.set("view engine", ".hbs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/departments", (req, res) => {
  data_service.getDepartments().then(function (data) {
    res.render("departments", { departments: data });
  });
});

app.get("/departments/add", (req, res) => {
  res.render("addDepartment");
});

app.post("/departments/add", (req, res) => {
  data_service.addDepartment(req.body).then(function (data) {
    res.redirect("/departments");
  });
});

app.get("/departments/delete/:deptNum", (req, res) => {
  data_service
    .deleteDepartmentsByNum(req.params.deptNum)
    .then(function (data) {
      res.redirect("/departments");
    })
    .catch(function (error) {
      res
        .status(500)
        .send("Unable to Remove Department / Department not found");
    });
});

app.post("/departments/update", (req, res) => {
  data_service.updateDepartment(req.body).then(function (data) {
    res.redirect("/departments");
  });
});

app.get("/departments/:departmentId", function (req, res) {
  data_service
    .getDepartmentById(req.params.departmentId)
    .then(function (data) {
      res.render("department", { department: data });
    })
    .catch(function (err) {
      res.status(404).send("Department Not Found");
    });
});

app.get("/employees", function (req, res) {
  if (req.query.status) {
    data_service
      .getEmployeesByStatus(req.query.status)
      .then(function (data) {
        if (data.length > 0) {
          res.render("employees", { employees: data });
        } else {
          res.render("employees", { message: "no results." });
        }
      })
      .catch(function (error) {
        res.render("employees", { message: "no result" });
      });
  } else if (req.query.department) {
    data_service
      .getEmployeesByDepartment(req.query.department)
      .then(function (data) {
        if (data.length > 0) {
          res.render("employees", { employees: data });
        } else {
          res.render("employees", { message: "no results." });
        }
      })
      .catch((error) => {
        res.render("employees", { message: "no result" });
      });
  } else if (req.query.manager) {
    data_service
      .getEmployeesByManager(req.query.manager)
      .then(function (data) {
        if (data.length > 0) {
          res.render("employees", { employees: data });
        } else {
          res.render("employees", { message: "no results." });
        }
      })
      .catch(function (error) {
        res.render("employees", { message: "no result" });
      });
  } else {
    data_service
      .getAllEmployees()
      .then(function (data) {
        const temp = data.map((item) => {
          return {
            employeeNum: item.employeeNum,
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
          };
        });

        let temp2 = data;
        res.render("employees", { employees: data });
      })
      .catch(function (error) {
        res.render("employees", { message: "no results" });
        console.log("error employee");
      });
  }
});

app.get("/employees/add", (req, res) => {
  data_service
    .getDepartments()
    .then(function (data) {
      res.render("addEmployee", { departments: data });
    })
    .catch(function (err) {
      res.render("addEmployee", { departments: [] });
    });
});

app.post("/employees/update", function (req, res) {
  data_service
    .updateEmployee(req.body)
    .then(function (data) {
      res.redirect("/employees");
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/employees/:empNum", (req, res) => {
  let viewData = {};
  data_service
    .getEmployeeByNum(req.params.empNum)
    .then((data) => {
      viewData.data = data;
    })
    .catch(() => {
      viewData.data = null;
    })
    .then(data_service.getDepartments)
    .then((data) => {
      viewData.departments = data;
      for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentId == viewData.data.department) {
          viewData.departments[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.departments = [];
    })
    .then(() => {
      if (viewData.data == null) {
        res.status(404).send("Employee Not Found");
      } else {
        res.render("employee", { viewData: viewData });
      }
    });
});

app.get("/employees/delete/:empNum", (req, res) => {
  data_service
    .deleteEmployeeByNum(req.params.empNum)
    .then(function (data) {
      res.redirect("/employees");
    })
    .catch(function (error) {
      res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});

app.get("/images/add", (req, res) => {
  res.render("addImage");
});

app.get("/images", (req, res) => {
  fs.readdir("./public/images/uploaded", function (err, files) {
    res.render("images", { data: files });
  });
});

app.post("/images/add", upload.single("imageFile"), function (req, res) {
  res.redirect("/images");
});

app.post("/employees/add", (req, res) => {
  data_service
    .addEmployee(req.body)
    .then(function (data) {
      res.redirect("/employees");
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

app.use(function (req, res) {
  res.sendFile(__dirname + "/views/404.html");
});

app.listen(HTTP_PORT, function () {
  data_service
    .initialize()
    .then(function (data) {
      console.log("app_work", data);
    })
    .catch((error) => {
      console.log("app_not", error);
    });
});
