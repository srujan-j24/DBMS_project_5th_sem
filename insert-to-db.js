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


async function insertBatch(attributeAry){
    pool.query("insert into batch values (?)", [attributeAry])
        .then((res)=>console.log(`inserted batch ${attributeAry} succesfully`))
        .catch((err)=>console.log(err));
}

async function insertBranch(attributeAry){
    pool.query("insert into branch values (?)", [attributeAry])
        .then((res)=>console.log(res))
        .catch((err)=>console.log(err));
}




module.exports = {
    insertBatch,
    insertBranch,
}