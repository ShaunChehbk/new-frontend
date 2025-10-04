import { useContext, useEffect, useState } from "react";
import APIContext, { useApiRequest } from "../../context/APIProvider";

const Fast = () => {
    return (
        <div>
            <Comp pName="✈️" pType="createActivity" />
            <Comp pName="手指机能练习" pType="createActivity" />
        </div>
    )
};

const Comp = ({ pName, pType }) => {

    // const [request, setRequest] = useState(null);
    // const { useRequest } = useContext(APIContext)
    const request = useApiRequest(pType)
    const [status, setStatus] = useState(pName)

    // useEffect(() => {
    //     switch(pType) {
    //         case 'activity':
    //             setRequest(useRequest('createActivity'));
    //             break;
    //     }
    // }, [])
    // var request;
    // switch(pType) {
    //     case 'activity':
    //         request = useApiRequest('createActivity')
    // }

    
    const handleSuccess = (response) => {
        console.log(response)
        setStatus("✅")
    }

    const handleError = (err) => {
        console.log(err)
    }

    const handleSubmit = () => {
        const data = {
            time: {}, 
            brief: pName, 
            description: "", 
            todo: false
        }
        console.log(data)
        request([], data, handleSuccess, handleError)
    }

    
    return (
        <div onClick={handleSubmit}>
            {status}
        </div>
    )    
}

export default Fast;