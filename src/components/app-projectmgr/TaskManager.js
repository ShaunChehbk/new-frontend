import { useState, useEffect } from "react";
import SelecThread from "../app-activity/CreateManager";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";
import { publish, subscribe, unsubscribe } from "../../events/eventTools";

const TaskManager = () => {

    const [taskList, setTaskList] = useState([])

    const axiosPrivate = useAxiosPrivate()

    const handleNewTaskCreated = (event) => {
        console.log("newTaskCreated")
        setTaskList( taskList => ([event.detail, ...taskList]))
    }

    const getAllTask = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getAllTask())
            if (response.status === 200) {
                setTaskList(response.data.reverse())
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        subscribe("newTaskCreated", handleNewTaskCreated)
        getAllTask()
        // return unsubscribe("newTaskCreated", handleNewTaskCreated)
        return () => unsubscribe("newTaskCreated", handleNewTaskCreated)
    }, [])

    return (
        <div>
            <CreateTask />
            <TaskList pTaskList={taskList} />
        </div>
    )
}

const CreateTask = () => {
    const [taskOutline, setTaskOutline] = useState("")
    const [taskDescription, setTaskDescription] = useState("")
    const [threadId, setThreadId] = useState(0)
    const axiosPrivate = useAxiosPrivate()

    const submitNewTask = async () => {
        const data = {outline: taskOutline, description: taskDescription}
        try {
            const response = await axiosPrivate.post(Endpoint.createTask(threadId), data)

            console.log(response.status)

            if (response.status === 201) {
                publish("newTaskCreated", response.data)
            }

        } catch (err) {
            console.log(err)
        }
    }

    const handleOutlineBoxChange = (e) => {
        e.preventDefault()
        setTaskOutline(e.target.value)
    }
    
    const handleDescriptionBoxChange = (e) => {
        e.preventDefault()
        setTaskDescription(e.target.value)
    }

    return (
        <div>
            <SelecThread pOnSelectThread={setThreadId}/>
            <textarea
                value={taskOutline}
                onChange={handleOutlineBoxChange}
            />
            <textarea
                value={taskDescription}
                onChange={handleDescriptionBoxChange}
            />
            <button onClick={submitNewTask}>submit</button>
        </div>
    )
}

const TaskView = ({ pTask }) => {
    const [task, setTask] = useState(pTask)
    return (
        <div>
            {task.outline}
        </div>
    )
}

const TaskList = ({ pTaskList }) => {
    const [taskList, setTaskList] = useState(pTaskList)

    useEffect(() => {
        setTaskList(pTaskList)
    }, [pTaskList])
    
    return (
        <div>
            {taskList.map((task, idx) => <TaskView pTask={task} />)}
        </div>
    )
}


export default TaskManager

export { SelecThread }