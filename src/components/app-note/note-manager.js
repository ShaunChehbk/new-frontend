import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";
import "./styleOfAppNote.css"
import ReactMarkdown from "react-markdown";

const NoteManager = () => {
    const axiosPrivate = useAxiosPrivate();
    const [noteList, setNoteList] = useState([])

    const getAllNote = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getAllNotes())
            const list = response.data
            setNoteList(list.reverse())
            console.log(noteList)
        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        getAllNote()
    }, [])

    return (
        <div>
            NoteListManager
            <NoteList
                list={noteList}
            />
        </div>
    )
}

const NoteList = ({ list }) => {
    const [noteList, setNoteList] = useState(list)
    useEffect(() => {
        setNoteList(list)
    }, [list])

    return (
        <>
        {noteList.map((note, idx) => {
            return <Note key={idx} note={note} />
        })}
        </>
    )
}

const Note = ({ note }) => {
    return (
        // <div className="note" id={note.id} dangerouslySetInnerHTML={{__html: note.text}}>
        <div className="note">
            {/* 在<ReactMarkdown/>中，设置overflow-x */}
            <ReactMarkdown
                children={note.text}
                className="reactMarkdown"
            />
        </div>
    )
}

export default NoteManager