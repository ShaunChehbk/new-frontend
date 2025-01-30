import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";
import "./styleOfAppNote.css"
import ReactMarkdown from "react-markdown";

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
            return <Note key={idx} p_note={note} />
        })}
        </>
    )
}

const Note = ({ p_note }) => {
    const [note, setNote] = useState(p_note)
    const [nodes, setNodes] = useState([])

    useEffect(() => {
        setNodes(classify(note.text))
        // setNodes(classify(note.text))
    }, [note])

    console.log(nodes)

    return (
        // <div className="note" id={note.id} dangerouslySetInnerHTML={{__html: note.text}}>
        <div className="note" id={note.id}>
            {/* 在<ReactMarkdown/>中，设置overflow-x */}
            {
                nodes.map((node, idx) => {
                    if (node.type === "text") {
                        return (
                            <ReactMarkdown 
                                children={node.text} 
                                className="reactMarkdown"
                            />
                        )
                    }
                    else if (node.type === "code") {
                        return (
                            <ReactMarkdown
                                children={`\`\`\`${node.text}\`\`\``}
                                className="reactMarkdown"
                            />
                        )
                }
            })
            }
        </div>
    )
}

export default NoteManager