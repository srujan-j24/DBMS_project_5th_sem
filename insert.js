import { fakerEN_IN as faker } from "@faker-js/faker";
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();




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


function getRandomIndex(ary_length){
        return Math.floor(Math.random() * ary_length);    
}

function numtostr(number,length) {
    const num=number;
    const formattedNumber = num.toString().padStart(length, '0');
}

async function getbatchID(batch){
    let res = await  pool.query(`SELECT total_students FROM batch WHERE batch.year = ${batch};`);
    console.log(res);
}

function getRandomStudent(batch){
    if(!Number.isInteger(batch)){
        console.log("Enter a valid batch number");
        return;
    }
    let name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    let college_id = `${batch}${getbatchID(batch)}`;
}

getbatchID(2021);


async function init_newBatch(year){
    if(!Number.isInteger()){
        console.error(`${year} is not a valid year`);
        return;
    }
    let res = await pool.query('')
}