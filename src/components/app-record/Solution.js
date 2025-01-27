import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { publish } from "./event";
import "./styles.css"
import Endpoint from "../../api/api";

const Solution = ({ data }) => {
    return (
        <>
        <div className="solution">
        {data.text}
        </div>
        </>
    )
}

const CreateSolution = ({ requirement_id }) => {
    const [text, setText] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const doCreateion = async () => {
        const data = {text: text};
        try {
            const creation_response = await axiosPrivate.post(Endpoint.Record.createSolution(), data);
            if (creation_response.status == 201) {
                // console.log(creation_response.data);
                const solution_id = creation_response.data.id;
                const combine_response = await axiosPrivate.post(Endpoint.Record.setRequirementForSolution(solution_id, requirement_id));
                console.log(combine_response);
                publish(`newSolutionCreated-${requirement_id}`, {});
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
        <textarea rows="50" value={text} onChange={e => setText(e.target.value)}/>
        <button onClick={doCreateion}>submit</button>
        </>
    )
}

export { Solution, CreateSolution }