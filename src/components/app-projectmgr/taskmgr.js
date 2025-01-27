import { useEffect, useState } from "react";
import TaskPanel from "./task-panel";
const TaskMgr = (props) => {
    const [tasks, setTasks] = useState(props.tasks)
    useEffect(() => {
        setTasks(props.tasks)
    }, [props])
    console.log(props.height)
    return (
        <div className="taskmgr-container" style={{height: props.height}}>
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
            <div className="tasks-container">
            {tasks.map((task, pos) => {
                return (
                <TaskPanel 
                    addCheckin={props.addCheckin} 
                    task={task} 
                />
                )
            })}
            </div>
        </div>
    )
}

export default TaskMgr;