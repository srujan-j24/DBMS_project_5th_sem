const express = require("express");
const path = require("path");
const bodyparser = require("body-parser")
const cookie = require("cookie-parser")
const port = "3000";
const app = express();
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
    host: process.env.HOSTNAME,
    port: process.env.PORTNUM,       
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,    
    database: process.env.DBNAME,
    connectTimeout: 60000
}).promise();

app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/image")));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookie());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.listen(port, () => {
    console.log(`App is listening on the port ${port}`);
});

app.get("/", (req, res) => {
    if (req.cookies.student) {
        res.redirect("/student")
    }
    else if(req.cookies.staff){
        res.redirect("/staffdashboard")
    }
    else {
        res.render("login.ejs");
    }

});
app.get("/student", async(req, res)=>{

    if(req.cookies.student ){
            const [rows, fields] = await pool.query("SELECT p.*, date_format(DOB, '%d-%m-%Y') as dob, s.name FROM personal_info p, student s WHERE p.college_ID = ? and s.college_ID = ?", [Number(req.cookies.student.ID), Number(req.cookies.student.ID)]);
            console.log(rows[0]);
            res.render("studentinfo.ejs", { info: rows[0] });
            
    }//content of cookie is present
    else {
        res.render("login.ejs");
    }//content of cookie is not present or invalid
    
});

app.get("/staffdashboard", (req, res) => {
    if (req.cookies.staff && req.cookies.staff.ID == 'S001') {
        res.render("staffdashboard.ejs");
    }//content of cookie is present
    else {
        res.render("login.ejs");
    }
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
    console.log(username);
    console.log(password);
    // Regular expression to match exactly 8 digits
    let studentRegex = /^\d{8}$/;
    let staffRegex = /^S\d{3}$/;
    // Check if the username matches the pattern
    if (studentRegex.test(username)) {
        pool.query("SELECT count(*) as count from student where college_ID = ? and password = ?",[username,password])
            .then((result)=>{
                let count = result[0][0].count;
                if(count == 1){
                    console.log("Hi man")
                    res.cookie('student', { ID: username }, { maxAge: 10 * 60 * 1000, httpOnly: true });
                    res.status(200).send("/student");
                }
                else{
                    res.status(400).send("Credential invalid username or password"); 
                }
                
            })
    }
    else if (staffRegex.test(username)) {
        res.cookie('staff', { ID: username }, { maxAge: 1 * 60 * 1000, httpOnly: true });
        res.status(200).send("/staffdashboard");
    }
    else {
        // If username is invalid, send an error response
        res.status(400).send("Invalid username");
    }
    
});


