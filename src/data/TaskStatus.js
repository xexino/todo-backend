const TaskStatusEnum = Object.freeze({
    TODO: Symbol("todo"),
    INPROGRESS: Symbol("inprogress"),
    COMPLETED: Symbol("completed"),
    CANCELED: Symbol("canceled")
});

exports.TaskStatusEnum = TaskStatusEnum