const express = require("express");
const path = require("path");
const bodyparser = require("body-parser")
const cookie = require("cookie-parser")
const port = "3000";
const app = express();
const mysql = require("mysql2");
const dotenv = require("dotenv");
const { access } = require("fs");
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
    if (req.cookies.student)
        res.redirect("/student");
    else if(req.cookies.staff)
        res.redirect("/staff");
    else
        res.render("login.ejs");
});


app.get("/student", (req, res)=>{

    if( !req.cookies.student ){//student cookie is not present;
        res.render("login.ejs");
    }
    else {//student cookie is present
        pool.query("SELECT logged_in from student where college_ID=?",[Number(req.cookies.student.ID)])
            .then((result)=>{
                if(result[0][0].logged_in == 0){//cookie present but logged_in is false(logged out)
                    res.render("login.ejs");
                }
                else{
                    pool.query("SELECT p.*, date_format(DOB, '%d-%m-%Y') as dob, s.name FROM personal_info p, student s WHERE p.college_ID = ? and s.college_ID = ?", [Number(req.cookies.student.ID), Number(req.cookies.student.ID)])
                        .then((retrivedData)=>{
                            res.render("studentinfo.ejs", { info: retrivedData[0][0] });
                        });
                }
            });
    }
    
});


app.get("/staff", (req, res) => {
    if( !req.cookies.staff ) {//staff cookie is not present
        res.render("login.ejs");
    }
    else{//staff cookie is present
        pool.query("SELECT logged_in from staff where ID=?",[req.cookies.staff.ID])
        .then((result) =>{
            if(result[0][0].logged_in == 0){//staff cookie is present but logged_in is false (logged out)
                res.render('login.ejs');
            }
            else{
                pool.query("SELECT access_data from staff where ID=?",[req.cookies.staff.ID])
                .then((result)=>{
                    let access_data=(result[0][0].access_data.access_data);
                    console.log(access_data);
                    res.render('staffdashboard.ejs', {cards: access_data});
                })
                
            }
        })
    }
});

app.get("/class", (req,res) =>{
    res.render("class.ejs");
})

app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    let studentRegex = /^\d{8}$/;   // Regex to match 8 digits(college_ID pattern)
    let staffRegex = /^ST_\d{4}$/;  // Regex to match 
    
    if (studentRegex.test(username)) {
        pool.query("SELECT count(*) as count from student where college_ID = ? and password = ?",[username,password])
            .then((result)=>{
                let count = result[0][0].count;
                if(count == 1){
                    pool.query("UPDATE student set logged_in=1 where college_ID=?",[username]);
                    res.cookie('student', { ID: username }, { maxAge: 15 * 60 * 1000, httpOnly: true });
                    res.status(200).send("/student");
                }
                else{
                    res.status(400).send("Invalid Credentials"); 
                }
            })
            .catch((error)=>{
                console.log(error);
            });
    }
    else if (staffRegex.test(username)) {
        pool.query("SELECT count(*) as count from staff where ID = ? and password = ?", [username, password])
            .then((result)=>{
                let count = result[0][0].count;
                if(count == 1){
                    pool.query("UPDATE staff set logged_in=1 where ID=?",[username]);
                    res.cookie('staff', { ID: username }, { maxAge: 15 * 60 * 1000, httpOnly: true });
                    res.status(200).send("/staff");
                }
                else {
                    res.status(400).send("Invalid Credentials");
                }
            })
            .catch((error)=>{
                console.log(error);
            });
    }
    else{
        res.status(400).send("Invalid username");
    }
})
    

app.post("/logout",(req,res)=>{
    if (req.cookies.student){
        pool.query("UPDATE student set logged_in=0 where college_ID=?",[Number(req.cookies.student.ID)])
            .then((result)=>{
                res.status(200).send("/");
            });
        
    }
    else if(req.cookies.staff){
        pool.query("UPDATE staff set logged_in=0 where ID=?",[req.cookies.staff.ID])
            .then((result) =>{
                res.status(200).send("/");
            });
    }
    else{
        res.status(400).status("Bad request");
    }
});