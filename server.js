const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employees_db"
});

connection.connect(err => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  start();
});

function start() {
    inquirer.prompt({
        name: "actions",
        type: "rawlist",
        choices: [
            "View Employees, Roles, Departments",
            "View Just Employees",
            "View Departments",
            "View Roles",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Done"
        ]
    })
    .then(answer => {
        switch (answer.actions) {
            case "View Employees, Roles, Departments":
                selectAll();
                break;
            case "View Just Employees":
                selectEmployees();
                break;
            case "View Departments":
                selectDepartments();
                break;
            case "View Roles":
                selectRoles();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Done":
                connection.end();
                break;
        }
    })
}

function selectAll() {
    const query = `SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id`
    connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
    });
  };

  function selectDepartments() {
    const query = `SELECT * FROM department`
    connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
    });
  };

  function selectEmployees() {
    const query = `SELECT * FROM employee`
    connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
    });
  };

  function selectRoles() {
    const query = `SELECT * FROM role`
    connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
    });
  };

function addDepartment() {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What department would you like to add?",
        validate: answer => {
            if (answer.length < 1) {
                return "Please enter a department name."
            }
            return true;
        } 
    })
    .then( answer => {
        const query = "INSERT INTO department SET ?"
        connection.query(query, {name: answer.department}, (err, res) => {
        if (err) throw err;
        console.log(`${answer.department} was successfully added!`);
        start();
        });
    });
};

function addRole() {
    inquirer.prompt([{
        name: "title",
        type: "input",
        message: "What role would you like to add?",
        validate: answer => {
            if (answer.length < 1) {
                return "Please enter a role name."
            }
            return true;
        } 
    },
    {
        name: "salary",
        type: "input",
        message: "What is the salary for this role?",
        validate: answer => {
            if (answer.length < 1) {
                return "Please enter a salary."
            }
            return true;
        } 
    },
    {
        name: "department_id",
        type: "input",
        message: "What is the department ID for this role?",
        validate: answer => {
            if (answer.length < 1) {
                return "Please enter a department ID."
            }
            return true;
        } 
    }])
    .then( answer => {
    const query = "INSERT INTO role SET ?"
    connection.query(query, 
        {
            title: answer.title,
            salary: parseInt(answer.salary),
            department_id: parseInt(answer.department_id)
        }, (err, res) => {
      if (err) throw err;
      console.log(`${answer.title}, ${answer.salary}, and ${answer.department_id} were successfully added!`);
      start();
    });
  });
};

function addEmployee() {
    inquirer.prompt([{
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?",
        validate: answer => {
            if (answer.length < 1) {
                return "Please enter the person's first name."
            }
            return true;
        } 
    },
    {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?",
        validate: answer => {
            if (answer.length < 1) {
                return "Please enter the person's last name."
            }
            return true;
        } 
    },
    {
        name: "role_id",
        type: "input",
        message: "What is the employee's role ID?",
        validate: answer => {
            if (answer.length < 1) {
                return "Please enter a role ID."
            }
            return true;
        } 
    }])
    .then( answer => {
    const query = "INSERT INTO employee SET ?"
    connection.query(query, 
        {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.role_id
        }, (err, res) => {
      if (err) throw err;
      console.log(`${answer.first_name}, ${answer.last_name}, and ${answer.role_id} were successfully added!`);
      start();
    });
  });
};

function updateEmployeeRole() {
  inquirer.prompt([
        {
            name: "employee_first",
            type: "input",
            message: "What's the employee's first name that you would you like to update?"
        },
        {
            name: "employee_last",
            type: "input",
            message: "What's the employee's last name that you would you like to update?"
        },
        {
            name: "new_role_id",
            type: "input",
            message: "What is the new role ID for this employee?",
            validate: answer => {
                if (answer.length < 1) {
                    return "Please enter the new role ID."
                }
                return true;
            } 
        }])
        .then( answer => {
            const query = "UPDATE employee SET ? WHERE ?";
            connection.query(query, 
                [{
                    role_id: parseInt(answer.new_role_id) 
                },
                {
                    first_name: answer.employee_first
                },
                {
                    last_name: answer.employee_last
                }], (err, res) => {
                    if (err) throw err;
                    console.log(`${answer.employee_first} ${answer.employee_last} role was updated to ${answer.new_role_id} successfully!`);
                    start();
                });
        });
};