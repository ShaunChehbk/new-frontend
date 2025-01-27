import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Endpoint from "../../api/api";

const WordPanel = () => {
    const [adding, setAdding] = useState(false);
    return (
        <>
        <button onClick={e => setAdding(!adding)}>Add</button>
        {
        adding
        ? <>
        <div>
            <AddWord />
        </div>
        </>
        : <></>
        }
        </>
    )
}

const Word = ({ word }) => {
    return (
        <>
        </>
    )
}

const AddWord = () => {
    const [newWord, setNewWord] = useState("")
    const [newSentence, setNewSentence] = useState("")
    const [type, setType] = useState("EN");
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const submitNewWord = async (e) => {
        e.preventDefault()
        const data = {type: type, word: newWord, sentence: newSentence}
        if (newSentence != "" & newWord != "") {
            try {
                console.log(data)
                const response = await axiosPrivate.post(Endpoint.addWord(), data);
                setNewSentence("");
                setNewWord("");
            } catch (err) {
                setNewWord(err.response.data);
            }
        }
    }

    return (
        <>
        <form>
            <label>Word</label>
            <input type="text" value={newWord} onChange={e => setNewWord(e.target.value)} />
            <label>Sentence</label>
            <textarea value={newSentence} onChange={e => setNewSentence(e.target.value)} />
            <button onClick={submitNewWord}>submit</button>
        </form>
        </>
    )
}

const ReviewWord = ({ word_id }) => {

}

export default WordPanel;