const Pool = require("pg").Pool;
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: false
});

async function makeQuery(query) {
    console.log(query);
    const res = await pool.query(query);
    console.log("DB response:");
    console.table(res.rows);
    return res;
}

async function existsUser(document_type, document_key) {
    const result = await makeQuery(
        "SELECT user_id, document_type_id, document_type, document_key, first_name, last_name, role_id FROM user_account NATURAL JOIN user_document_type WHERE document_type = '" + document_type + "' AND document_key = '" + document_key  + "';"
    );
    return result;
}

async function existsUserByID(user_id) {
    const result = await makeQuery(
        "SELECT user_id, document_type_id, document_type, document_key, first_name, last_name, role_id FROM user_account NATURAL JOIN user_document_type WHERE user_id = " + user_id + ";"
    );
    return result;
}

async function getUserByID(user_id) {
    const result = await makeQuery(
        "SELECT * FROM user_account NATURAL JOIN user_document_type WHERE user_id = " + user_id + " AND status_id = 1;"
    );
    return result;
}

async function getUserByIDKey(document_type, document_key) {
    const result = await makeQuery(
        "SELECT * FROM user_account NATURAL JOIN user_document_type WHERE document_type = '" + document_type + "' AND document_key = '" + document_key  + "' AND status_id = 1;"
    );
    return result;
}

async function getUserAndRoleByIDKey(document_type, document_key) {
    const result = await makeQuery(
        "SELECT user_id, document_type_id, document_type, document_key, first_name, last_name, role_id, role_name, color FROM user_account NATURAL JOIN (SELECT role_id, role_name, color FROM user_role) AS r NATURAL JOIN user_document_type WHERE document_type = '" + document_type + "' AND document_key = '" + document_key  + "' AND status_id = 1;"
    );
    return result;
}

async function getUserAndRoleByID(id) {
    const result = await makeQuery(
        "SELECT user_id, document_type_id, document_type, document_key, first_name, last_name, role_id, role_name, color FROM user_account NATURAL JOIN (SELECT role_id, role_name, color FROM user_role) AS r NATURAL JOIN user_document_type WHERE user_id = " + id + " AND status_id = 1;"
    );
    return result;
}

async function modifyPassword(user_id, new_password) {
    const result = await makeQuery(
        "UPDATE user_account SET user_password = '"+ new_password + "' WHERE user_id = " + user_id + ";"
    );
    return result.rowCount > 0;
}

async function addUser(document_type, document_key, password, first_name, last_name, role_id) {
    const document_type_id = await getDocumentTypeID(document_type);
    if (document_type_id === null) return null;
    
    const result = await makeQuery(
        "INSERT INTO user_account (document_type_id, document_key, first_name, last_name, user_password, role_id) values ('" + document_type_id + "', '" + document_key  + "', '" + first_name + "', '" + last_name +  "', '" + password +  "', " + role_id + ") RETURNING user_id;"
    );
    return result;
}

async function setUserLastLogin(user_id, last_login_timestamp) {
    const result = await makeQuery(
        "UPDATE user_account SET last_login_timestamp = '" + last_login_timestamp + "' WHERE user_id = " + user_id + ";"
    );
    return result;
}

async function getUserLastLogin(user_id) {
    const result = await makeQuery(
        "SELECT last_login_timestamp FROM user_account WHERE user_id = " + user_id + ";"
    );
    return result;
}

async function getUsersWithLastName(last_name) {
    const result = await makeQuery(
        "SELECT user_id, document_type_id, document_type, document_key, first_name, last_name, status_id, status_name, role_id, role_name, color FROM user_account NATURAL JOIN (SELECT role_id, role_name, color FROM user_role) AS r NATURAL JOIN user_document_type NATURAL JOIN status WHERE LOWER(last_name) LIKE '"+ last_name.toLowerCase() +"%' ORDER BY status_id ASC;"
    );
    return result;
}

async function getDocumentTypeID(document_type) {
    const result = await makeQuery(
        "SELECT document_type_id FROM user_document_type WHERE document_type = '" + document_type + "';"
    );

    if (result.rowCount === 0) return null;
    else return result.rows[0].document_type_id;
}

async function getDocumentType(document_type_id) {
    const result = await makeQuery(
        "SELECT document_type FROM user_document_type WHERE document_type_id = " + document_type_id + ";"
    );

    if (result.rowCount === 0) return null;
    else return result.rows[0].document_type;
}

async function addUserAdmin(admin_name, admin_password) {
    const result = await makeQuery(
        "INSERT INTO user_admin (admin_name, admin_password) VALUES ('" + admin_name + "', '" + admin_password + "') RETURNING admin_id;"
    );
    return result;
}

