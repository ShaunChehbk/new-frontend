import { useContext, useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";
import { publish, unsubscribe, subscribe } from "../../events/eventTools";
import SelecThread from "./CreateManager";
import APIContext, { handleError } from "../../context/APIProvider";

// http://114.132.88.206:8000/TaskManager/createActivity/

const convertIdToDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    // return [year, month, day]
    return `${year} - ${month} - ${day}`
}

const ActivityManager = () => {
    const [activityList, setActivityList] = useState(null)
    const axiosPrivate = useAxiosPrivate()

    const getActivityList = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getAllActivity())
            console.log(response)
            if (response.status === 200) {
                setActivityList(response.data.reverse())
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        subscribe("newActivityCreated", (event) => {
            setActivityList( activityList => ([event.detail, ...activityList]))
        })
        getActivityList()
        return unsubscribe("newActivityCreated")
    }, [])

    console.log(activityList)

    // const submitNewActivity = () => {
    //     return async (endpoint, data) => {
    //         try {
    //             const response = await axiosPrivate.post(endpoint, data)
    //             if (response.status === 201) {
    //                 const data = response.data
    //                 publish("newActivityCreated", data)
    //                 return true
    //             }
    
    //         } catch (err) {
    //             console.log(err)
    //             return false
    //         }
    //     }
    // }


    const submitNewActivity = async (data) => {
        try {
            // 默认添加到 -- No Thead --
            const response = await axiosPrivate.post(Endpoint.addActivityFor(0), data)
            if (response.status === 201) {
                const data = response.data
                publish("newActivityCreated", data)
                return true
            }

        } catch (err) {
            console.log(err)
            return false
        }
    }

    return (
        <>
        <div>
        <AddNewActivity pSubmit={submitNewActivity}/>
        </div>
        <div>
        {activityList == null
        ? <>getting activity list</>
        : <ActivityList pActivityList={activityList} />
        }
        </div>
        </>
    )
}

const AddNewActivity = ({ pSubmit }) => {
    const [newActivityResume, setNewActivityResume] = useState("")
    const [newActivityDescription, setNewActivityDescription] = useState("")
    // const [timelineId, setTimelineId] = useState(0)
    // const axiosPrivate = useAxiosPrivate()

    const handleNewActivityResume = (event) => {
        event.preventDefault()
        setNewActivityResume(event.target.value)
    }

    const handleNewActivityDescription = (event) => {
        event.preventDefault()
        setNewActivityDescription(event.target.value)
    }

    const submitNewActivity = async (event) => {
        event.preventDefault()
        const data = {resume: newActivityResume, description: newActivityDescription}
        const response = await pSubmit(data)
        if (response === true) {
            setNewActivityDescription("")
            setNewActivityResume("")
        }
    }

    

    return (
        <div>
            {/* <SelecThread pOnSelectThread={setTimelineId}/> */}
            <textarea 
                value={newActivityResume}
                onChange={handleNewActivityResume}
            />
            <textarea
                value={newActivityDescription}
                onChange={handleNewActivityDescription}
            />
            <button onClick={submitNewActivity}>submit</button>
        </div>
    )
}

const ActivityList = ({ pActivityList, pOnEntityClick }) => {
    const [activityList, setActivityList] = useState(pActivityList)

    useEffect(() => {
        setActivityList(pActivityList)
    }, [pActivityList])

    return (
        <>
        {activityList.map((activity, idx) => {
            return (
                <div key={idx} id={activity.id}>
                    <a onClick={ e => pOnEntityClick(activity)}>Edit</a> - {convertIdToDate(activity.id)} - {activity.isAction ? <a style={{background: "red"}}>action</a> : ''} - {activity.resume}
                </div>
            )
        })}
        </>
    )
}

const AddNewActivityForThread = ({ pThreadId }) => {
    const [newActivityResume, setNewActivityResume] = useState("")
    const [newActivityDescription, setNewActivityDescription] = useState("")
    const [timelineId, setTimelineId] = useState(0)
    const axiosPrivate = useAxiosPrivate()

    const handleNewActivityResume = (event) => {
        event.preventDefault()
        setNewActivityResume(event.target.value)
    }

    const handleNewActivityDescription = (event) => {
        event.preventDefault()
        setNewActivityDescription(event.target.value)
    }

    const submitNewActivity = async (event) => {
        event.preventDefault()
        const data = {resume: newActivityResume, description: newActivityDescription}
        try {
            const response = await axiosPrivate.post(Endpoint.addActivityFor(timelineId), data)
            if (response.status === 201) {
                setNewActivityDescription("")
                setNewActivityResume("")
                const data = response.data
                publish("newActivityCreated", data)
            }

        } catch (err) {
            console.log(err)
        }
    }

    

    return (
        <div>
            <textarea 
                value={newActivityResume}
                onChange={handleNewActivityResume}
            />
            <textarea
                value={newActivityDescription}
                onChange={handleNewActivityDescription}
            />
            <button onClick={submitNewActivity}>submit</button>
        </div>
    )
}

const SetIsAction = ({ pActivity }) => {
    const { useRequest } = useContext(APIContext)
    const [activity, setActivity] = useState(pActivity)
    const setIsActionOfActivity = useRequest('setIsActionOfActivity')

    console.log(activity)

    useEffect(() => {
        setActivity(pActivity)
    }, [pActivity])

    const handleSuccess = (response) => {
        setActivity(response.data)
    }

    const handleCheckedChange = (e) => {
        setIsActionOfActivity([activity.id, e.target.checked], {}, handleSuccess, handleError)
    }

    
    return (
        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <label>
                isAction :
            </label>
            <input style={{width:"25px", height:"25px"}} type="checkbox" checked={activity.isAction} onChange={handleCheckedChange}/>
        </div>
    )
}

export default ActivityManager
export { ActivityList, AddNewActivity, SetIsAction }