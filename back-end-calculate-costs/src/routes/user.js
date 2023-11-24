const { Router } = require("express");
const database = require("../database");
const authorization = require("../middleware/authorization");

const router = Router();

router.get("/user", authorization, async (req, res) => {
    try {
        const id = req.user_id;
        const user = await database.getUserAndRoleByID(id);

        if (user.rowCount != 0) {
            res.status(200).json({ user: user.rows[0] });
        } else {
            res.status(401).json({ user: undefined, log: `El usuario no existe` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

module.exports = router;
