import { useState, useEffect, useContext } from "react";
import APIContext from "../../context/APIProvider";

const EventManager = () => {
    const { useRequest } = useContext(APIContext)
    const getAllEvent = useRequest('getAllEvent')
    const [eventList, setEventList] = useState(null)

    useEffect(() => {
        getAllEvent((response) => setEventList(response.data), (err) => (console.log(err)))
    }, [])

    if (!eventList) { return }

    return (
        <div>
        {eventList.map((event, idx) => <EventView pEvent={event} />)}
        </div>
    )
}


const EventView = ({ pEvent }) => {
    return (
        <div key={pEvent.id}>
            {JSON.stringify(pEvent)}
        </div>
    )
}

export default EventManager