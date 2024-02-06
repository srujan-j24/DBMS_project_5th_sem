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






function getRandomIndex(ary_length){
    return Math.floor(Math.random() * ary_length);    
}

function padbatchID(number,length) {
    const num = number;
    const formattedNumber = num.toString().padStart(length, '0');
    return formattedNumber;
}
// numtostr(44, 3);

async function getbatchID(batch){
    let res = await  pool.query(`SELECT count(*) as total_students from student where batch_ID = ?;`, [batch]);
    res = res[0][0].total_students;
    return padbatchID(res+1, 4);
}

async function getRandomStudent(batch){
    if(!Number.isInteger(batch)){
        console.error("Enter a valid batch number");
        return;
    }

    let name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    let college_id = `${batch}${await getbatchID(batch)}`;
    let batch_id = batch;
    let password = faker.internet.password();
    return [name, college_id, batch_id, password];
}

async function insertStudent(student_ary){
    console.log(student_ary);
    let res = await pool.query(`INSERT INTO STUDENT(Name, College_ID, batch_ID, password) VALUES (?);`, [student_ary]);
    console.log(res);
}


async function init_newBatch(year){
    if(!Number.isInteger(year)){
        console.error(`${year} is not a valid year`);
        return;
    }
    let res = await pool.query('INSERT INTO batch(year) VALUES (?)', [year]);
    console.log(res);
}
// for(let i = 0; i < 4; i++){
//  await insertStudent(await getRandomStudent(2021));
// }


init_newBatch(2022);
