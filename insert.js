// import { faker } from "@faker-js/faker";
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();



console.log(process.env.PORTNUM)
const pool = mysql.createPool({
    host: process.env.HOSTNAME,
    port: process.env.PORTNUM,       
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,    
    database: process.env.DBNAME
}).promise();



async function  execute_query(){
    const res = await pool.query("SELECT * from student");
    console.log(res);
}

execute_query();