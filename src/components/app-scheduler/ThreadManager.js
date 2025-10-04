import { useApiRequest } from "../../context/APIProvider"
import { useEffect, useRef, useState } from "react"
import EventManager, { EventList } from "./EventManager"

const ThreadManager = () => {
    const [threadList, setThreadList] = useState(null)
    const getAllThread = useApiRequest('getAllThread_')

    useEffect(() => {
        getAllThread()
            .then(response => setThreadList(response.data))
            .catch(err => console.log(err))
    }, [])

    if (!threadList) { return <>loading thread</>}
    return (
        <ThreadList pList={threadList} />
    )
}

const ThreadList = ({ pList }) => {

    const [threadList, setThreadList] = useState([])

    useEffect(() => {
        console.log(pList)
        const list = []
        const iterate = (pack, entry, depth) => {
            console.log(entry)
            pack.push({...entry, brief: `${'- '.repeat(depth)}${entry.brief}`})
            if (!entry.inferiors) {
                return
            } else {
                entry.inferiors.map(entry => iterate(pack, entry, depth+1))
            }
        }
        pList.map((entry) => iterate(list, entry, 0))
        console.log('list: ')
        console.log(list)
        setThreadList(list)
    }, [pList])

    return (
        <div>
        {console.log(`threadList`)}
    
        {console.log(threadList)}
        {threadList.map((thread) => (<Thread pThread={thread} />))}
        </div>
    )

}

const Thread = ({ pThread }) => {
    const [thread, setThread] = useState(pThread)
    const getAllEventOf = useApiRequest('getEventOfThread')
    const [eventList, setEventList] = useState([])

    useEffect(() => {
        setThread(pThread)
        getAllEventOf([thread.id])
            .then(response => {
                console.log(response.data)
                setEventList(response.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [pThread])

    return (
        <div>
        {thread.brief} 
        <HeatMap />
        {/* onClick 用overlay展示列表 */}
        {/* 展示latest */}
        {/* <EventList pList={eventList.slice(Math.max(eventList.length - 5, 1))} /> */}
        
        <hr />
        </div>
    )
}

const HeatMap = ({ pList }) => {
    const list = [1, 1, 1, 1, 1, 1, 1]

    return (
        <div>
            {list.map((entry, idx) => (<Day />))}
           
        </div>
    )
}

const Day = () => {
    const blockRef = useRef()
    useEffect(() => {
        blockRef.current.style.height = '10px'
        blockRef.current.style.width = '10px'
        blockRef.current.style.border = '1px solid black'
        blockRef.current.style.display = 'inline-block'
        blockRef.current.style.padding = '10px'
        blockRef.current.style.margin = '10px'

    })
    return (
        <div ref={blockRef} />
    )
}

export default ThreadManager;