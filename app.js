const express = require("express")
const mysql = require("mysql")
const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"todo"
})

//listen to the database qerry
db.connect((err,res)=>{
    if (err) throw err
    else console.log("mysql is runing...")
})

//insert new todo row
app.get("/todo-insert",(req,resp)=>{
    //new task
    let newTask = {title:"first task" , status:"INPROGRESS"}
    //Communiquer avec dataBase
    let sql = `
    INSERT INTO todoapp SET ?
    ` 
    db.query(sql,newTask,(err,resQ)=>{
        if (err) throw err
        else console.log(resQ)
        resp.send("Nudes ... ")
    })

})

app.listen('9000' , ()=>{
    console.log('Tchhh ... Tchhh ... server fil istima3 :) ')
})