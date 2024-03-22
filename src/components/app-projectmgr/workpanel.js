import { useEffect, useState } from "react";

const WorkPanel = (props) => {
    const [work, setWork] = useState(props.work)
    const [displayCount, setDisplayCount] = useState(14);

    useEffect(() => {
        setWork(props.work)
    }, [props])

    const idToDate = (id) => {
        const timezoneOffset = 480 * 60
        var date = new Date((id + timezoneOffset) * 1000);
        // date.setTimezoneOffset(-8 * 60);
        // date.getTimezoneOffset(
        // console.log(date.toUTCString())
    }

    work.checkins.map((checkin, pos) => {
        // console.log(checkin.title)
        idToDate(checkin.id)
    })

    const addCheckin = (e) => {
        props.addCheckin()
        props.setNewCheckin({"work": work.id, "title": ""})
    }

    return (
        <div className="work-container">
            <div 
            className="work-title"
            onClick={e => props.addCheckin({"work": work.id, "title": work.title})}>
                {work.title}
                {work.checkins.length}
            </div>
        </div>
    )
}

export default WorkPanel;