const express = require('express');
const router = express.Router();
const { viewRoute } = require('../express/server.js');
const data_service = require('../data-service.js')

router.get("/", function (req, res) {  
    if (req.query.status) {
      data_service
        .getEmployeesByStatus(req.query.status)
        .then(function (data) {
          if (data.length > 0) {
            res.render(viewRoute  + "/employees", { employees: data });
          } else {
            res.render(viewRoute  + "/employees", { message: "no results." });
          }
        })
        .catch(function (error) {
          res.render(viewRoute  + "/employees", { message: "no result" });
        });
    } else if (req.query.department) {
      data_service
        .getEmployeesByDepartment(req.query.department)
        .then(function (data) {
          if (data.length > 0) {
            res.render(viewRoute  + "/employees", { employees: data });
          } else {
            res.render(viewRoute  + "/employees", { message: "no results." });
          }
        })
        .catch((error) => {
          res.render(viewRoute  + "/employees", { message: "no result" });
        });
    } else if (req.query.manager) {
      data_service
        .getEmployeesByManager(req.query.manager)
        .then(function (data) {
          if (data.length > 0) {
            res.render(viewRoute  + "/employees", { employees: data });
          } else {
            res.render(viewRoute  + "/employees", { message: "no results." });
          }
        })
        .catch(function (error) {
          res.render(viewRoute  + "/employees", { message: "no result" });
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
          res.render(viewRoute  + "/employees", { employees: data });
        })
        .catch(function (error) {
          res.render(viewRoute  + "/employees", { message: "no results" });
          console.log("error employee");
        });
    }
  });
  
  router.get("/add", (req, res) => {
    data_service
      .getDepartments()
      .then(function (data) {
        res.render(viewRoute  + "/addEmployee", { departments: data });
      })
      .catch(function (err) {
        res.render(viewRoute  + "/addEmployee", { departments: [] });
      });
  });
  
  router.post("/update", function (req, res) {
    data_service
      .updateEmployee(req.body)
      .then(function (data) {
        res.redirect("/employees");
      })
      .catch(function (err) {
        console.log(err);
      });
  });
  
  router.get("/:empNum", (req, res) => {
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
          res.render(viewRoute  + "/employee", { viewData: viewData });
        }
      });
  });
  
  router.get("/delete/:empNum", (req, res) => {
    data_service
      .deleteEmployeeByNum(req.params.empNum)
      .then(function (data) {
        res.redirect("/employees");
      })
      .catch(function (error) {
        res.status(500).send("Unable to Remove Employee / Employee not found");
      });
  });
  
  router.post("/add", (req, res) => {
    data_service
      .addEmployee(req.body)
      .then(function (data) {
        res.redirect("/employees");
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  });

module.exports = router;