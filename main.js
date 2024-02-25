const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const connection_json = require("./personal.json"); //alter this as per your mysql port and password


// const connection_pool = mysql.createPool(connection_json);
const connection_pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Sam@2003",
    database: "studentdb",
    port:3300
});

let sql_query = 'Show tables;';

connection_pool.query(sql_query, (err, res)=>{
    console.log(res);

});
    
// })





