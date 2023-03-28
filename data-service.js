var HTTP_PORT = process.env.PORT || 8080;

const Sequelize = require("sequelize");
const dotenv = require('dotenv').config();

const sequelize = new Sequelize({
  database: "postgres",
  username: "postgres",
  password: process.env.DB_KEY,
  host: "db.tjjtjfwjlpwmqycetmdr.supabase.co",
  port: 5432,
  dialect: "postgres",
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

var employee = sequelize.define("employee", {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  department: Sequelize.INTEGER,
  hireDate: Sequelize.STRING,
});

var department = sequelize.define("department", {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  departmentName: Sequelize.STRING,
});

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        // start the server to listen on HTTP_PORT
        app.listen(HTTP_PORT);
        resolve("Sync Database: Sucess");
      })
      .catch((error) => {
        reject("Sync Database: Failure", error);
      });
  });
};

module.exports.getAllEmployees = function () {
  return new Promise(function (resolve, reject) {
    employee
      .findAll({ raw: true, nest: true })
      .then((data) => {
        resolve(data);
      })
      .catch(function (err) {
        reject("no EmpAll results returned");
      });
  });
};

module.exports.getEmployeesByStatus = function (status) {
  return new Promise(function (resolve, reject) {
    employee
      .findAll({
        where: {
          status: status,
        },
        raw: true,
        nest: true,
      })
      .then(function (data) {
        resolve(data);
      })
      .catch(function (err) {
        reject("no EmpStatus results returned");
      });
  });
};

module.exports.getEmployeesByDepartment = function (department) {
  return new Promise(function (resolve, reject) {
    employee
      .findAll({
        where: {
          department: department,
        },
        raw: true,
        nest: true,
      })
      .then(function (data) {
        resolve(data);
      })
      .catch(function (err) {
        reject("no EmpDept results returned");
      });
  });
};

module.exports.getEmployeesByManager = function (manager) {
  return new Promise(function (resolve, reject) {
    employee
      .findAll({
        where: {
          employeeManagerNum: manager,
        },
        raw: true,
        nest: true,
      })
      .then(function (data) {
        resolve(data);
      })
      .catch(function (err) {
        reject("no EmpManager results returned");
      });
  });
};

module.exports.getEmployeeByNum = function (num) {
  return new Promise(function (resolve, reject) {
    employee
      .findAll({
        where: {
          employeeNum: num,
        },
        raw: true,
        nest: true,
      })
      .then(function (data) {
        resolve(data[0]);
      })
      .catch(function (err) {
        reject("no EmpNum results returned");
      });
  });
};
module.exports.deleteEmployeeByNum = function (empNum) {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(function () {
        resolve(employee.destroy({ where: { employeeNum: empNum } }));
      })
      .catch(function (err) {
        reject("Failed to delete");
      });
  });
};

module.exports.getManagers = function () {
  return new Promise(function (resolve, reject) {
    employee
      .findAll({
        where: {
          isManager: true,
        },
        raw: true,
        nest: true,
      })
      .then(function (data) {
        resolve(data);
      })
      .catch(function (err) {
        reject("no ManAll results returned");
      });
  });
};

module.exports.getDepartments = function () {
  return new Promise(function (resolve, reject) {
    department
      .findAll({ raw: true, nest: true })
      .then(function (data) {
        resolve(data);
      })
      .catch(function (err) {
        reject("no DeptAll results returned");
      });
  });
};

module.exports.addEmployee = function (employeeData) {
  return new Promise(function (resolve, reject) {
    employeeData.isManager = employeeData.isManager ? true : false;

    for (let i in employeeData) {
      if (employeeData[i] == "") {
        employeeData[i] = null;
      }
    }

    employee
      .create(employeeData)
      .then(function () {
        resolve("AddEmp Sucess");
      })
      .catch(function (err) {
        reject("AddEmp failed");
      });
  });
};

module.exports.updateEmployee = function (employeeData) {
  return new Promise(function (resolve, reject) {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (let i in employeeData) {
      if (employeeData[i] == "") {
        employeeData[i] = null;
      }
    }
    employee
      .update(employeeData, {
        where: {
          employeeNum: employeeData.employeeNum,
        },
      })
      .then(function (data) {
        resolve(data);
      })
      .catch(function (err) {
        reject("UpdateEmp failed");
      });
  });
};

module.exports.addDepartment = function (departmentData) {
  return new Promise(function (resolve, reject) {
    for (let i in departmentData) {
      if (departmentData[i] == "") {
        departmentData[i] = null;
      }
    }
    department
      .create(departmentData)
      .then(function () {
        resolve("AddDept Sucess");
      })
      .catch(function (err) {
        reject("AddDept failed");
      });
  });
};
module.exports.deleteDepartmentsByNum = function (deptNum) {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(function () {
        resolve(department.destroy({ where: { departmentId: deptNum } }));
      })
      .catch(function (err) {
        reject("Failed to delete");
      });
  });
};

module.exports.updateDepartment = function (departmentData) {
  return new Promise(function (resolve, reject) {
    for (let i in departmentData) {
      if (departmentData[i] == "") {
        departmentData[i] = null;
      }
    }

    department
      .update(departmentData, {
        where: {
          departmentId: departmentData.departmentId,
        },
      })
      .then(function () {
        resolve("UpdateDept Sucess");
      })
      .catch(function (err) {
        reject("UpdateDept failed");
      });
  });
};

module.exports.getDepartmentById = function (id) {
  return new Promise(function (resolve, reject) {
    department
      .findAll({
        where: {
          departmentId: id,
        },
        raw: true,
        nest: true,
      })
      .then(function (data) {
        resolve(data[0]);
      })
      .catch(function (err) {
        reject("no DeptId results returned");
      });
  });
};
