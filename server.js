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
                pool.query("SELECT sa.* from staff_access sa ,class c WHERE c.id = sa.class_ID  and staff_id =?",[req.cookies.staff.ID])
                .then((result)=>{
                    console.log(result);//
                    result=(result[0]);
                    console.log(result);
                    res.render('staffdashboard.ejs', {cards: result });
                })
                
            }
        })
    }
});

app.get("/class/:class_ID/:sub_code/view", (req,res) =>{
    console.log(req.params.class_ID)
    if(req.cookies.staff) {
        res.render("class.ejs")
    }
    else {
        res.render("login.ejs");
    }
    
})

app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    let studentRegex = /^\d{8}$/;   // Regex to match 8 digits(college_ID pattern)
    let staffRegex = /^ST_\d{4}$/;  // Regex to match 
    
    if (studentRegex.test(username)) {
        console.log("student");
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
        console.log("username");
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
        console.log("Hi")
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
async function getAcademicInfo(res){
    //let sem = `sem${semnum}`
    //pool.query("SELECT * from marks where college_ID='20210001' ")
        // .then((result)=>{
            // console.log(result)
        //let res=result[0][0].sem1;
        //console.log(res);
        let AssignmentavgAry = []
        for(i=0;i<res.ssem.A1.length;i++){
            const Asum=res.ssem.A1[i]+res.ssem.A2[i];
            const Avg=Math.ceil(Asum/2);
            AssignmentavgAry.push(Avg);   
        }
        console.log(AssignmentavgAry)
        let IAavgAry = []
        for(i=0;i<res.ssem.IA1.length;i++){
            const IAsum=res.ssem.IA1[i]+res.ssem.IA2[i]+res.ssem.IA3[i];
            const avg=Math.ceil(IAsum/3);
            IAavgAry.push(avg)
        }
        console.log(IAavgAry)
        let QuizavgAry = []
        for(i=0;i<res.ssem.Q1.length;i++){
            const quiz=res.ssem.Q1[i];
            QuizavgAry.push(quiz)
        }
        console.log(QuizavgAry)
    // })
}

//getAcademicInfo();

app.post("/sem",async(req,res)=>{
    //console.log('hi');
    let sem= req.body.sem;
    
    let college_ID=Number(req.cookies.student.ID)
    pool.query("select m.*, s.name,s.credits from subjects s, marks m where s.sub_code = m.sub_code and college_ID = ? and s.sem_ID = ?;",[college_ID,sem])
        .then((result)=>{
             result = result[0][0];
            console.log(result);
            res.status(200).send(result);
        })
})