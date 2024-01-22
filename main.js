const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");

const connection_pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "4922",
    database: "studentdb"  
});

let sql_query = 'Show tables;';

connection_pool.query(sql_query, (err, res)=>{
    console.log(res);
    connection_pool.end();
})





