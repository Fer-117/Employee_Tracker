const connection = require("../config/connection");

function getDepartments() {
  return connection.promise().query("SELECT * FROM department");
}

function getRoles() {
  return connection.promise().query("SELECT * FROM role");
}

function getEmployees() {
  return connection.promise().query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id`
  );
}

function addDepartment(name) {
  connection.promise().query("INSERT INTO department SET ?", { name });
  return `Added ${name} to the database`;
}

function addRole(title, salary, departmentId) {
  return connection.promise().query("INSERT INTO role SET ?", {
    title,
    salary,
    department_id: departmentId,
  });
}

function addEmployee(firstName, lastName, roleId, managerId) {
  return connection.promise().query("INSERT INTO employee SET ?", {
    first_name: firstName,
    last_name: lastName,
    role_id: roleId,
    manager_id: managerId,
  });
}

function updateEmployeeRole(employeeId, roleId) {
  return connection
    .promise()
    .query("UPDATE employee SET role_id = ? WHERE id = ?", [
      roleId,
      employeeId,
    ]);
}

module.exports = {
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};
