const express = require("express");
const app = express();
const path = require("path");
const bodyparser = require("body-parser")
const cookie = require("cookie-parser")
let port = "3000";

app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/image")));
app.use(bodyparser.urlencoded({extended : true}));
app.use(cookie());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.listen(port, ()=>{
    console.log(`App is listening on the port ${port}`);
});

app.get("/", (req, res)=>{
    if(req.cookies.student)
    {
        res.redirect("/student")
    }
    else{
        res.render("login.ejs");
    }
    
});
app.get("/student", (req, res)=>{
    if(req.cookies.student && req.cookies.student.ID =='20210001'){
    res.render("studentinfo.ejs");
    }//content of cookie is present
    else{
        res.render("login.ejs");
    }//content of cookie is not present or invalid
});
app.get("/staffdashboard",(req,res)=>{
    res.render("staffdashboard.ejs");
});
// app.post("/login",(req,res)=>{
//    // console.log(req.body)
//    let username = req.body.username;
//    let password = req.body.password;
//    //console.log(username);
//    //console.log(password);
//    //console.log(req.body);
// //    if(username == "admin"&& password == "admin")
//    if (req.cookies.student && /^\d{8}$/.test(req.cookies.student)){
//         res.cookie('student',{ID:'20210001'},{maxAge:1*60*1000,httpOnly:true})
//         res.status(200).send("/student")
//    }
//    else{
//     res.status(400).send("Both invalid")
//    }
// })
app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    // Regular expression to match exactly 8 digits
    let usernameRegex = /^\d{8}$/;

    // Check if the username matches the pattern
    if (usernameRegex.test(username)) {
        // If username is valid, set the student cookie and redirect
        res.cookie('student', { ID: username }, { maxAge: 1 * 60 * 1000, httpOnly: true });
        res.status(200).send("/student");
    } else {
        // If username is invalid, send an error response
        res.status(400).send("Invalid username");
    }
});

