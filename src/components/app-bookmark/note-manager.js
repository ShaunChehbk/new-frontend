import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";

const NoteManager = ({ closeNoteList, bookmarkId }) => {
    const axiosPrivate = useAxiosPrivate()

    const handleEscapeKey = () => {
        closeNoteList()
    }

    useEffect(() => {
        document.addEventListener("keydown", handleEscapeKey)

        // return document.removeEventListener("keydown", handleEscapeKey)
        return () => document.removeEventListener("keydown", handleEscapeKey)
    }, [])

    return (
        <div className="edit-overlay">
            <div className="edit-bookmark-form">
                {bookmarkId}
                <ListView bookmarkId={bookmarkId}/>
            </div>
        </div>
    )
}

const ListView = ({ bookmarkId }) => {
    console.log(bookmarkId)
    const axiosPrivate = useAxiosPrivate()
    const [noteList, setNoteList] = useState([])

    const getNoteList = async () => {
        console.log(bookmarkId)
        try {
            const response = await axiosPrivate.get(Endpoint.getNoteListOf(bookmarkId))
            setNoteList(response.data)
        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        getNoteList()
    }, [])
    return (
        <div>
            {noteList.map((note, idx) => {
                return (
                    <div key={idx} id={note.id}>
                        {note.text}
                    </div>
                )
            })}
        </div>
    )
}

const DetailView = () => {

}

export default NoteManager;