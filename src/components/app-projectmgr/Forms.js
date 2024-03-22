import { useState, useEffect } from "react"
export const TaskForm = (props) => {
    const [title, setTitle] = useState("")
    const [note, setNote] = useState("")
    return (
            <div className="form">
                <label>Title</label>
                <br />
                <input
                    type="text"
                    placeholder="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <br />
                <textarea
                    type="text"
                    placeholder="note"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                />
                <br />
                <button
                    className="mybutton"
                    onClick={e => props.submitTask({ title, note })}
                >submit</button>
                <button className="mybutton"
                    onClick={e => props.setIsAdding(false)}
                >Close</button>
            </div>
    )
}

export const ActivitiesForm = (props) => {
    return (
        <div>

        </div>
    )
}

export const CheckinForm = (props) => {
    const [title, setTitle] = useState("")
    const [note, setNote] = useState("")
    const submitNewCheckin = () => {
        /// 如果response中是work，则更新work
        /// 如果response中是independent，则更新independent
        console.log(title)
        console.log(note)
        if (props.newCheckin?.work) {
            const work = props.newCheckin.work
            props.submitCheckin({ work, title, note })
        }
        else if (props.newCheckin?.task) {
            const task = props.newCheckin.task
            props.submitCheckin({ task, title, note })

        }
        else
            props.submitCheckin({ title, note })
    }
    return (
        <div className="form">
            {props.newCheckin?.title ? <>checkin for {props.newCheckin.title}</> : <>independent checkin</>}
            <br />
            <label>Title</label>
            <br />
            <input
                type="text"
                placeholder="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <br />
            <label>Note</label>
            <br />
            <textarea
                type="text"
                width="100%"
                placeholder="note"
                value={note}
                onChange={e => setNote(e.target.value)}
            />
            <br />
            <button className="mybutton"
                onClick={e => submitNewCheckin()}
            >submit</button>
            <button className="mybutton"
                onClick={e => props.setIsAdding(false)}
            >Close</button>
        </div>
    )
}

const Form = (props) => {
    return (
        <div className="form-container">
            {props.type === "checkin"
                ? <CheckinForm setIsAdding={props.setIsAdding} newCheckin={props.newCheckin} submitCheckin={props.submitCheckin} />
                : props.type === "task"
                    ? <TaskForm setIsAdding={props.setIsAdding} submitTask={props.submitTask} />
                    : <>none</>
            }
        </div>
    )
}

export default Form;