const config = require("config");
const express = require("express");
const router = express.Router();

const products = [
    { id: 1, name: "Seni Çok seviyorum yasemin", price: 27061996 },
    { id: 2, name: "iphone 13", price: 30000 },
    { id: 3, name: "iphone 14", price: 40000 }
];

router.get("/", (req, res) => {
    res.send(config.get("auth.jwtPrivateKey"));
});

module.exports = router;