import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";

const SentencePanel = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [sentences, setSentences] = useState([1, 2, 3])

    const getAllSentence = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getAllSentence())
            setSentences(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (auth?.accessToken) getAllSentence()
    }, [auth])
    return (
        <div>
        {
        sentences
        ? <>{sentences.map((s, idx) => {
            return <Sentence id={s.id} text={s.text} type={s.type}/>
        })}</>
        : <></>
        }
        </div>
    )
}

export const Sentence = ({ id, text, type }) => {
    const [sentence, setSentence] = useState("sentence")
    return (
        <div>
            {text}
        </div>
    )
}

export default SentencePanel