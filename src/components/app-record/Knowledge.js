import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Endpoint from "../../api/api";
import { publish, subscribe, unsubscribe } from "./event";
import { DetailType } from "./type";
import ReactMarkdown from "react-markdown";
import "./styles.css"

const KnowledgePanel = () => {
    return (
    <>
    KnowledgePanel
    </>
    )
}

const KnowledgeAbstract = ({ knowledge }) => {
    const text = knowledge.text.split('\n')[0]
    return (
    <>
    <div 
        onClick={e => publish("showKnowledgeDetail", knowledge)}
        className="knowledge-abstract"
        knowledge-id={knowledge.id}
    >
    {text}
    </div>
    </>
    )
}

const KnowledgeDetail = ({ data }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(data.text);
    const axiosPrivate = useAxiosPrivate();
    const [knowledge, setKnowledge] = useState(data);

    const [info, setInfo] = useState("");
    const [bookmarkTitle, setBookmarkTitle] = useState("null");
    const [bookmarkUrl, setBookmarkUrl] = useState("null");

    const updateText = async () => {
        const newData = {text: text};
        try {
            const response = await axiosPrivate.post(Endpoint.Record.setTextOfKnowledge(data.id), newData)
        } catch (err) {
            console.log(err);
        }
    }

    
    useEffect(() => {
        const array = info.split('\n')
        if (array.length >= 2) {
            setBookmarkTitle(array[0]);
            setBookmarkUrl(array[1]);
        }
    }, [info])

    const addBookmark = async (e) => {
        console.log(`${bookmarkTitle} \n ${bookmarkUrl}`);
        data = {title: bookmarkTitle, url: bookmarkUrl};
        try {
            const creation_response = await axiosPrivate.post(Endpoint.Bookmark.getOrCreate(), data);
            const bookmark_id = creation_response.data.id;
            const combine_response = await axiosPrivate.post(Endpoint.Record.addBookmarkForKnowledge(knowledge.id, bookmark_id));
            console.log(combine_response.data)
            
        } catch (err) {
            console.log(err);
        }
    }

    return (
    <>
    <div className="click-to-close" onClick={e => publish("endPresentation")}>close</div>
    <button onClick={e => setIsEditing(!isEditing)}>Edit</button><br/>
    {
    isEditing
    ? <>
    <div className="default">
    <textarea rows="2" value={info} onChange={e => setInfo(e.target.value)} />
    </div>
            <div>
            {
                info == ""
                ? <></>
                : <>
                {bookmarkTitle.substring(0, 10) + "..." + "||" + bookmarkUrl.substring(0, 10) + "..."}
                <br/>
                <button onClick={addBookmark}>Add bookmark</button>
                </>
            }
            </div>
    <button onClick={updateText}>submit</button>
    <textarea value={text} onChange={e=>setText(e.target.value)}/>
    </>
    : 
    <div className="markdown-container">
        <ReactMarkdown children={text} />
    </div>
    }
    </>
    )
}

const CreateKnowledge = () => {
    const axiosPrivate = useAxiosPrivate();
    const [text, setText] = useState("");


    const doCreation = async (e) => {
        e.preventDefault();
        const data = {text: text}
        try {
            const response = await axiosPrivate.post(Endpoint.Record.createKnowledge(), data);
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
            <label>Create Knowledge</label>
            <textarea rows="20" value={text} onChange={e => setText(e.target.value)} />
            <button onClick={doCreation}>submit</button>
        </form>
        </>
    )
}

export { KnowledgeAbstract, KnowledgeDetail, CreateKnowledge };
export default KnowledgePanel;