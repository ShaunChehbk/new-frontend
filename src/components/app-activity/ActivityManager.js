import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";
import { publish, unsubscribe, subscribe } from "../../events/eventTools";

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

    return (
        <>
        <div>
        <AddNewActivity />
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

const AddNewActivity = () => {
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
            <SelectTimeline pOnSelectTimeline={setTimelineId}/>
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

const ActivityList = ({ pActivityList }) => {
    const [activityList, setActivityList] = useState(pActivityList)

    useEffect(() => {
        setActivityList(pActivityList)
    }, [pActivityList])

    return (
        <>
        {activityList.map((activity, idx) => {
            return (
                <div key={idx}>{convertIdToDate(activity.id)} - {activity.resume}</div>
            )
        })}
        </>
    )
}

const SelectTimeline = ({ pOnSelectTimeline }) => {
    const axiosPrivate = useAxiosPrivate()
    const [timelineList, setTimelineList] = useState([])
    // const [timelineId, setTimelineId] = useState(0)

    const getAllTimeline = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getAllThread())
            setTimelineList(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleSelectChange = (event) => {
        event.preventDefault()
        console.log(event.target.value)
    }

    useEffect(() => {
        getAllTimeline()
    }, [])

    return (
        <div>
            <label>Thread:</label>
            <select name="selectTime" onChange={ e => pOnSelectTimeline(e.target.value) }>
                <option value={0}>—— No Thread ——</option>
                {timelineList.map((timeline, idx) => <option value={timeline.id}>{timeline.name}</option>)}
            </select>
        </div>
    )
}

export default ActivityManager