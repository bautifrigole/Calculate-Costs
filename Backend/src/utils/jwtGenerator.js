const jwt = require("jsonwebtoken");
const { setUserLastLogin } = require("../database");
require("dotenv").config();

async function generateJwt(user_id, is_admin = false) {
    try {
        const today = new Date();
        const mm = today.getMonth() + 1;
        const dd = today.getDate();
        const yy = today.getFullYear();
        const time = today.toLocaleTimeString('es-AR');

        const now = yy + '-' + mm + '-' + dd + " " + time;
        await setUserLastLogin(user_id, now);

        const payload = { user_id: user_id, last_login_timestamp: today.toString() };

        return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "180d" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
}

module.exports = generateJwt;