async function getUserAdmin(admin_name) {
    const result = await makeQuery(
        "SELECT * FROM user_admin WHERE admin_name = '" + admin_name + "';"
    );
    return result;
}

async function updateUserStatus(user_id, status_id) {
    const result = await makeQuery(
        "UPDATE user_account SET status_id = " + status_id + " WHERE user_id = " + user_id + ";"
    );
    return result;
}

async function updateUser(user_id, document_type, document_key, first_name, last_name, role_id) {
    const document_type_id = await getDocumentTypeID(document_type);
    if (document_type_id === null) return null;

    const result = await makeQuery(
        "UPDATE user_account AS u SET document_type_id = u2.document_type_id, document_key = u2.document_key, first_name = u2.first_name, last_name = u2.last_name, role_id = u2.role_id FROM (VALUES (" +
        user_id + ", " + document_type_id + ", '" + document_key + "',	'" + first_name + "', '" + last_name + "', " + role_id + ")) AS u2(user_id, document_type_id, document_key, first_name, last_name, role_id) WHERE u2.user_id = u.user_id;"
        );
    return result;
}

async function getDocumentTypes() {
    const result = await makeQuery(
        "SELECT * FROM user_document_type;"
    );
    return result;
}

async function getRoles() {
    const result = await makeQuery(
        "SELECT * FROM user_role NATURAL JOIN status WHERE status_id = 1;"
    );
    return result;
}

async function getRolesWithName(role_name) {
    const result = await makeQuery(
        "SELECT * FROM user_role NATURAL JOIN status WHERE LOWER(role_name) LIKE '"+ role_name.toLowerCase() +"%' ORDER BY status_id ASC;"
    );
    return result;
}

async function existsRoleName(role_name) {
    const result = await makeQuery(
        "SELECT * FROM user_role WHERE LOWER(role_name)='" + role_name.toLowerCase() + "';"
    );
    return result;
}

async function addRole(role_name, color) {
    const result = await makeQuery(
        "INSERT INTO user_role (role_name, color) VALUES ('" + role_name + "', '" + color + "');"
    );
    return result;
}

async function updateRoleStatus(role_id, status_id) {
    const result = await makeQuery(
        "UPDATE user_role SET status_id = " + status_id + " WHERE role_id = " + role_id + ";"
    );
    return result;
}

async function getRoleByID(role_id) {
    const result = await makeQuery(
        "SELECT * FROM user_role NATURAL JOIN status WHERE role_id = " + role_id + ";"
    );
    return result;
}

async function updateRole(role_id, role_name, color) {
    const result = await makeQuery(
        "UPDATE user_role AS u SET role_name = u2.role_name, color = u2.color FROM (VALUES (" +
        role_id + ", '" + role_name + "', '" + color + "')) AS u2(role_id, role_name, color) WHERE u2.role_id = u.role_id;"
        );
    return result;
}


async function existsAdminRoute(admin_route) {
    const result = await makeQuery(
        "SELECT admin_operation_id FROM admin_operation WHERE operation_route = '" + admin_route + "';"
    );
    return result;
}

async function addAdminRoute(admin_route) {
    const result = await makeQuery(
        "INSERT INTO admin_operation (operation_route) VALUES ('" + admin_route + "') RETURNING admin_operation_id;"
    );
    return result;
}

async function addAdminLog(description, admin_operation_id, admin_id) {
    const result = await makeQuery(
        "INSERT INTO admin_log (description, admin_operation_id, admin_id) VALUES ('" + description + "', " + admin_operation_id + ", " + admin_id + ");;"
    );
    return result;
}

async function existsUserRoute(user_route) {
    const result = await makeQuery(
        "SELECT user_operation_id FROM user_operation WHERE operation_route = '" + user_route + "';"
    );
    return result;
}

async function addUserRoute(user_route) {
    const result = await makeQuery(
        "INSERT INTO user_operation (operation_route) VALUES ('" + user_route + "') RETURNING user_operation_id;"
    );
    return result;
}

async function addUserLog(description, user_operation_id, user_id) {
    const result = await makeQuery(
        "INSERT INTO user_log (description, user_operation_id, user_id) VALUES ('" + description + "', " + user_operation_id + ", " + user_id + ");"
    );
    return result;
}

module.exports = { existsUser, existsUserByID, modifyPassword, getUserByID, getUserByIDKey, 
    getUserAndRoleByID, getUserAndRoleByIDKey, addUser, setUserLastLogin, getUserLastLogin, getUsersWithLastName, getDocumentTypeID, addUserAdmin, getUserAdmin, updateUserStatus, updateUser, getDocumentTypes, getRoles, getDocumentType, getRolesWithName, existsRoleName, addRole, updateRoleStatus, getRoleByID, updateRole, existsAdminRoute, addAdminRoute, addAdminLog, existsUserRoute, addUserRoute, addUserLog };