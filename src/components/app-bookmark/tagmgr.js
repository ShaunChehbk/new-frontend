import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";


export const CreateTag = ({afterCreate}) => {
    const [title, setTitle] = useState("")
    const axiosPrivate = useAxiosPrivate();
    const handleSubmit = async (e) => {
        try {
            if (title) {
                const response = await axiosPrivate.post(Endpoint.createTag(title), {});
                console.log(response)
                setTitle("")
            }
            if (afterCreate) afterCreate()
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <>
        <form>
            <label>Tag Title:</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </form>
        <button onClick={handleSubmit}>Submit</button>
        </>
    )
}

const TagMgr = () => {

}

export default TagMgr;