process.stdin.setEncoding("utf8");

console.log("helll");

process.stdin.on("readable", ()=>{
    let c = process.stdin.read();
    console.log(c);
});


const pool = mysql.createPool({
    host: process.env.HOSTNAME,
    port: process.env.PORTNUM,       
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,    
    database: process.env.DBNAME
});

pool.query("select * from student;")
.then((res)=>{
    console.log(res);
});
