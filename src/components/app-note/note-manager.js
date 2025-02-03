import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";
import "./styleOfAppNote.css"
import ReactMarkdown from "react-markdown";
import NoteOverlayManager from "./note-overlay";
import { subscribe, unsubscribe, publish } from "../../events/eventTools";

const classify = (text) => {
    // 找到所有```的位置
    // 找出所有匹配项的下标位置，要带gi两个参数
    // const codeCursor = [...text.matchAll(/```/gi)]

    // 如果是奇数个（不完整）split出来的就是偶数个
    const splitedArray = text.split('```')
    // code总是在奇数位上
    // code前面的要么是''要么是string
    // '```code``` text ```code```'
    // text.split('```')
    // (5) ['', 'code', ' text ', 'code', '']
    const result = []
    splitedArray.map((text, idx) => {
        // text
        if ((idx & 1) === 0) {
            result.push({type: "text", text: text})
        }
        // code
        else {
            result.push({type: "code", text: text})
        }
    })

    return result
}

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
            <NoteOverlayManager />
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
            return (
                <div>
                    <button style={{float: "right", marginRight: "12px", marginTop:"2px"}} onClick={ (e) => publish("openNoteOverlay", {id: note.id}) }>detail</button>
                    <Note key={idx} pNote={note} />
                </div>
            )
        })}
        </>
    )
}

const Note = ({ pNote }) => {
    const [nodes, setNodes] = useState([])
    const [note, setNote] = useState(pNote)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        // onEditEnd
        //
        // subscribe("closeNoteEdit", (e) => { setIsEditing(false) })

        setNodes(classify(note.text))
        // setNodes(classify(note.text))
    }, [note])
    
    if (note === undefined) { 
        return 'undefined'
    }

    const handleEdit = () => {
        // publish("editNote", {id: note.id, text: note.text})
        setIsEditing(true)
    }

    
    const handleEndEdit = (text) => {
        setIsEditing(false)
        // setNote(note => {...note, text})
        setNote(note => { return {...note, text}})
    }

    const closeEdit = () => {
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <EditView pNote={note} update={handleEndEdit} close={closeEdit}/>
        )
    }

    return (
        // <div className="note" id={note.id} dangerouslySetInnerHTML={{__html: note.text}}>
        <div className="note" id={note.id}>
            {/* 在<ReactMarkdown/>中，设置overflow-x */}
            {
                nodes.map((node, idx) => {
                    if (node.type === "text") {
                        return (
                            <ReactMarkdown
                                key={idx} 
                                children={node.text} 
                                className="reactMarkdown"
                            />
                        )
                    }
                    else if (node.type === "code") {
                        return (
                            <ReactMarkdown
                                key={idx} 
                                children={`\`\`\`${node.text}\`\`\``}
                                className="reactMarkdown"
                            />
                        )
                }
            })
            }
            <br/>
            <button onClick={handleEdit}>Edit</button>
        </div>
    )
}

const EditView = ({ pNote, update, close }) => {
    const textbox = useRef(null)
    const [text, setText] = useState(pNote.text)
    const id = pNote.id
    const axiosPrivate = useAxiosPrivate()

    const handleSubmit = async () => {
        // publish("closeNoteEdit")
        // console.log(Endpoint.updateNote(id))
        console.log(text, id)
        const data = { text }
        const response = await axiosPrivate.post(Endpoint.updateNote(id), data)
        if (response.status === 200) {
            update(text)
        }
    }

    const adjustHeight = () => {
        textbox.current.style.height = "inherit";
        textbox.current.style.height = `${textbox.current.scrollHeight}px`;
    }
    
    useLayoutEffect(adjustHeight, [])

    return (
        <div className="note" id={pNote.id}>
            <textarea ref={textbox} value={text} onChange={ (e)=>setText(e.target.value) } />
            <button onClick={handleSubmit}>submit</button>
            <button onClick={close}>close</button>
        </div>
    )
}

export default NoteManager
export { Note }