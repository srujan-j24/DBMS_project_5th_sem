const express = require("express");
const path = require("path");
const bodyparser = require("body-parser")   //http req - extracts body gives to server
const cookie = require("cookie-parser")        //token for authentication
const port = "3000";
const app = express();
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({                 //pool-bunch of connection
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

app.get("/staff", async(req, res) => {
    if( !req.cookies.staff ) {//staff cookie is not present
        res.render("login.ejs");
    }
    else{//staff cookie is present
        pool.query("SELECT logged_in from staff where ID=?",[req.cookies.staff.ID])
        .then(async(result) =>{
            if(result[0][0].logged_in == 0){//staff cookie is present but logged_in is false (logged out)
                res.render('login.ejs');
            }
            else{
                console.log(req.cookies.staff.ID)
                let hod = await pool.query("SELECT * from staff where ID = ? ",[req.cookies.staff.ID])
                let access_datas = await pool.query("SELECT sa.* from staff_access sa ,class c, staff s WHERE c.id = sa.class_ID  and staff_id =? and s.ID = sa.staff_ID",[req.cookies.staff.ID])
                let is_hod = hod[0][0].is_hod == 1;
                let hod_branch = hod[0][0].branch_ID;
                res.render('staffdashboard.ejs', {cards: access_datas[0], hod: is_hod,branch:hod_branch });
                
            }
        })
    }
});

app.get("/class/:class_ID/:sub_code/view", (req,res) =>{
    console.log(req.params.class_ID)
    if(req.cookies.staff) {
        let staff_id = req.cookies.staff.ID; 
        let class_ID = req.params.class_ID;
        let sub_code = req.params.sub_code;
        pool.query("select count(*) as count from staff_access where staff_id = ? and class_ID = ? and sub_code = ?",[staff_id,class_ID,sub_code] )
            .then((result)=>{
                if(result[0][0].count == 1){
                    pool.query("SELECT s.name,m.* from student s, marks m where s.college_ID = m.college_ID and cur_class_ID= ? and sub_code= ?",[class_ID,sub_code])
                        .then((result)=>{
                            
                            res.render("class.ejs",{data:result[0],editoption:false,class_ID:class_ID,sub_code:sub_code});
                        })
                    }
                else{
                    res.status(400).send("Invalid request");
                }
            })     
    }
    else {
        res.render("login.ejs");
    }  
})

app.get("/class/:class_ID/:sub_code/edit", (req,res) =>{
    console.log(req.params.class_ID)
    if(req.cookies.staff) {
        let staff_id = req.cookies.staff.ID; 
        let class_ID = req.params.class_ID;
        let sub_code = req.params.sub_code;
        pool.query("select count(*) as count from staff_access where staff_id = ? and class_ID = ? and sub_code = ?",[staff_id,class_ID,sub_code] )
            .then((result)=>{
                if(result[0][0].count == 1){
                    pool.query("SELECT s.name,m.* from student s, marks m where s.college_ID = m.college_ID and cur_class_ID= ? and sub_code= ?",[class_ID,sub_code])
                        .then((result)=>{
                           
                            res.render("class.ejs",{data:result[0],editoption:true,class_ID:class_ID,sub_code:sub_code});
                        })
                    }
                else{
                    res.status(400).send("Invalid request");
                }
            })     
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
                    res.cookie('student', { ID: username }, { maxAge: 60 * 60 * 1000, httpOnly: true });
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
                    res.cookie('staff', { ID: username }, { maxAge: 60 * 60 * 1000, httpOnly: true });
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
             result = result[0];
            console.log(result);
            res.status(200).send(result);
        })
})

app.post("/class/:class_id/:sub_code/edit",async (req,res)=>{
    let vals = req.body.updatedvalues;
    
    for(i=0;i<vals.length;i++){
        let v = [vals[i].ia1,vals[i].ia2,vals[i].ia3,vals[i].as1,vals[i].as2,vals[i].q1,req.params.sub_code,vals[i].college_ID];
        
        let result = await pool.query("update marks set ia1=?,ia2=?,ia3=?,as1=?,as2=?,q1=? where sub_code=? and college_ID=?",v);
        
    }
    res.status(200).send(`/class/${req.params.class_id}/${req.params.sub_code}/view`);
    
});

app.get("/student/manage", async (req, res)=>{
    if(!req.cookies.staff){
        res.render("login.ejs");
    }else{
        let result = await pool.query("select is_hod, branch_ID from staff where ID = ?", [req.cookies.staff.ID]);
        if(result[0][0].is_hod == 0){
            res.status(400).send("Your don't have access");
        }else{
            let classes = await pool.query("select c.* from staff s, class c where s.branch_ID = c.branch_ID and s.ID = ?", [req.cookies.staff.ID]);
            let students = await pool.query("select s.name, college_ID from student s, staff st where s.branch_ID = st.branch_ID and st.ID = ?", [req.cookies.staff.ID]);
            let batches = await pool.query("select * from batch");
            console.log(batches);
            console.log(classes);
            console.log(students);
            console.log(result);
            res.render("mng-student.ejs", {classes: classes[0], students: students[0], batches: batches[0],branch:result[0][0].branch_ID});
        }
    }
});

app.get("/staff/manage/:branch", async (req, res)=>{
    console.log(req.params.branch);

    if(!req.cookies.staff){
        res.render("login.ejs");
    }else{
        let result = await pool.query("select is_hod from staff where ID = ?", [req.cookies.staff.ID]);
        if(result[0][0].is_hod == 0){
            res.status(400).send("Your don't have access");
        }
        else{
            let result = await pool.query("SELECT * FROM staff WHERE branch_ID = ?",[req.params.branch]);
            let classes = await pool.query("SELECT id from class ");
            let sub_codes = await pool.query("SELECT sub_code from subjects");
            result = result[0];
            console.log(result);
            console.log(classes[0]);
            console.log(sub_codes[0]);
            res.render("mng-staff.ejs",{staff:result,class_ary:classes[0],subcode_ary:sub_codes[0]});
        }
    }
});


app.post("/student/new", async (req, res)=>{
    let {name,dob,blood_type,student_ph,parent_ph,address,cur_class_id,validity,batch_id,branch_id,password} = req.body;
    console.log(req.body);
    let st_count = await pool.query("select count(*) as count from student where batch_ID=?",[Number(batch_id)]);
    console.log(batch_id);
    console.log(branch_id);
    console.log(st_count);
    let nxt_clgID = `${batch_id}${(st_count[0][0].count+1).toString().padStart(4,'0')}`;
    nxt_clgID = Number(nxt_clgID);
    console.log(nxt_clgID);
    pool.query("INSERT into student (college_ID,name,batch_ID,branch_ID,cur_class_ID,password) values(?,?,?,?,?,?) ",[nxt_clgID,name,batch_id,branch_id,cur_class_id,password])
        .then(()=>{
            pool.query("INSERT into personal_info(college_ID,blood_type,DOB,personal_phone,parent_phone,address,validity) values(?,?,?,?,?,?,?)",[nxt_clgID,blood_type,dob,student_ph,parent_ph,address,validity]);
        })
        .then(()=>{
            
           return pool.query("SELECT sub.sub_code from subjects sub, scheme sc,batch b where b.scheme_ID=sc.id and sc.id=sub.scheme_ID and b.id=? and sc.branch_id=?",[batch_id,branch_id]);

        })
        .then(async(result)=>{
            console.log(result);
            result = result[0];
            for(i=0;i<result.length;i++) {
                await pool.query("INSERT into marks(college_ID,sub_code) values(?,?)",[nxt_clgID,result[i].sub_code]);
            }
        })
        .then(()=>{
            res.status(200).redirect("/student/manage")
        })
        .catch((error)=>{
            console.log(error);
        })

    //console.log(req.body);
});


// function xyz(){
//       .then((result)=>{
//         result = result[0];
//         console.log(result)
//         for(i=0;i<result.length;i++){
//             console.log(result[i].sub_code);

//         }
//       })
// }
// xyz();
app.post("/staff/access/:staff_id",async(req, res)=>{
    console.log(req.params.staff_id); 

    let accesss = await pool.query("SELECT * from staff_access where staff_id = ?",[req.params.staff_id]);
    console.log(accesss);
    res.status(200).send(accesss[0]);


});
app.post("/staff/access/:staff_id/add/:class/:sub_code",(req, res)=>{
    console.log(req.params)
    pool.query("INSERT into staff_access(staff_id,sub_code,class_ID) values(?,?,?) ",[req.params.staff_id,req.params.sub_code,req.params.class])
        .then(()=>{
            console.log("then");
            res.status(200).send("Success")
        })
        .catch((err)=>{
            console.log("catch");
            res.status(500).send({error:err});
        })
});
app.post("/staff/access/:staff_id/del/:class/:sub_code",async(req, res)=>{
    console.log(req.params);
    await pool.query("DELETE FROM staff_access where staff_id = ? and sub_code = ? and class_ID = ? ",[req.params.staff_id,req.params.sub_code,req.params.class]);
});


app.get("/subject/manage/:branch",async(req,res)=>{
    if(req.cookies.staff){
        let is_hod = await pool.query("SELECT is_hod from staff where ID =?",[req.cookies.staff.ID]);
        
        is_hod = is_hod[0][0].is_hod;
        if(is_hod == 1) {
            let sub = await pool.query("SELECT sb.* from staff st, subjects sb, scheme sc where st.branch_ID = sc.branch_ID and sb.scheme_ID = sc.id and st.ID = ?",[req.cookies.staff.ID]);
            sub = sub[0];
            console.log(sub);
            let scheme_ids = await pool.query("SELECT id from scheme where branch_ID = ? ",[req.params.branch]);
            let sem_ids = await pool.query("SELECT id from sem");
            scheme_ids = scheme_ids[0];
            sem_ids = sem_ids[0];
            console.log(scheme_ids);
            console.log(sem_ids);
            res.render("mng-sub.ejs",{subs:sub,scheme_ids:scheme_ids,sem_ids:sem_ids});
        }
        else{
            res.status(400).send("Invalid request");
        }
    }
})

app.post("/subject/add",async(req,res)=>{
    if(req.cookies.staff){
        let is_hod = await pool.query("SELECT is_hod from staff where ID =?",[req.cookies.staff.ID]);
        
        is_hod = is_hod[0][0].is_hod;
        if(is_hod == 1) {
           console.log(req.body);
           let {name,scheme,subcode,credits,sem} = req.body;
            pool.query("INSERT INTO subjects values(?,?,?,?,?)",[subcode,scheme,name,credits,sem])
            .then(()=>{
                res.status(200).send("Success");
            })
            .catch(()=>{
                res.status(400).send("Something went wrong");
            })
        }
        else{
            res.status(400).send("Invalid request");
        }
    }
})
app.post("/subject/delete/:sub_code/:scheme_ID",async(req,res)=>{
    if(req.cookies.staff){
        let is_hod = await pool.query("SELECT is_hod from staff where ID =?",[req.cookies.staff.ID]);
        
        is_hod = is_hod[0][0].is_hod;
        if(is_hod == 1) {
           pool.query("DELETE FROM subjects where sub_code = ? and scheme_ID = ? ",[req.params.sub_code,req.params.scheme_ID])
            .then(()=>{
                res.status(200).send("Success");
            })
            .catch(()=>{
                res.status(400).send("Something went wrong");
            })
        }
        else{
            res.status(400).send("Invalid request");
        }
    }

    console.log(req.params);
})