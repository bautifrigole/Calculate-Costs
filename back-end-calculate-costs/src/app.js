const express = require("express");
const deviceInfo = require("./middleware/deviceInfo");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
var ip = require("ip");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: true,
    credentials: true,
};
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(deviceInfo);
//app.use("/", require("./routes/user"));
//app.use("/auth", require("./routes/auth"));
app.use("/group", require("./routes/group"));
app.use("/expense", require("./routes/expense"));

app.use((req, res) => {
    res.status(404).send("Error 404: Not Found");
});

app.listen(port, (error) => {
    if (!error)
        console.log(
            `Server is running on http://${ip.address()}:${port}/`
        );
    else console.log("Error occurred, server can't start", error);
});
