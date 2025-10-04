import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";
import { publish, unsubscribe, subscribe } from "../../events/eventTools";
import { axiosPrivate } from "../../api/axios";

const ThoughtManager = () => {
    const [thoughtList, setThoughtList] = useState([])
    const axiosPrivate = useAxiosPrivate()

    const getThoughtList = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getAllThought())
            console.log(response)
            if (response.status === 200) {
                setThoughtList(response.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleNewThoughtCreated = (event) => {
        console.log(event)
        // setThoughtList( prev => ({...prev}))
        setThoughtList( prev => ([...prev, event.detail]))

    }

    useEffect(() => {
        subscribe("newThoughtCreated", handleNewThoughtCreated)
        getThoughtList()

        return unsubscribe("newThoughtCreated")
    }, [])

    return (
        <div>
            <CreateThought />
            <ThoughtList pThoughtList={thoughtList} />
        </div>
    )
}

const CreateThought = () => {
    const [newThoughtContent, setNewThoughtContent] = useState("")

    const handleNewThoughtContent = (event) => {
        event.preventDefault()
        setNewThoughtContent(event.target.value)
    }

    const doPostNewThought = async () => {
        const data = {content: newThoughtContent}
        try {
            const response = await axiosPrivate.post(Endpoint.createNewThought(), data)
            console.log(response)
            if (response.status === 201) {
                publish("newThoughtCreated", response.data)
                setNewThoughtContent("")
            }

        } catch (err) {
            console.log(err)
        }
    }

    
    return (
        <>
        <textarea
            value={newThoughtContent}
            onChange={handleNewThoughtContent}
        />
        <button onClick={doPostNewThought}>submit</button>
        </>
    )
}

const ThoughtList = ({ pThoughtList }) => {
    const [thoughtList, setThoughtList] = useState(pThoughtList)
    console.log('ThoughtList log', thoughtList)

    useEffect(() => {
        setThoughtList(pThoughtList)
    }, [pThoughtList])
    return (
        <>
        {thoughtList.map((thought, idx) => {
            return (
                <div key={thought.idx} thought-id={thought.id}>
                    * {thought.content}<br/>
                </div>
            )
        })}
        </>
    )
}

export default ThoughtManager