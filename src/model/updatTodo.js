const { TaskStatusEnum } = require("../data/TaskStatus");
const { TaskTypeEnum } = require("../data/TaskType");

class UpdateTodo {
    constructor(title ="" , uuserid = 0 , status= TaskStatusEnum.TODO.toString() ,type = TaskTypeEnum.BACK.toString() , id= null){
        
        this.title = title
        this.uuserid = uuserid
        this.status = status
        this.type = type
        this.id = id

    }
}
exports.UpdateTodo = UpdateTodo