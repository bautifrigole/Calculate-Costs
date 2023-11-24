const { verify } = require("jsonwebtoken");
const { getUserLastLogin } = require("../database");
require("dotenv").config();

async function isValidLogin(token_last_login, real_last_login) {
    const last_login_token = new Date(token_last_login);
    const last_login = new Date(real_last_login);
    const millisecondsTolerance = 1000;
    
    const diffInMilliseconds = last_login - last_login_token;

    return diffInMilliseconds <= millisecondsTolerance;
}

module.exports = async (req, res, next) => {
    try {
        const jwtToken = req.header("token");

        if (!jwtToken) return res.status(403).json({ log: "Not authorized" });

        const payload = verify(jwtToken, process.env.jwtSecret);
        const result = await getUserLastLogin(payload.user_id);
        
        const isValid = await isValidLogin(payload.last_login_timestamp, result.rows[0].last_login_timestamp);
        if (!isValid) return res.status(403).json({ log: "Not authorized" });

        req.user_id = payload.user_id;

        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ log: "Not authorized" });
    }
};
