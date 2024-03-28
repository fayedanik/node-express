

const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./auth/auth");
const fs = require("fs");

const app = express();

app.config = {
    port: 3000
};

dotenv.config();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.listen(process.env.PORT,() => {
    console.log(`app is liseting on port ${process.env.PORT}`);
});


app.get('/booklist',(req,res)=> {
    
});

app.post("/register",(req,res) => {
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);
    res.send("Okay got it");
    res.end();
});

app.use("/api/auth",authRoutes);

module.exports = app;