import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Endpoint from "../../api/api";
import { publish, subscribe, unsubscribe } from "./event";
import { CreateSolution, Solution } from "./Solution";
import "./styles.css"


const RequirementPanel = () => {
    const { auth } = useAuth();
    const [requirements, setRequirements] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    const getRequirements = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.Record.getRequirements());
            setRequirements(response.data)
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getRequirements()
    }, [auth]);
    return (
    <>
    <div>
    {
        requirements
        ? <>{requirements.map((requirement, idx) => {
            return <RequirementAbstract requirement={requirement} />
        })}</>
        : <>Loading</>
    }
    </div>
    </>
    )
}

const RequirementAbstract = ({ requirement }) => {
    return (
    <>
    <div requirement-id={requirement.id} onClick={e => publish("showRequirementDetail", requirement)} className="requirement-abstract">
    {requirement.text}
    </div>
    </>
    )
}

const RequirementDetail = ({ data }) => {
    const [addSolution, setAddSolution] = useState(false);
    const [requirement, setRequirement] = useState(data);
    const axiosPrivate = useAxiosPrivate();

    const getRequirementDetail = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.Record.getReqiurementDetail(data.id));
            console.log('get requirement detail')
            setRequirement(response.data);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        subscribe(`newSolutionCreated-${data.id}`, getRequirementDetail);

        return (() => {
            unsubscribe(`newSolutionCreated-${data.id}`);
        })
    }, [])

    return (
        <>
        <div className="click-to-close" onClick={e => publish("endPresentation")}>close</div>

        RequirementDetail
        <button onClick={e => setAddSolution(!addSolution)}>add solution</button>
        {
            addSolution
            ?<><CreateSolution requirement_id={requirement.id} /></>
            :<></>
        }
        <>
        {requirement.solutions.map((solution, idx) => {
            return <Solution data={solution} />
        })}
        </>
        </>
    )
}

const CreateRequirement = () => {
    const axiosPrivate = useAxiosPrivate();
    const [text, setText] = useState("");

    const doCreation = async (e) => {
        e.preventDefault();
        const data = {text: text}
        try {
            const response = await axiosPrivate.post(Endpoint.Record.createRequirement(), data);
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
            <label>Create Requirement</label>
            <textarea value={text} onChange={e => setText(e.target.value)} />
            <button onClick={doCreation}>submit</button>
        </form>
        </>
    )
}

export { RequirementAbstract, RequirementDetail, CreateRequirement };
export default RequirementPanel;