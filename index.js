const inquirer = require("inquirer");
require("dotenv").config();
const cTable = require("console.table");
const queries = require("./helpers/queries");
const connection = require("./config/connection");

connection.connect(function () {
  start();
});

function start() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "operation",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Change an employee's role",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.operation) {
        case "View all departments":
          getDepartments();
          break;
        case "View all roles":
          getRoles();
          break;
        case "View all employees":
          getEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Change an employee's role":
          updateEmployeeRole();
          break;
        default:
          connection.end();
          process.end;
          break;
      }
    });
}

async function getDepartments() {
  try {
    const [rows] = await queries.getDepartments();
    console.table(rows);
    start();
  } catch (error) {
    console.log(error);
  }
}

async function getRoles() {
  try {
    const [rows] = await queries.getRoles(connection);
    console.table(rows);
    start();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal servor error" });
  }
}

async function getEmployees() {
  try {
    const [rows] = await queries.getEmployees(connection);
    console.table(rows);
    start();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal servor error" });
  }
}

async function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the department:",
      },
    ])
    .then(async (response) => {
      const newDepartment = await queries.addDepartment(response.name);
      console.table(newDepartment);
      start();
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addRole() {
  const [departments] = await queries.getDepartments();
  console.log(departments);
  const departmentChoices = departments.map((department) => {
    return { value: department.id, name: department.name };
  });

  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the title of the role:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary of the role:",
      },

      {
        type: "list",
        name: "department_id",
        message: "What department does this role belong to?:",
        choices: departmentChoices,
      },
    ])
    .then(async (response) => {
      const [rows] = await queries.addRole(
        response.title,
        response.salary,
        response.department_id
      );
      console.table(rows);
      start();
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter the employee's last name:",
      },
      {
        type: "input",
        name: "role_id",
        message: "Enter the employee's role ID:",
      },
      {
        type: "input",
        name: "manager_id",
        message: "Enter the employee's manager ID:",
      },
    ])
    .then(async (response) => {
      const [rows] = await queries.addEmployee(
        response.first_name,
        response.last_name,
        response.role_id,
        response.manager_id
      );
      console.table(rows);
      start();
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateEmployeeRole() {
  try {
    const [employees] = await queries.getEmployees();
    const [roles] = await queries.getRoles();

    const employeeChoices = employees.map((employee) => {
      return {
        value: employee.id,
        name: employee.first_name + " " + employee.last_name,
      };
    });

    const roleChoices = roles.map((role) => {
      return { value: role.id, name: role.title };
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "employee_id",
          message: "Select the employee to update:",
          choices: employeeChoices,
        },
        {
          type: "list",
          name: "role_id",
          message: "Choose the new role for the employee:",
          choices: roleChoices,
        },
      ])
      .then(async (response) => {
        const [rows] = await queries.updateEmployeeRole(
          response.employee_id,
          response.role_id
        );
        console.table(rows);
        start();
      });
  } catch (error) {
    console.log(error);
  }
}
