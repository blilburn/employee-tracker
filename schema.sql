DROP DATABASE IF EXISTS employee_DB;

CREATE DATABASE employee_DB;

USE employee_DB;


CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee_role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES employee_role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (dept_name)
VALUES ("Marketing"), ("Accounting"), ("Sales"), ("Human Resources");

INSERT INTO employee_role (title, salary, department_id)
VALUES ("Manager", 50000.00, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Frank", "Thompson", 1, 1);

SELECT first_name, last_name, department.dept_name FROM employee
LEFT JOIN employee_role
ON employee.role_id = employee_role.id 
LEFT JOIN department
ON employee_role.department_id = department_id;