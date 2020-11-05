const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employee_DB"
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    main();
})

function main() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View All Departments", "View All Employees", "View All Roles", "Add Department", "Add Employee", "Add Role", "Exit"]
        }
    ]).then(answers => {
        if (answers.choice === "Exit") {
            connection.end();
        } else if (answers.choice === "View All Departments") {
            viewAllDepartments();
        }  else if (answers.choice === "View All Employees") {
            viewAllEmployees();
        } else if (answers.choice === "View All Roles") {
            viewAllRoles();
        } else if (answers.choice === "Add Department") {
            addDepartment();
        } else if (answers.choice === "Add Employee") {
            addEmployee();
        } else if (answers.choice === "Add Role") {
            addRole();
        } else if (answers.choice === "Exit") {
            connection.end();
        }
    })
}



function viewAllDepartments() {
    connection.query("SELECT * FROM department", function (err, data) {
        if (err) throw err;
        console.table(data)
        main();
    })
}

function viewAllEmployees() {
    connection.query("SELECT * FROM employee", function (err, data) {
        if (err) throw err;
        console.table(data)
        main();
    })
}

function viewAllEmployeesByManager() {

}


function viewAllRoles() {
    connection.query("SELECT * FROM employee_role", function (err, data) {
        if (err) throw err;
        console.table(data)
        main();
    })
}


function addDepartment() {
    inquirer.prompt(
        {
            type: "input",
            name: "dept_name",
            message: "Enter the name of the department you would like to add:"
        }
    ).then(answers => {
        connection.query("INSERT INTO department(dept_name) VALUE (?)", [answers.dept_name], function (err, res) {
            if (err) throw err;
            console.table(res);
            main();
        })
    })
}


function addRole() {
    connection.query("SELECT * FROM department", function (err, data) {
        if (err) throw err;
        console.log(data)
        let department = data.map(dept => {
            return { name: dept.dept_name, value: dept.id }
        })
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Enter the title of the role:"
            },
            {
                type: "input",
                name: "salary",
                message: "Enter the salary for this role:"
            },
            {
                type: "list",
                name: "department_id",
                message: "Select the department for this role:",
                choices: department
            }
        ]).then(answers => {
            connection.query("INSERT INTO employee_role (title, salary, department_id) VALUES (?, ?, ?)", [answers.title, answers.salary, answers.department_id], function (err, data) {
                if (err) throw err;
                console.table(data);
                main();
            })
        })
    })
}



function addEmployee() {
    connection.query("SELECT * FROM employee_role", function (err, data) {
        if (err) throw err;
        console.log(data)
        let role = data.map(role => {
            return { name: role.title, value: role.id }
        })
        connection.query("SELECT * FROM employee", function (err, data) {
            if (err) throw err;
            let manager = data.map(manager => {
                return { name: `${manager.first_name} ${manager.last_name}`, value: manager.id }
            })


            inquirer.prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "Enter the employee's first name:"
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "Enter the employee's last name:"
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "Select the employee's role:",
                    choices: role
                },
                {
                    type: "list",
                    name: "manager_id",
                    message: "Select the employee's manager:",
                    choices: manager
                }
            ]).then(answers => {
                connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    main();
                })
            })
        })
    })
}


function updateEmployeeRole() {
    connection.query("SELECT * FROM employee_role", function (err, data) {
        if (err) throw err;
        console.log(data)
        let role = data.map(role => {
            return { name: role.title, value: role.id }
        })
        connection.query("SELECT * FROM employee", function (err, data) {
            if (err) throw err;
            let emp = data.map(emp => {
                return { name: emp.last_name, value: emp.id }
            })


            inquirer.prompt([
                {
                    type: "list",
                    name: "employee_id",
                    message: "Select the employee's name:",
                    choices: emp
                },
                {
                    type: "list",
                    name: "new_role_id",
                    message: "Select the employee's new role:",
                    choices: role
                }
            ]).then(answers => {
                connection.query("UPDATE employee Set (last_name, role_id) WHERE (?, ?)", [answers.employee_id, answers.new_role_id], function (err, res) {
                    if (err) throw err;
                    console.log("Role was updated");
                    connection.query("SELECT * FROM employee LEFT JOIN employee_role employee.role_id = role.id", function(err, data) {
                        if (err) throw err;
                        console.table(data);
                    })
                    main();
                })
            })
        })
    })
}

