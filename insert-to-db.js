const {fakerEN_IN: faker } = require("@faker-js/faker");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv").config();


const pool = mysql.createPool({
    host: process.env.HOSTNAME,
    port: process.env.PORTNUM,       
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,    
    database: process.env.DBNAME
});


async function insertBatch(year){
    let attributeValAry = [year];
    pool.query("insert into batch values (?)", [attributeValAry])
        .then((res)=>console.log(`inserted batch ${attributeValAry} succesfully`))
        .catch((err)=>console.log(err));
}

async function insertBranch(id, name){
    let attributeValAry = [id, name];
    pool.query("insert into branch values (?)", [attributeValAry])
        .then((res)=>console.log(res))
        .catch((err)=>console.log(err));
}

async function insertClass(sem, section, branch){
    //requirements are valid branch
    let id = `${branch}_${sem}_${section}`;
    let attributeValAry = [id, sem, section, branch]
    pool.query("insert into class values (?)", [attributeValAry]);
};

async function insertScheme(year, branch, semsjson = ["{}","{}","{}","{}","{}","{}","{}","{}"]){
    attributeValAry = [year, branch, semsjson[0],semsjson[1],semsjson[2],semsjson[3],semsjson[4],semsjson[5],semsjson[6],semsjson[7]];
    pool.query("insert into scheme values (?)", [attributeValAry])
        .then((res)=>{console.log(res)})
        .catch((err)=>{console.log(err)});
}

async function insertStudent(batch, usn = null){
    let count = await pool.query("select count(*) as count from student where batch_ID = ?", [batch])
        .then((res)=> res[0][0].count );
    
}

// insertScheme(2021, 'ISE');
insertStudent(2021);

module.exports = {
    insertBatch,
    insertBranch,
    insertClass,
    insertScheme
}