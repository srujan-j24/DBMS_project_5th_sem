const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const connection_json = require("./personal.json"); //alter this as per your mysql port and password


const connection_pool = mysql.createPool(connection_json);

let sql_query = 'Show tables;';

connection_pool.query(sql_query, (err, res)=>{
    console.log(res);

});





