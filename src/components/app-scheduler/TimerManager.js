import { useEffect, useState } from "react";
import "./timerStyles.css"
import { useApiRequest } from "../../context/APIProvider";

const TimerManager = () => {
    const getAllTimer = useApiRequest('getAllTimer')
    const [timerList, setTimerList] = useState(null)

    useEffect(() => {
        getAllTimer()
            .then(response => {
                console.log(response.data)
                setTimerList(response.data)
            })
            .catch(err => console.log(err))
    }, [])

    if (!timerList) { return }
    return (
        <div>
        TimerManager
        <div className="timerManager">
            {timerList.map((timer, id) => {
                return <Timer pTimer={timer} />
            })}
        </div>
        </div>
    )
};

const CreateTimer = () => {
    const [brief, setBrief] = useState("")
    const createTimer = useApiRequest('createTimer')

    const handleSubmitTimer = () => {
        const data = { brief }
        createTimer(data)
            .then(response => {
                setBrief("")
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div>
            <h1>create timer</h1>
            <textarea
                value={brief}
                onChange={ e => setBrief(e.target.value) }
            />
            <button onClick={handleSubmitTimer}>submit</button>
        </div>
    )
}

const Timer = ({ pTimer }) => {
    const [timer, setTimer] = useState(pTimer);

    const createInterval = useApiRequest('createInterval')

    const stopInterval = useApiRequest('stopInterval')

    useEffect(() => {
        setTimer(pTimer);
    }, [])

    const handleOnClick = () => {
        if (timer.active) {
            // console.log('stop')
            stopInterval([timer.active.id])
                .then(response => {
                    console.log(response)
                    setTimer(response.data)
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            createInterval([timer.id])
                .then(response => {
                    console.log(response)
                    setTimer(response.data)
                })
                .catch(err => {
                    console.log(err)
                })
            // console.log('start')
        }
    }
    return (
        <div className="timer" onClick={handleOnClick} timer-id={timer.id}>
            {timer.active ? <>⏳</> : <>⏰</>}
            {timer.brief}
        </div>
    )
}

export default TimerManager;
export { CreateTimer }