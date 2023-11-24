const { Router } = require("express");
const database = require("../database");

const router = Router();

router.post("/add-expense", async (req, res) => {
    try {
        const groupId = req.query.group_id;
        const memberId = req.query.member_id;
        const description = req.query.description;
        const amount = req.query.expense_amount;

        const existsMember = await database.existsUsersGroupMember(memberName, groupId);
        if (existsMember.rowCount > 0) return res.status(401).json({ log: "The member already exists" });
        
        await database.addExpense(groupId, memberId, description, amount);

        res.status(200).json({ log: "Expense created" });
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({ log: "Server error" });
    }
});

module.exports = router;
