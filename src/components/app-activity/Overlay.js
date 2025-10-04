import { useState, useEffect } from "react";
import { publish, subscribe, unsubscribe } from "../../events/eventTools";
import { AddNewActivity, SetIsAction } from "./ActivityManager";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";

const SchedulerOverlay = () => {
    const [shouldAppear, setShouldAppear] = useState(false)

    const [formDetail, setFormDetail] = useState()

    const handleShowOverlay = (event) => {
        setShouldAppear(true)
        setFormDetail(event.detail)
    }

    const showForm = () => {
        if (!formDetail) { return }
        switch (formDetail.type) {
            case 'addActivity':
                return <AddActivityManager pThread={formDetail.thread}/>
            case 'editActivity':
                return <EditActivity pActivity={formDetail.activity} pThread={formDetail.thread}/>
            case 'addTask':
                return <AddTaskManager pThread={formDetail.thread} />
            case 'addThread':
                return <AddThread pThread={formDetail.thread} />
        }
    }

    const handleCloseOverlay = (event) => {
        setShouldAppear(false)
    }
    useEffect(() => {
        subscribe("showShedulerOverlay", handleShowOverlay)
        subscribe("closeShedulerOverlay", handleCloseOverlay)
        

        return () => {
            unsubscribe("closeShedulerOverlay", handleShowOverlay)
            unsubscribe("showShedulerOverlay", handleCloseOverlay)
        }
    }, [])
    if (!shouldAppear) { return }
    return (
    <div className="overlay-container">
        <div className="overlay-body">
            <button onClick={(e) => publish("closeShedulerOverlay")}>close</button>
            {showForm()}
        </div>
    </div>
    )
}

const SelectTask = ({ pThread, pHandleSelection }) => {
    const [taskList, setTaskList] = useState(null)
    const [threadId, setThreadId] = useState(pThread.id)
    const [taskId, setTaskId] = useState(null)
    const axiosPrivate = useAxiosPrivate()

    const getAllTask = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getAllTaskOfThread(threadId))
            if (response.status === 200) {
                setTaskList(response.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getAllTask()
    }, [])

    useEffect(() => {
        setThreadId(pThread.id)
    }, [pThread])

    if (taskList === null) { return }

    return (
        <div>
            <label>Task:</label>
                <select name="selectTask" defaultValue={0} onChange={ e => pHandleSelection(e.target.value) }>
                    <option value={0}>—— No Task ——</option>
                    {taskList.map((task, idx) => <option value={task.id}>{task.outline}</option>)}
                </select>
        </div>
    )
}

const AddActivityManager = ({ pThread }) => {

    const [thread, setThread] = useState(pThread)
    const [taskId, setTaskId] = useState(0)

    useEffect(() => {
        setThread(pThread)
    }, [pThread])

    /*
    如果是任务，则选择 'progress', 'close'
    如果是haibt，则可以不填写 内容
    */

    const axiosPrivate = useAxiosPrivate()

    const handleSubmit = async (data) => {
        try {
            const endpoint = taskId === 0 ? Endpoint.addActivityFor(thread.id) : Endpoint.addActivityForTask(taskId)
            const response = await axiosPrivate.post(endpoint, data)
            if (response.status === 201) {
                const data = response.data
                publish(`updateThread-${thread.id}`, {type: 'activity', data: data})
                return true
            }

        } catch (err) {
            console.log(err)
            return false
        }
    }
    return (
        <div>
            Add Activity for {thread.name}
            <SelectTask pThread={thread} pHandleSelection={setTaskId} />
            <AddNewActivity pSubmit={handleSubmit}/>
        </div>
    )
}

const EditActivity = ({ pActivity, pThread }) => {
    const [activity, setActivity] = useState(pActivity)
    const [threadList, setThreadList] = useState([])
    const [threadId, setThreadId] = useState(pThread.id)
    
    // getThread().then(<function>)

    const axiosPrivate = useAxiosPrivate()

    const getAllThread = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getAllThread())
            setThreadList(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async (data) => {
        try {
            const response = await axiosPrivate.post(Endpoint.updateActivity(activity.id), {thread: threadId})
            if (response.status === 200) {
                publish("closeShedulerOverlay")
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getAllThread()
        setActivity(pActivity)
    }, [pActivity])

    return (
        <div>
            Edit {activity.resume}
            {threadList.length === 0
            ? <div>getting threadlist</div>
            :
            <div>
                <label>Thread:</label>
                <select name="selectTime" defaultValue={threadId} onChange={ e => setThreadId(e.target.value) }>
                    {/* <option value={0}>—— No Thread ——</option> */}
                    {threadList.map((thread, idx) => <option value={thread.id}>{thread.name}</option>)}
                </select>
                {/* 
                如果这个下面放一个<SelectTask />，就要做到：选择的Thread更新，同时更新<SelectTask />中的Thread
                 */}
            </div>
            }
            <SetIsAction pActivity={activity} />
            <button onClick={handleSubmit}>submit</button>
        </div>
    )
}

const AddTaskManager = ({ pThread }) => {
    const [threadId, setThreadId] = useState(pThread.id)
    const [outline, setOutline] = useState("")
    const axiosPriate = useAxiosPrivate()

    useEffect(() => {
        setThreadId(pThread.id)
    }, [pThread])

    const handleSubmit = async () => {
        try {
            const response = await axiosPriate.post(Endpoint.addTaskForThread(threadId), {outline})
            if (response.status === 201) {
                publish("closeShedulerOverlay")
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <label>outline</label>
            <textarea
                value={outline}
                onChange={ e => setOutline(e.target.value)}
            />
            <button onClick={handleSubmit}>submit</button>
        </div>
    )
}

const AddThread = ({ pThread }) => {
    const [thread, setThread] = useState(pThread)
    const [name, setName] = useState("")
    const axiosPriate = useAxiosPrivate()

    useEffect(() => {
        setThread(pThread)
    }, [pThread])

    const handleSubmit = async () => {
        const endpoint = thread ? Endpoint.addThreadFor(thread.id) : Endpoint.addThreadFor()
        try {
            const response = await axiosPriate.post(endpoint, {name})
            if (response.status === 201) {
                publish("closeShedulerOverlay")
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <textarea
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <button onClick={handleSubmit}>submit</button>
        </div>
    )
}

export default SchedulerOverlay