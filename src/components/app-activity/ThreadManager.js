import { useState, useEffect, useRef, useLayoutEffect, useContext } from "react";
import Endpoint from "../../api/api";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./styleOfScheduler.css"
import { ActivityList } from "./ActivityManager";
import SchedulerOverlay from "./Overlay";
import { publish, subscribe } from "../../events/eventTools";
import ContainerHeightContext from "../../context/ContainerHeightProvider";

const ThreadManager = () => {

    const [threadList, setThreadList] = useState([])
    const axiosPrivate = useAxiosPrivate()

    const container = useRef()

    const getAllThread = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getAllThread())
            if (response.status === 200) {
                setThreadList(response.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const addNewThread = (event) => {
        publish("showShedulerOverlay", {type: "addThread", thread: null})
    }

    useEffect(() => {
        getAllThread()
    }, [])

    useLayoutEffect(() => {
        const height = window.innerHeight - 70
        container.current.style.height=`${height}px`
        container.current.style.overflowY="scroll"
    }, [])
    
    return (
        <div ref={container}>
        <SchedulerOverlay />
        <button onClick={addNewThread}>+ Thread</button>
        {threadList.map((thread) => {
            return <ThreadView pThread={thread} />
        })}
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
            {taskList.map((task) => <TaskView pTask={task} />)}
        </div>
    )
}

const TaskView = ({ pTask }) => {
    const [task, setTask] = useState(pTask)
    return (
        <div key={task.id} task-id={task.id}>
        {task.outline}
        </div>
    )
}

const ThreadView = ({ pThread }) => {
    const { containerHeight } = useContext(ContainerHeightContext)
    const threadContainer = useRef()
    const listContainerRef = useRef()
    const panelContainerRef = useRef()
    const [thread, setThread] = useState(pThread)
    const [taskList, setTaskList] = useState([])
    const [activityList, setActivityList] = useState([])
    const axiosPrivate = useAxiosPrivate()

    const getActivitiList = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getAllActivityOfThread(thread.id))
            if (response.status === 200) {
                setActivityList(response.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const getTaskList = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getAllTaskOfThread(thread.id))
            if (response.status === 200) {
                setTaskList(response.data)
                
            }
        } catch (err) {
            console.log(err)
        }
    }

    const getThoughtList = async () => {

    }

    useLayoutEffect(() => {
        const threadContainerHeight = containerHeight*0.2
        threadContainer.current.style.height = `${threadContainerHeight}px`
        const panelContainerHeight = panelContainerRef.current.scrollHeight
        panelContainerRef.current.style.height = `${panelContainerHeight}px`
        const listContainerHeight = threadContainerHeight - panelContainerHeight
        listContainerRef.current.style.height = `${listContainerHeight}px`
        listContainerRef.current.style.overflowY = 'scroll'
    }, [])

    
    useEffect(() => {
        subscribe(`updateThread-${thread.id}`, handleUpdate)
        getActivitiList()
        getTaskList()
        return () => subscribe(`updateThread-${thread.id}`, handleUpdate)
    }, [])

    const addNewActivity = (event) => {
        publish("showShedulerOverlay", {type: "addActivity", thread: thread})
    }

    const addNewTask = (event) => {
        publish("showShedulerOverlay", {type: "addTask", thread: thread})
    }

    const handleUpdate = (event) => {
        const detail = event.detail

        switch(detail.type) {
            case 'activity':
                setActivityList( list => ([detail.data, ...list]) )
        }
    }

    const handleActiviyOnClick = (activity) => {
        const data = {type: 'editActivity', thread, activity}
        publish('showShedulerOverlay', data)
    }

    const addNewThread = (event) => {
        publish("showShedulerOverlay", {type: "addThread", thread})
    }

    return (
        <div className="thread-container" key={thread.id} id={thread.id} ref={threadContainer}>
            <div ref={panelContainerRef}>
                {thread.name}
                <button onClick={addNewThread}>+ Thread</button>
                <span> -- </span>
                <button onClick={addNewTask}>+ Task</button>
                <span> -- </span>
                <button onClick={addNewActivity}>+ Activity</button>
                {/* <TaskList pTaskList={taskList} /> */}
            </div>
            <div ref={listContainerRef}>
                <ActivityList 
                    pActivityList={activityList} 
                    pOnEntityClick={handleActiviyOnClick}
                    />
                <TaskList pTaskList={taskList} />
                {thread.children.map((thread) => <ThreadView pThread={thread}/>)}
            </div>
        </div>
    )
}

export default ThreadManager;