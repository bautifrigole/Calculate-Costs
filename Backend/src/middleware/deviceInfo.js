const express = require("express");
const morgan = require("morgan");
const DeviceDetector = require("node-device-detector");

const router = express.Router();

const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
});

router.use(morgan('Address: :remote-addr'));

router.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
});

// Get client device info
router.use((req, res, next) => {
    morgan(function (tokens, req, res) {
        req.method = tokens.method;
        req.url = tokens.url;
    });

    const userAgent = req.headers["user-agent"];
    const result = detector.detect(userAgent);
    console.log("");
    console.log("----------------------------------------------------------------------------------");
    console.log("");
    console.log("Headers: ", { host: req.headers.host, token: req.headers.token });
    console.log("Body: ", req.body);
    console.log("Route: ", req.method + " " + req.url);
    console.log(
        `Device: ${result.os.name} - ${result.device.brand} ${result.device.model} - ${result.client.name}`
    );
    next();
});

module.exports = router;
