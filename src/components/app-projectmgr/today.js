import { useEffect, useState } from "react";
const Today = (props) => {
    const [checkins, setCheckins] = useState(props.checkins)
    useEffect(() => {
        setCheckins(props.checkins)
    }, [props])
    return (
        <div className="today-container">
            <div className="banner">
                <div className="banner-right">
                    <b>
                        Today
                    </b>
                </div>
                <div className="banner-left">
                    <button onClick={e => props.addCheckin()}>Add</button>
                </div>
            </div>
            <div className="today-checkin-container">
                {checkins.map((checkin, pos) => {
                    return (
                        <div id={checkin.id}>{checkin.title}</div>
                    )
                })}
            </div>
        </div>
    )
}
export default Today;