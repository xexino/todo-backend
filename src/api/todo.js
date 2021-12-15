const { db } = require("../config/mysql")
const { Todo } = require("../model/todo")


exports.addTodo = (req, resp) => {
    let newTodo = new Todo(
        "Task 8888",
        req.params.uuserid
    )

    let query = ` INSERT INTO TODOS SET ?`
    db.query(query, newTodo, (err, resQ) => {
        if (err) throw err
        else {
            console.log(resQ)
            resp.send("<h1 style = 'color : red;'>this is your new task :</h1>" + newTodo.title)
        }
    })
}

exports.ListTask = (req, resp) => {

    //querry all Todos By userID
    db.query(` SELECT * FROM  TODOS WHERE uuserid='${req.params.userEmail}' `, (err, resQ) => {
        if (err) throw err
        else {
            resp.send("all todos")
        }
    })

}

exports.MarkTaskAsDone = (req, resp) => {

    let newstatus = 'COMPLETED'

    var statusPattern = /['COMPLETED', 'INPROGRESS', 'CANCELED', 'TODO']/

    if (!statusPattern.test(newstatus)) {
        resp.send(" <h1 style =' color : blue' > ERROR STATUS NOT FOUND </h1>")
        return
    }

    db.query(` UPDATE TODOS SET  STATUS = '${newstatus}'
               WHERE  uuserid='${req.params.userEmail}' , id='${req.params.todoId}' `, (err, resQ) => {
        if (err) throw err
        else {
            resp.send("updated succesfully")
        }

    })

}






