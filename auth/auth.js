

const express = require("express");

const router = express.Router();

router.post("/register",(req,res) => {
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);
    res.send("Okay got it");
    res.end();
});

router.post("/login",(req,res) => {

});

router.get("/getLoggedInUser",(req,res) => {

});

router.get("token",(req,res) => {

});

module.exports = router;