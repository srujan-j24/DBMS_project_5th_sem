const express = require("express");
const app = express();
const path = require("path");
const bodyparser = require("body-parser")
let port = "3000";

app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/image")));
<<<<<<< Updated upstream
app.use(bodyparser.urlencoded({extended : true}));
=======
app.use(bodyparser.urlencoded({extended : true}))
>>>>>>> Stashed changes

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
app.get("/staffdashboard",(req,res)=>{
    res.render("staffdashboard.ejs");
});
app.post("/login",(req,res)=>{
<<<<<<< Updated upstream
    //console.log(req.body)
    let username = req.body.username;
    let password = req.body.password;
    // console.log(username);
    // console.log(password);
    // console.log(req.body);
    if(username == "admin" && password  == "admin"){
        res.send("Successfull")
    }
    else{
        res.send("Failure")
    }

});
=======
   // console.log(req.body)
   let username = req.body.username;
   let password = req.body.password;
   //console.log(username);
   //console.log(password);
   //console.log(req.body);
   if(username == "admin"&& password == "admin"){
        res.send("Successful")
   }
   else{
    res.send("Failure")
   }
})
>>>>>>> Stashed changes
