const { Router } = require("express");
const database = require("../database");
const bcrypt = require("bcrypt");
const generateJwt = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");

const router = Router();

router.get("/user-by-lastname", authorization, async (req, res) => {
    try {
        if (!req.is_admin) return res.status(403).json({ log: "Not authorized" });

        const result = await database.getUsersWithLastName(req.query.lastname);

        res.status(200).json({ log: true, users: result.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.get("/roles", async (req, res) => {
    try {
        const result = await database.getRoles();

        res.status(200).json({ log: true, roles: result.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.get("/document-types", async (req, res) => {
    try {
        const result = await database.getDocumentTypes();

        res.status(200).json({ log: true, document_types: result.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.post("/change-user-status", authorization, async (req, res, next) => {
    try {
        if (!req.is_admin) return res.status(403).json({ log: "Not authorized" });

        const { user_id, active_status } = req.body;

        const existsUser = await database.existsUserByID(user_id);
        if (existsUser.rowCount === 0) return res.status(401).json({ log: "El usuario no existe" });

        status_id = active_status ? 1 : 2;
        await database.updateUserStatus(user_id, status_id);

        res.status(200).json({ log: true });
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.post("/change-password", authorization, async (req, res, next) => {
    try {
        if (!req.is_admin) return res.status(403).json({ log: "Not authorized" });

        const { user_id, new_password } = req.body;

        const existsUser = await database.existsUserByID(user_id);
        if (existsUser.rowCount === 0) return res.status(401).json({ log: "El usuario no existe" });

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(new_password, salt);

        await database.modifyPassword(user_id, bcryptPassword)

        res.status(200).json({ log: true });
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.post("/admin-register", async (req, res) => {
    try {
        const { admin_name, admin_password } = req.body.form;
        const result = await database.getUserAdmin(admin_name);

        if (result.rowCount > 0) return res.status(401).json({ log: "Admin already exist" });

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(admin_password, salt);

        const newUser = await database.addUserAdmin(admin_name, bcryptPassword);
        const token = await generateJwt(newUser.rows[0].admin_id, true);

        res.status(200).json({ log: "Admin created", token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.post("/admin-login", async (req, res) => {
    try {
        const { admin_name, admin_password } = req.body;
        const result = await database.getUserAdmin(admin_name);

        if (result.rowCount === 0)
            return res
                .status(401)
                .json({ log: `${admin_name} no existe` });

        const validPassword = await bcrypt.compare(
            admin_password,
            result.rows[0].admin_password
        );

        if (!validPassword)
            return res.status(401).json({ log: "Contraseña incorrecta" });

        const token = await generateJwt(result.rows[0].admin_id, true);
        res.status(200).json({ log: true, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.post("/user-register", authorization, async (req, res, next) => {
    try {
        if (!req.is_admin) return res.status(403).json({ log: "Not authorized" });
        
        const { document_type_id, document_key, password, first_name, last_name, role_id } = req.body.form;
        
        const document_type = await database.getDocumentType(document_type_id);
        if (document_type === null) return res.status(401).json({ log: "El tipo de documento " + document_type + " no existe" });

        const existsUser = await database.existsUser(document_type, document_key);
        if (existsUser.rowCount > 0) return res.status(401).json({ log: "El usuario ya existe" });

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPassword = await bcrypt.hash(password, salt);

        await database.addUser(document_type, document_key, bcryptPassword, first_name, last_name, role_id);

        res.status(200).json({ log: "User created" });
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.put("/modify-user", authorization, async (req, res, next) => {
    try {
        if (!req.is_admin) return res.status(403).json({ log: "Not authorized" });

        const { user_id, document_type_id, document_key, first_name, last_name, role_id } = req.body.form;

        const existsUser = await database.existsUserByID(user_id);
        if (existsUser.rowCount === 0) return res.status(401).json({ log: "El usuario no existe" });
        
        const document_type = await database.getDocumentType(document_type_id);
        if (document_type === null) return res.status(401).json({ log: "El tipo de documento " + document_type + " no existe" });

        const existsUserResult = await database.existsUser(document_type, document_key);
        if (existsUserResult.rowCount > 0 && existsUserResult.rows[0].user_id !== user_id) return res.status(401).json({ log: "Ya existe un usuario distinto con ese documento" });

        const getUserResult = await database.getUserByID(user_id);
        if (!getUserResult.rowCount > 0) return res.status(401).json({ log: "El usuario no existe" });

        await database.updateUser(user_id, document_type, document_key, first_name, last_name, role_id);

        res.status(200).json({ log: true });
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.get("/user", authorization, async (req, res) => {
    try {
        if (!req.is_admin) return res.status(403).json({ log: "Not authorized" });

        const user = await database.getUserAndRoleByID(req.query.user_id);

        if (user.rowCount != 0) {
            res.status(200).json({ log: true, user: user.rows[0] });
        } else {
            res.status(401).json({ user: undefined, log: `El usuario no existe` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.get("/role-by-name", authorization, async (req, res) => {
    try {
        if (!req.is_admin) return res.status(403).json({ log: "Not authorized" });

        const result = await database.getRolesWithName(req.query.role_name);

        res.status(200).json({ log: true, roles: result.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.post("/role-register", authorization, async (req, res, next) => {
    try {
        if (!req.is_admin) return res.status(403).json({ log: "Not authorized" });

        const { role_name, color } = req.body.form;

        const existsRoleName = await database.existsRoleName(role_name);
        if (existsRoleName.rowCount > 0) return res.status(401).json({ log: "El nombre del rol ya existe" });

        await database.addRole(role_name, color);

        res.status(200).json({ log: "Role created" });
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.post("/change-role-status", authorization, async (req, res, next) => {
    try {
        if (!req.is_admin) return res.status(403).json({ log: "Not authorized" });

        const { role_id, active_status } = req.body;

        const existsRole = await database.getRoleByID(role_id);
        if (existsRole.rowCount === 0) return res.status(401).json({ log: "El rol no existe" });

        status_id = active_status ? 1 : 2;
        await database.updateRoleStatus(role_id, status_id);

        res.status(200).json({ log: true });
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.get("/role", authorization, async (req, res) => {
    try {
        if (!req.is_admin) return res.status(403).json({ log: "Not authorized" });

        const role = await database.getRoleByID(req.query.role_id);

        if (role.rowCount != 0) {
            res.status(200).json({ log: true, role: role.rows[0] });
        } else {
            res.status(401).json({ user: undefined, log: `El rol no existe` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.put("/modify-role", authorization, async (req, res, next) => {
    try {
        if (!req.is_admin) return res.status(403).json({ log: "Not authorized" });

        const { role_id, role_name, color } = req.body.form;
        
        const existsRoleNameResult = await database.existsRoleName(role_name);
        if (existsRoleNameResult.rowCount > 0 && existsRoleNameResult.rows[0].role_id !== role_id) return res.status(401).json({ log: "El nombre del rol ya existe" });

        const getRoleResult = await database.getRoleByID(role_id);
        if (!getRoleResult.rowCount > 0) return res.status(401).json({ log: `El id de rol ${role_id} no existe` });

        await database.updateRole(role_id, role_name, color);

        res.status(200).json({ log: true });
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

module.exports = router;