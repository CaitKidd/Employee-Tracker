const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employees_DB",
});



connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
    inquirer
      .prompt({
        name: "startQuestions",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "View all departments",
          "View all managers",
          "Add Employee",
          "Add Department",
          "Add Role",
          "Update Employee Role",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.startQuestions) {
          case "View all employees":
            viewEmployees();
            break;

          case "View all departments":
            viewDepartments();
            break;
            
          case "View all managers":
            viewManagers();
            break;

          case "Add Employee":
            addEmployees();
            break;

          case "Add Department":
            addDepartment();
            break;
          
           case "Add Role":
            addRole();
            break;
          
          case "Update Employee Role":
            updateEmployees();
            break;

          case "Exit":
            connection.end();
        }
      });
  }
function viewEmployees() {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.names AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id", function(err, res) {
    if (err) throw err;

    console.table(res);
    start();
  });
}

function viewDepartments() {
  connection.query("SELECT names FROM department", function (err, res) {
      console.table(res);
    
  })
  start();
}

function viewManagers() {
  var query = "SELECT id, first_name, last_name FROM employee WHERE id IN (SELECT manager_id FROM employee WHERE manager_id IS NOT NULL)";
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].first_name + " " + res[i].last_name + " || Id: " + res[i].id);
    }
    start();
  });
}

function addEmployees() {
    inquirer
      .prompt([
        {
          name: "employeeAdd",
          type: "input",
          message: "What is the employee's first and last name?"
        },
        {
         name: "manager",
         type: "list",
         message: "What is the employee's manager?",
         choices: [
            "Michael Scott",
            "Jan Levingston"
           ]
        }
      ]).then(function(answer) {
        var string = answer.employeeAdd;
        var fullName = string.split(" ");
        console.log(fullName);
        connection.query("INSERT INTO employee (first_name, last_name) VALUES ?",
           [[fullName]],
           function (err, res) {
            start();
           });
      });
  }

  function addDepartment() {
    inquirer
      .prompt([
        {
        name: "departmentAdd",
        type: "input",
        message: "What new department would you like to add?"
        }
      ]).then(function (answer) {
        console.log(answer)
        var str = answer.employeeAdd;
        var fullName = str.split(" ");
        connection.query("INSERT INTO employee (first_name, last_name) VALUES ?",
           [[fullName]],
           function (err, res) {
            start();
           });
        });
  }
  
  function addRole() {
    inquirer
      .prompt([
        {
          name: "role",
          type: "input",
          message: "What new role would you like to add?"
        }
      ]).then(function (answer) {
        var title = answer.title;
  
        inquirer
          .prompt([
            {
              name: "salary",
              type: "input",
              message: "Enter new role salary"
            }
          ]).then(function (answer) {
            var salary = answer.salary;
            inquirer
            .prompt({
              name: "department_id",
              type: "input",
              message: ["Enter new role department id"]
            })
            .then(function (answer) {
              var department_id = answer.department_id;
            connection.query("INSERT INTO role (title, salary,department_id) VALUES ?",
                 [[[title, salary,department_id]]],
                  function (err, res) {
                  if (err) {
                    console.log(err);
                  }
  
                  start();
                });
              })
          })  
    });
  }
  
  function updateEmployees() {
    console.log('updating emp');
    inquirer
      .prompt({
        name: "id",
        type: "input",
        message: "Enter employee id",
      }).then(function (answer) {
        var id = answer.id;
        inquirer
          .prompt({
            name: "roleId",
            type: "input",
            message: "Enter role id",
          })
          .then(function (answer) {
            var roleId = answer.roleId;
  
            connection.query("UPDATE employee SET role_id=? WHERE id=?",
             [roleId, id], 
             function (err, res) {
              if (err) {
                console.log(err);
              }
              start();
            });
          });
      });
  }