import { useEffect, useState } from "react";
import TaskPanel from "./task-panel";
const TaskMgr = (props) => {
    const [tasks, setTasks] = useState(props.tasks)
    useEffect(() => {
        setTasks(props.tasks)
    }, [props])
    return (
        <div className="taskmgr-container">
            <div className="banner">
                <div className="banner-right">
                    <b>Tasks</b>
                </div>
                <div className="banner-left">
                    <button
                        onClick={e => props.addTask()}
                    >Add</button>
                </div>
            </div>
            {tasks.map((task, pos) => {
                return (
                <TaskPanel 
                    addCheckin={props.addCheckin} 
                    task={task} 
                />
                )
            })}
        </div>
    )
}

export default TaskMgr;