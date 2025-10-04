import { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";
import APIContext, { APIProvider } from "../../context/APIProvider";
import { handleError } from "../../context/APIProvider";
import useAuth from "../../hooks/useAuth";
import { publish, subscribe, unsubscribe } from "../../events/eventTools";

const DistractionManager = () => {
    const [distractionList, setDistractionList] = useState([])
    const {useRequest} = useContext(APIContext)
    const fetchDistraction = useRequest('fetchDistraction')
    const addNewDistraction = useRequest('addNewDistraction')
    const { auth } = useAuth()

    useEffect(() => {
        fetchDistraction(response => setDistractionList(response.data), err => console.log(err))
        // console.log('context',fetchDistraction)
    }, [auth])

    const handleDistractionCreated = (event) => {
        setDistractionList( list => [event.detail, ...list])
    }

    useEffect(() => {
        subscribe("newDistractionCreated", handleDistractionCreated)
        return () => { unsubscribe("newDistractionCreated", handleDistractionCreated)}
    }, [])

    return (
        <div>
            Distraction
            <AddNewDistraction pSubmit={addNewDistraction} />
            {distractionList.map(list => <div distraction-id={list.id} key={list.id}>{list.content}</div>)}
        </div>
    )
}

const AddNewDistraction = ({ pSubmit }) => {
    const [content, setContent] = useState('')
    const [threadList, setThreadList] = useState(null)
    const [thread, setThread] = useState(null)
    const { useRequest } = useContext(APIContext)
    const getAllThread = useRequest('getAllThread')

    useEffect(() => {
        getAllThread((response) => { setThreadList(response.data)}, handleError)
    }, [])

    const handleSubmit = () => {
        const data = {content}
        const handleSuccess = (response) => {
            publish("newDistractionCreated", response.data)
            setContent("")
        }
        const handleError = (err) => {
            console.log(err)
        }
        pSubmit(data, handleSuccess, handleError)
    }

    return (
        <div>
            {threadList ?
            <Select pOptionList={threadList} pHandleSelect={setThread}/> :
            <div>Loading threadlist</div>
            }
            <textarea
                value={content}
                onChange={ e => setContent(e.target.value) }
            />
            <button onClick={handleSubmit}>submit</button>
        </div>
    )
}

const Select = ({ pOptionList, pHandleSelect }) => {
    const [optionList, setOptionList] = useState(pOptionList)
    useEffect(() => {
        setOptionList(pOptionList)
    }, [pOptionList])
    return (
        <div>
            <label>Select </label>
            <select name="select" onChange={ e => pHandleSelect(e.target.value) }>
                {optionList.map((option, idx) => <option key={idx} value={option.id}>{option.name}</option>)}
            </select>
        </div>
    )
}

export default DistractionManager