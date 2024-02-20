const express = require("express");
const app = express();
const path = require("path");
let port = "3000";

app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/image")));
app.use(express.static(path.join(__dirname, "/public/font")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.listen(port, ()=>{
    console.log(`App is listening on the port ${port}`);
});

app.get("/", (req, res)=>{
    res.render("login.ejs");
});
app.get("/student", (req, res)=>{
    res.render("studentinfo.ejs");
});