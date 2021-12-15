const { response, query } = require("express")
const express = require("express")
const mysql = require("mysql")
const { ResetPassword } = require("./api/ResetPassword")
const { addTodo, ListTask, MarkTaskAsDone } = require("./api/todo")
const { TokenUser } = require("./api/Token")
const { register, login, Resend, ForgotPassword } = require("./api/user")
const { API_URL } = require("./config/api")
const { db } = require("./config/mysql")
const bodyParser = require('body-parser')
const cors = require('cors')

//create the connection
//Third, call the connect() method on the connection object to connect to the MySQL database server:
db.connect((err) => {
  if (err) throw err
  console.log("Mysql connected...")
})

const app = express()

const PORT = 9000;

app.listen(PORT, () => console.log('😛  Server started on port  :  ', PORT))


app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.use(express.json())
// User API
app.post(`${API_URL.user}/register`, register)

// User   login   API
app.get(`${API_URL.user}/login`, login)

// Todo API
app.get(`${API_URL.user}/:uuserid${API_URL.todo}/add`, addTodo)

// show all  todos
app.get(`${API_URL.user}/:uuserid${API_URL.todo}/todos/all`, ListTask)

// Mark task as done 
app.get(`${API_URL.user}/:uuserid${API_URL.todo}/todos/todoId`, MarkTaskAsDone)

// security API
app.get(`/${API_URL.auth}/verify/:userEmail/code/:emailToken`, TokenUser)

// Resend Email Verification
app.get(`/${API_URL.auth}/resend/:userEmail/resend-code/:emailToken`, Resend)

// forgot Password API
app.get(`${API_URL.user}/Forgot-Password/:userEmail`, ForgotPassword)

// Reset Password path 
app.get(`/${API_URL.auth}/Reset-Password/:userEmail/code/:emailToken`, ResetPassword)
