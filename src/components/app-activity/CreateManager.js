import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";

const CreateManager = () => {

}

const SelecThread = ({ pOnSelectThread }) => {
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
            <select name="selectTime" onChange={ e => pOnSelectThread(e.target.value) }>
                {/* <option value={0}>—— No Thread ——</option> */}
                {timelineList.map((timeline, idx) => <option value={timeline.id}>{timeline.name}</option>)}
            </select>
        </div>
    )
}

export default SelecThread