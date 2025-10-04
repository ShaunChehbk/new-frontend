import { useContext, useState, useEffect, useRef } from "react";
import { useApiRequest } from "../../context/APIProvider";
import { handleError } from "../../context/APIProvider";
import "./styles.css"

const test = require('./moduleTest')
const Create = ({ pName }) => {
    const request = useApiRequest(pName)
    const timeHintRef = useRef()
    const [time, setTime] = useState({})
    const [timeString, setTimeString] = useState("")
    const [brief, setBrief] = useState("")
    const [description, setDescription] = useState("")
    const [todo, setTodo] = useState(false)

    test()

    const handleTimeChange = (e) => {
        const value = e.target.value
        setTimeString(value)
        const array = timeString.split(' ').map(str => parseInt(str))
        if (array.length === 6) {
            setTime({
                year: array[0],
                month: array[1],
                day: array[2],
                hour: array[3],
                min: array[4],
                sec: array[5]
            })
            timeHintRef.current.innerHTML = '✅'
        } else if (array.length === 0) {
            timeHintRef.current.innerHTML = '默认时间'
        } else {
            timeHintRef.current.innerHTML = '❌'
        }
    }

    const handleSuccess = (response) => {
        console.log(response.data)
        setBrief("")
        setDescription("")
        setTime({})
        setTimeString("")
    }

    const handleSubmit = () => {
        const data = {time, brief, description, todo}
        console.log(data)
        request([], data, handleSuccess, handleError)
    }

    const handleCheckedChange = (e) => {
        setTodo(e.target.checked)
    }

    return (
        <div>
            <h1>{pName}</h1>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                <label>
                    todo :
                </label>
                <input style={{width:"25px", height:"25px"}} type="checkbox" checked={todo} onChange={handleCheckedChange}/>
            </div>
            <>Select thread</>
            <textarea
                style={{width: "50%"}}
                value={timeString}
                onChange={handleTimeChange}
            />
            <label ref={timeHintRef}></label>
            <textarea
                value={brief}
                onChange={ e => setBrief(e.target.value)}
            />
            <textarea
                value={description}
                onChange={ e => setDescription(e.target.value)}
            />

            <button onClick={handleSubmit}>submit</button>
        </div>
    )
}

export { Create }