import { useState, useEffect, useContext } from "react";
import APIContext from "../../context/APIProvider";
import { handleError } from "../../context/APIProvider";

const ActionManager = () => {
    const [actionList, setActionList] = useState(null)
    const { useRequest } = useContext(APIContext)
    const getAllAction = useRequest('getAllAction')


    const resolveGetAllAction = (response) => {
        setActionList(response.data)
    }

    useEffect(() => {
        getAllAction(resolveGetAllAction, handleError)
    }, [])

    if (!actionList) { return }

    return (
        <div>
            <ActionList pList={actionList} />
        </div>
    )
}

const ActionList = ({ pList }) => {
    const [actionList, setActionList] = useState(pList)

    useEffect(() => {
        setActionList(pList)
    }, [pList])

    return (
        <div>
        {actionList.map((action) => <Action pAction={action} />)}
        </div>
    )
}

const Action = ({ pAction }) => {
    return (
        <div key={pAction.id} activity-id={pAction.resume}>
        {pAction.resume}
        </div>
    )
}

export default ActionManager