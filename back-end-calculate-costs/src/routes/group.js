const { Router } = require("express");
const database = require("../database");

const router = Router();

router.post("/add-group", async (req, res) => {
    try {
        const name = req.query.name;
        const groupId = generateId();

        while (groupExists(groupId)) {
            groupId = generateId();
        }

        res.status(200).json({ log: "Group created successfully" });
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

router.post("/add-group-member", async (req, res) => {
    try {
        const memberName = req.query.member_name;
        const groupId = req.query.group_id;

        const existsMember = await database.existsUsersGroupMember(memberName, groupId);
        if (existsMember.rowCount > 0) return res.status(401).json({ log: "The member already exists" });
        
        await database.addUsersGroupMember(memberName, groupId);

        res.status(200).json({ log: "Member created" });
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

function generateId(size = 6, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
    return Array.from({ length: size }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function groupExists(groupId) {
    group = await database.getUserAndRoleByID(groupId);
    return group.rowCount != 0;
}

module.exports = router;
