import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import Endpoint from "../../api/api";
import { publish, subscribe, unsubscribe } from "./event";
import { RequirementAbstract } from "./Requirement";
import { KnowledgeAbstract } from "./Knowledge";
import { NoteAbstract } from "./Note";
import "./styles.css"

const Requirements = ({ requirements }) => {
    return (
        <div className="timeline-left">
        {requirements.map((e, idx) => <RequirementAbstract requirement={e} />)}
        </div>
    )
}

const Knowledges = ({ knowledges }) => {
    return (
        <div className="timeline-right">
        {knowledges.map((e, idx) => <KnowledgeAbstract knowledge={e} />)}
        </div>
    )
}

const Timeline = () => {
    const { auth } = useAuth();
    const [entries, setEntries] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [knowledges, setKnowledges] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    const getTimeline = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.Record.getTimeline());
            setEntries(response.data.reverse());
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        subscribe("newTimelineAdded", (e)=> {
            setEntries(oldSet => [e.detail, ...oldSet]);
        })
        return (() => {
            unsubscribe("newTimelineAdded");
        })
    }, [])

    useEffect(() => {
        getTimeline()
    }, [auth]);

    const filter = (entries) => {
        entries.map((e, idx) => {
            if (e.type == "requirement") setRequirements(oldSet => [...oldSet, e])
            if (e.type == "knowledge") setKnowledges(oldSet => [...oldSet, e])
            // if (e.type == "note") return <NoteAbstract note={e} />
        })
    }

    useEffect(() => {
        filter(entries);
    }, [entries]);

    return (
    <>
    {
    entries
    ? <>
    {/* tab栏 knowledges, requirements, notes */}
    <div className="timeline-board">
        <Requirements requirements={requirements}/>
        <Knowledges knowledges={knowledges}/>
    </div>
    <div className="horizontal-scroller">{

    }</div></>
    : <></>
    }
    </>
    )
}

export default Timeline;   