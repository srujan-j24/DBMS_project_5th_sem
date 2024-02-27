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
    host: 'localhost',
    port: process.env.PORTNUM,       
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,   
    database: process.env.DBNAME,
    
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
        res.redirect("/staff")
    }
    else {
        res.render("login.ejs");
    }

});
app.get("/student", (req, res)=>{

    if(req.cookies.student ){
            pool.query("SELECT logged_in from student where college_ID=?",[Number(req.cookies.student.ID)])
                .then(async(result)=>{
                    if(result[0][0].logged_in==0){
                        res.render("login.ejs")
                    }
                    else{
                        const [rows, fields] = await pool.query("SELECT p.*, date_format(DOB, '%d-%m-%Y') as dob, s.name FROM personal_info p, student s WHERE p.college_ID = ? and s.college_ID = ?", [Number(req.cookies.student.ID), Number(req.cookies.student.ID)]);
                        console.log(rows[0]);
                        res.render("studentinfo.ejs", { info: rows[0] });
                    }
                })
            
            
    }//content of cookie is present
    else {
        res.render("login.ejs");
    }//content of cookie is not present or invalid
    
});

app.get("/staff", (req, res) => {
    console.log("recieved")
    if (req.cookies.staff) {
        pool.query("SELECT logged_in from staff where ID=?",[req.cookies.staff.ID])
        .then((result) =>{
            // console.log(result);
            if(result[0][0].logged_in==0){
                res.render('login.ejs');
            }
            else{
                res.render('staffdashboard.ejs')
            }
        })

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
    let staffRegex = /^ST_\d{4}$/;
    // Check if the username matches the pattern
    if (studentRegex.test(username)) {
        pool.query("SELECT count(*) as count from student where college_ID = ? and password = ?",[username,password])
            .then((result)=>{
                let count = result[0][0].count;
                if(count == 1){
                    console.log("Hi man")
                    pool.query("UPDATE student set logged_in=1 where college_ID=?",[username]);
                    res.cookie('student', { ID: username }, { maxAge: 1 * 60 * 1000, httpOnly: true });
                    res.status(200).send("/student");
                }
                else{
                    res.status(400).send("Credential invalid username or password"); 
                }
                
            })
            .catch((error)=>{
                console.log(error);
            })
    }
    else if (staffRegex.test(username)) {
        pool.query("SELECT count(*) as count from staff where ID = ? and password = ?", [username, password])
        .then((result)=>{
            let count = result[0][0].count;
            if(count == 1){
                console.log("Hi man")
                pool.query("UPDATE staff set logged_in=1 where ID=?",[username]);
                res.cookie('staff', { ID: username }, { maxAge: 1 * 60 * 1000, httpOnly: true });
                res.status(200).send("/staff");
            }
            else {
                // If username is invalid, send an error response
                res.status(400).send("Invalid username");
             }
               
});
    }
    

app.post("/logout",(req,res)=>{
    if (req.cookies.student){
        pool.query("UPDATE student set logged_in=0 where college_ID=?",[Number(req.cookies.student.ID)])
            .then((result)=>{
                res.status(200).send("/");
            })
        
    }
    else if(req.cookies.staff){
        console.log(req.cookies.ID);
        pool.query("UPDATE staff set logged_in=0 where ID=?",[req.cookies.staff.ID])
        .then((result) =>{
            res.status(200).send("/");
        })
    }
    
    
})
    
})
