const express = require('express');
const router = express.Router();
const { viewRoute } = require('../express/server.js');
const data_service = require('../data-service.js')

router.get("/", (req, res) => {
    data_service.getDepartments().then(function (data) {
      res.render( viewRoute + "/departments", { departments: data });
    });
  });
  
  router.get("/add", (req, res) => {
    res.render( viewRoute + "/addDepartment");
  });
  
  router.post("/add", (req, res) => {
    data_service.addDepartment(req.body).then(function (data) {
      res.redirect("/departments");
    });
  });
  
  router.get("/delete/:deptNum", (req, res) => {
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
  
  router.post("/update", (req, res) => {
    data_service.updateDepartment(req.body).then(function (data) {
      res.redirect("/departments");
    });
  });
  
  router.get("/:departmentId", function (req, res) {
    data_service
      .getDepartmentById(req.params.departmentId)
      .then(function (data) {
        res.render(viewRoute  + "/department", { department: data });
      })
      .catch(function (err) {
        res.status(404).send("Department Not Found");
      });
  });

module.exports = router;