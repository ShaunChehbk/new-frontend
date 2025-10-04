import { useState, useEffect } from "react"
import { Create } from "./CreateComps"
import Fast from "./Fast"
import { useApiRequest } from "../../context/APIProvider"
import { Select } from "./EventManager"
import { CreateTimer } from "./TimerManager"

const SchedulerManager = () => {
    const [type, setType] = useState(null)

    return (
        <>
        <Fast />
        <div onClick={ e => setType('createIntention')}>Intention</div>
        <div onClick={ e => setType('createDistraction')}>Distraction</div>
        <div onClick={ e => setType('createAction')}>Action</div>
        <div onClick={ e => setType('createActivity')}>Activity</div>
        <div onClick={ e => setType('createNote')}>Note</div>
        <div onClick={ e => setType('createContact')}>Contact</div>
        <div onClick={ e => setType('createThought')}>Thought</div>
        {
        type
        ? <Create pName={type} />
        : <></>
        }
        <CreateThread />
        <CreateTimer />
        </>
    )
}

const CreateThread = () => {
    const createRequest = useApiRequest('createThread');
    const getAllThread = useApiRequest('getAllThread_');

    const [threadList, setThreadList] = useState([])
    const [brief, setBrief] = useState("");
    const [superior, setSuperior] = useState(null)
    const description = ""
    const handleSubmit = () => {
        console.log(superior)
        const data = { brief, description, superior }
        createRequest(data)
            .then(response => setBrief(""))
            .catch(err => console.log(err))
        console.log(data)
    }
    const handleThreadSelect = (threadId) => {
        console.log(threadId)
        setSuperior(threadId)
    }

    useEffect(() => {
        getAllThread()
            .then(response => {
                console.log(response.data)
                setThreadList(response.data)
            })
    }, [])
    return (
        <div>
            <h2>CreateThread</h2>
            <textarea
                value={brief}
                onChange={ e => setBrief(e.target.value)}
            />
            <Select pDefault={0} pList={threadList} pHandleSelect={handleThreadSelect} />
            <button onClick={handleSubmit}>submit</button>
        </div>
    )

}

export default SchedulerManager