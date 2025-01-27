import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./styles.css"
import { publish } from "./event";
import Endpoint from "../../api/api";
import ReactMarkdown from "react-markdown";

const Note = () => {

}

const NoteAbstract = ({ note }) => {
    return (
    <>
    <div note-id={note.id} onClick={e => publish("showNoteDetail", note)} className="note-abstract">
        {note.text.substring(0, 20)}
    </div>
    </>
    )

}

const NoteDetail = ({ data }) => {
    const [note, setNote] = useState(data);
    const [isEditing, setIsEditing] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    return (
    <>
    <div className="click-to-close" onClick={e => publish("endPresentation")}>Close</div>
    {
    isEditing
    ? <></>
    : 
    <div className="markdown-container">
        <ReactMarkdown children={note.text} />
    </div>
    }
    </>
    )
}

const CreateNote = () => {
    const axiosPrivate = useAxiosPrivate();
    const [text, setText] = useState("");

    const doCreation = async (e) => {
        e.preventDefault();
        const data = {text: text}
        try {
            const response = await axiosPrivate.post(Endpoint.Record.createNote(), data);
            setText("");
            publish("endCreation", response.data);
        } catch (err) {
            console.log(err)
        }
    }
    
    return (
        <>
        <div className="click-to-close" onClick={e => publish("endCreation", {})}>
            Close
        </div>
        <form>
            <label>Create Note</label>
            <textarea value={text} onChange={e => setText(e.target.value)} />
            <button onClick={doCreation}>submit</button>
        </form>
        </>
    )
}

export { NoteAbstract, NoteDetail, CreateNote }