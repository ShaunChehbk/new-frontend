import { useState, useEffect, useRef } from "react";
import { handleError, useApiRequest } from "../../context/APIProvider";
import { publish, subscribe, unsubscribe } from "../../events/eventTools";
import { useFetcher } from "react-router-dom";
import { convertIdToDate } from "../../time-tool/time";

const EventManager = () => {
    const [eventList, setEventList] = useState(null)
    const getAllEvent = useApiRequest('SchedulerGetAllEvent') 

    const handleSuccess = (response) => {
        console.log('handle success')
        setEventList(response.data)
    }
    useEffect(() => {
        getAllEvent(handleSuccess, handleError)
    }, [])

    if (!eventList) { return <>loading event list</>}
    return (
        <>
        <EventList pList={eventList}/>
        <Overlay />
        </>
    )
}

const colorMap = {
    "action": "green",
    "activity": "gray",
    "thought": "white",
    "contact": "orange",
    "distraction": "#7E2811",
    "intention": "#EA3C53",
}

const EventList = ({ pList }) => {
    const [eventList, setEventList] = useState(null)
    const eventListRef = useRef(eventList)
    // const [eventList, setEventList] = useState([])



    const handleUpdateEvent = (e) => {
        console.log('handleUpdateEvent called')
        // setEventList(null)
        // getAllEvent(handleSuccess, handleError)
        // return 
        const event = e.detail
        console.log('update with event :')
        console.log(event)

        const nextList = eventListRef.current.map(entry => {
            if (entry.id === event.id) {
                return event
            } else {
                return entry
            }
        })
        setEventList(nextList)
        // setEventList(prev => prev.map(entry => {
        //     if (entry.id === event.id) {
        //         return event
        //     } else {
        //         return entry
        //     }
        // }))
    }
    useEffect(() => {
        setEventList(pList)
    }, [pList])
    useEffect(() => {
        eventListRef.current = eventList
    }, [eventList])

    useEffect(() => {
        subscribe('updateEvent', handleUpdateEvent)

        // return () => unsubscribe('updateEvent', handleUpdateEvent)
    }, [])

    // useEffect(() => {
    //     subscribe('updateEvent', handleUpdateEvent)

    //     return () => unsubscribe('updateEvent', handleUpdateEvent)
    // }, [eventList])

    if (!eventList) { return <>loading</> }

    return (
        <div id="event-list">
        {eventList.map((event) => <Event pEvent={event} />)}
        </div>
    )
}

const Overlay = () => {
    const [event, setEvent] = useState()
    const [shouldShowOverlay, setShouldShowOverlay] = useState(false)
    const getAllThread = useApiRequest('getAllThread_')
    const setThreadForEvent = useApiRequest('setThreadForEvent')
    const [threadList, setThreadList] = useState(null)
    const handleShowEventDetail = (e) => {
        setEvent(e.detail)
        setShouldShowOverlay(true)
    }
    const handleCloseEventDetail = (event) => {
        setShouldShowOverlay(false)
    }
    const handleKeydown = (e) => {
        if (e.code === 'Escape') { setShouldShowOverlay(false) }
    }

    useEffect(() => {
        subscribe('keydown', handleKeydown)
        subscribe('showEventDetail', handleShowEventDetail)
        getAllThread()
            .then(response => {
                console.log(response)
                setThreadList(response.data)
            })
            .catch(err => console.log(err))
    }, [])

    const handleThreadChange = (threadId) => {
        console.log('threadId:')
        console.log(threadId)
        setThreadForEvent([threadId, event.id])
            .then(response => {
                publish('updateEvent', response.data)
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })
    }

    if (!shouldShowOverlay) { return }
    return (
        <div className="overlay-container">
            <div className="overlay-content">
                <button onClick={handleCloseEventDetail}>close</button>
                {/* {new Date(event.id).toLocaleTimeString()} */}
                {convertIdToDate(event.id)}
                <br/>

                <Select pDefault={event.thread?.id} pList={threadList} pHandleSelect={handleThreadChange}/>
                <textarea value={event.brief}/>
                <textarea value={event.description}/>
            </div>
        </div>
    )
}

const Event = ({ pEvent }) => {
    const [event, setEvent] = useState(pEvent)
    const [timestamp, setTimeStamp] = useState()

    const handleOnClick = (e) => {
        console.log(event)
        publish('showEventDetail', event)
    }

    // console.log(pEvent)
    // if (event.id === 1742298910) {
    //     console.log('check event')
    //     console.log(event)
    //     console.log('check pEvent')
    //     console.log(pEvent)
    // }

    useEffect(() => {
        // setEvent(event)
        setEvent(pEvent)
    }, [pEvent])

    return (
        <div style={{whiteSpace: "nowrap", overflowX: "scroll"}}key={event.id} event-id={event.id} onClick={handleOnClick}>
        <span>
            {event.thread?.brief}
        </span>
        <a style={{background: colorMap[event.type]}}>
        {/* {new Date().toLocaleTimeString()} -  */}
        -
        {event.type}
        </a>
         - 
        {event.todo === 0 ? <></> : <span style={{background: "#D5B85A"}}>TODO </span>} 
        <span>
        {event.brief}
        </span>

        </div>
    )
}

/// MARK: select

const Select = ({ pDefault, pList, pHandleSelect }) => {
    const [selected, setSelected] = useState(pDefault)
    const [list, setList] = useState(pList);

    const [flatList, setFlatList] = useState([])
    useEffect(() => {
        const flatList = []
        pList.map((entry) => iterate(flatList, entry, 0))
        console.log(flatList)
        // setList(list)
        setList(flatList)
    }, [pList])

    const iterate = (pack, entry, depth) => {
        console.log(entry)
        pack.push({...entry, brief: `${'- '.repeat(depth)}${entry.brief}`})
        if (!entry.inferiors) {
            return
        } else {
            entry.inferiors.map(entry => iterate(pack, entry, depth+1))
        }
    }

    useEffect(() => {
        setSelected(pDefault)

    }, [pDefault])
    return (
    <div>
        <label>Thread:</label>
        <select name="selectTime" onChange={ e => pHandleSelect(e.target.value) }>
            {/* <option value={0}>—— No Thread ——</option> */}
            {list.map((entry, idx) => <option {...(selected == entry.id && {selected: "selected"})} value={entry.id}>{entry.brief}</option>)}
        </select>
    </div>
    )
};

export default EventManager;
export { EventList, Select }