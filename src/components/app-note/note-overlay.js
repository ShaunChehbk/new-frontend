import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { subscribe, unsubscribe, publish } from "../../events/eventTools";
import "./styleOfAppNote.css"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";
import { Note } from "./note-manager";

const NoteOverlayManager = () => {
    const [shouldShowOverlay, setShouldShowOverlay] = useState(false)
    const [noteId, setNoteId] = useState()

    const handleEscapeKey = (e) => {
        console.log(e)
        if (e.code === 'Escape') { 
            publish("closeNoteOverlay", {})
        }
    }

    const handleOpenOverlay = (e) => {
        setShouldShowOverlay(true)
        setNoteId(e.detail.id)
    }

    const handleCloseOverlay = (e) => {
        setShouldShowOverlay(false)
    }

    useEffect(() => {
        subscribe("closeNoteOverlay", handleCloseOverlay)
        subscribe("openNoteOverlay", handleOpenOverlay)
        // subscribe("openNoteOverlay", (event) => { console.log(event) })
        document.addEventListener("keydown", handleEscapeKey)
        // return document.removeEventListener("keydown", handleEscapeKey)
        return () => document.removeEventListener("keydown", handleEscapeKey)
    }, [])

    if (shouldShowOverlay) {
        return (
            <div className="overlay-container">
                <div className="overlay-body">
                    <DetailView noteId={noteId}/>
                </div>
            </div>
        )
    }
    else {
        return <></>
    }
}

const DetailView = ({ noteId }) => {
    const axiosPrivate = useAxiosPrivate()
    const [note, setNote] = useState()

    const getDetail = async () => {
        const response = await axiosPrivate.get(Endpoint.getDetailOfNote(noteId))
        setNote(response.data)
    }

    useEffect(() => {
        getDetail()
    }, [noteId])
    if (note === undefined) { return <div>Loading</div> }
    return (
        <div>
            Detail View
            <button onClick={ (e) => publish("closeNoteOverlay") }> close </button>
            {note.bookmarks.map((bookmark, idx) => {
                return (
                    <ShowBookmark pBookmark={bookmark} />
                )
            })}
            <Note pNote={note}/>
            {note.relatedNotes.map((note, idx) => {
                return <Note pNote={note} key={idx} />
            })}
        </div>
    )
}

const EditBookmark = ({ pBookmark, pUpdateBookmark }) => {
    const [bookmark, setBookmark] = useState(pBookmark)
    const axiosPrivate = useAxiosPrivate()
    const titleBox = useRef(null)
    const urlBox = useRef(null)

    useEffect(() => {
        setBookmark(pBookmark)
    }, [pBookmark])

    const adjustSize = () => {
        titleBox.current.style.height = `${titleBox.current.scrollHeight}px`
        urlBox.current.style.height = `${urlBox.current.scrollHeight}px`
    }

    useLayoutEffect(() => {
        window.addEventListener("resize", adjustSize)
        adjustSize()
        return () => window.removeEventListener("resize", adjustSize)
    }, [])

    const handleUpdate = async () => {
        const data = {title: bookmark.title, url: bookmark.url}

        try {
            const response = await axiosPrivate.post(Endpoint.update(bookmark.id), data)

            if (response.status === 200) {                
                pUpdateBookmark(bookmark)
                publish("closeShowBookmark")
            }
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div>
            <textarea 
                ref={titleBox}
                value={bookmark.title}
                onChange={ (e) => setBookmark( bookmark => ({...bookmark, title: e.target.value}) )}
            />
            <textarea 
                ref={urlBox}
                value={bookmark.url}
                onChange={ (e) => setBookmark( bookmark => ({...bookmark, url: e.target.value}) )}
            />
            <button
                onClick={handleUpdate}
            >submit</button>
            <button
                onClick={ (e) => { publish("closeShowBookmark") }}
            >close</button>
        </div>
    )

}

const ShowBookmark = ({ pBookmark }) => {
    const [bookmark, setBookmark] = useState(pBookmark)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        subscribe("closeShowBookmark", () => { setIsEditing(false) })

        return () => { unsubscribe("closeShowBookmark") }
    }, [])

    if (isEditing) {
        return (
            <div className="bordered">
            <EditBookmark pBookmark={bookmark} pUpdateBookmark={setBookmark}/>
            </div>
        )
    }

    return (
        <div className="bordered">
            <div>
                {bookmark.title}
            </div>
            <div>
                {bookmark.url}
            </div>
            <button onClick={ (e) => setIsEditing(true) }>edit</button>
        </div>
    )
}


export default NoteOverlayManager