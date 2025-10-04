import { useState, useEffect } from "react";
import { useApiRequest } from "../../context/APIProvider";

const DraftManager = () => {
    return (
        <>
        <CreateDraft />
        <DraftList />
        </>
    )
};

const CreateDraft = () => {
    const [draft, setDraft] = useState("");
    const createDraft = useApiRequest("createDraft");
    const handleDraftChange = (e) => {
        setDraft(e.target.value);
    };
    const handleSubmitClicked = (e) => {
        const data = {content: draft};
        createDraft(data)
            .then(response => console.log(response.data))
            .catch(err => console.log(err))
    };
    return (
        <>
        <textarea
            value={draft}
            onChange={handleDraftChange}
            />
        <button onClick={handleSubmitClicked}>submit</button>
        </>
    )
}

const DraftList = () => {
    const [draftList, setDraftList] = useState(null);
    const getAllDraft = useApiRequest('getAllDraft');
    useEffect(() => {
        getAllDraft()
            .then(response => setDraftList(response.data))
            .catch(err => console.log(err))
    }, [])
    if (draftList === null) { return <>Loading</> }
    return (
        <>
        {draftList.map((draft, id) => {
            return <Draft pDraft={draft} />
        })}
        </>
    )
}

const Draft = ({ pDraft }) => {
    const [draft, setDraft] = useState(pDraft);
    useEffect(() => {
        setDraft(draft)
    }, [pDraft])
    const handleEdit = () => {

    }
    return (
        <div key={draft.id}>
            <button>copy</button>
            <button onClick={handleEdit}>
                edit
            </button>
                {draft.content}
            
        </div>
    )
}

export default DraftManager;