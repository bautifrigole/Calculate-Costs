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
app.use("/", require("./routes/user"));
app.use("/auth", require("./routes/auth"));
//app.use("/admin", require("./routes/admin"));

// Sending static files using middleware
app.use(
    "/static",
    express.static(path.join(__dirname, "..", "Static Files"))
);

// Sending a single file on a route
app.get("/file", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "estacionamiento.png"));
});

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
