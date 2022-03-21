const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table")
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_PW,
    database: "employee_databaseDB"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start(){
    inquirer.prompt(
        {
type: "list",
message: "What would you like to do today?",
name: "options",
choices: [
    "Add Department",
    "Add Role",
    "Add Employee",
    "View Departments",
    "View Roles",
    "View Employees",
    "Update Employee Role",
    "Nothing",
        ]
    })
.then(function(result) {
    switch (result.options){
        case "Add Department":
            return addDepartment();
            break;
        case "Add Role":
            return addRole();
            break;
        case "Add Employee":
            return addEmployee();
            break;
        case "View Departments":
            return viewDepartments();
            break;
        case "View Roles":
            return viewRoles();
            break;
        case "View Employees":
            return viewEmployees();
            break;
        case "Update Employee Role":
            return updateRole();
            break;
            case "Nothing":
                stop();
                break;

    };
});
};

function addDepartment(){
    inquirer.prompt([{
        type: "input",
        message: "Department Name:",
        name: "department"
    }])
    .then(function(res){
        connection.query('INSERT INTO department (name) VALUES (?)', (res.department), function(err){
            if (err) throw err;
        })
    start();
    })
};


function addRole() {
    inquirer.prompt([{
        type: "input",
        message: "Enter Role:",
        name: "title"
    }, {
        type: "number",
        message: "Enter Salary:",
        name: "salary"
    }, {
        type: "number",
        message: "Enter Department ID:",
        name: "department_id"
    }]).then(function(res) {
        connection.query("INSERT INTO role (title, salary, department_id) values (?, ?, ?)", [res.title, res.salary, res.department_id], function(err, data) {
            if (err) throw err;
            // console.table(data);
        })
        start();
    })

};

function addEmployee() {
    // prompt for info
    inquirer.prompt([{
          name: "firstName",
          type: "input",
          message: "What is the employee's first name?"
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the employee's last name?"
        },
        {
          name: "roleID",
          type: "number",
          message: "What is the employee's role ID?",
        },
        {
          name: "managerID",
          type: "number",
          message: "What is the employee's manager ID?",
        },
      ])
      .then(function (answer) {
        // insert a new employee into the db with that info
        connection.query(
          "INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.roleID,
            manager_id: answer.managerID
          },
          function (err) {
            if (err) throw err;
            console.table(`${answer.firstName} ${answer.lastName} added successfully`);
            start();
          }
        );
      });
  }
    function viewDepartments() {
        connection.query("SELECT * FROM department", function(err, res) {
            console.table(res);
            if (err) throw err;
            start();
        });
    };
    
    function viewRoles() {
        connection.query("SELECT * FROM role", function(err, res) {
            console.table(res);
            if (err) throw err;
            start();
        });
    };
    function viewEmployees() {
        connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id",
            function(err, res) {
                console.table(res);
                if (err) throw err;
                start();
            });
    };
    function updateRole() {
        inquirer.prompt([
          {
            type: "input",
            message: "First name of the employee would you like to update?",
            name: "firstname",
          },
          {
            type: "input",
            message: "Last name of the employee would you like to update?",
            name: "lastname",
          },
          {
            type: "input",
            message: "What would you like to update on this employee?",
            name: "UpdateInfo",
          }
        ])
          .then(function (answer) {
            const query = "UPDATE employee SET role_id = " + answer.UpdateInfo + " WHERE first_name = '" + answer.firstName + "' and last_name='" + answer.lastName + "'";
      
            connection.query(query, function (err, res) {
              if (err) throw err;
            })
            start();
          })
      
      }
      
    function stop() {
        connection.end();
        process.exit();
    }