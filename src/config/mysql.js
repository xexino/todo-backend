// First, import the mysql module by using the following statement:
const mysql = require("mysql")

//Second, create a connection to the MySQL database 
// by calling the createConnection() method and providing the detailed 
// information on MySQL server such as host, user, password and database as follows:

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todo'
})

exports.db = db