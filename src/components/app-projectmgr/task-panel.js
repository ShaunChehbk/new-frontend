import { useEffect, useState } from "react";

const TaskPanel = (props) => {
    const [task, setTask] = useState(props.task);
    useEffect(() => {
        setTask(props.task);
    })
    return (
        <div className="task-panel">
            <div className="task-detail" id={task.id}>
            <button onClick={e => props.addCheckin({ "task": task.id, "title": task.title })}>+</button>
                {task.title}
                {task.checkins.length}
            </div>
        </div>
    )
}
export default TaskPanel;
