import { useState, useEffect } from "react";
import KnowledgePanel, { CreateKnowledge, KnowledgeDetail } from "./Knowledge";
import RequirementPanel, { CreateRequirement, RequirementDetail } from "./Requirement";
import { publish, subscribe, unsubscribe } from "./event";
import Timeline from "./Timeline";
import type from "./type";
import { CreationType } from "./type";
import { CreateNote, NoteDetail } from "./Note";


const RecordMgr = () => {
    const [showDetail, setShowDetail] = useState(false);
    const [detailType, setDetailType] = useState("");
    const [detailData, setDetailData] = useState();
    const detailEvents = ["showRequirementDetail", "showKnowledgeDetail", "showNoteDetail"]
    const [creating, setCreating] = useState(false);
    const [creationType, setCreationType] = useState("");

    useEffect(() => {
        detailEvents.map(event => {
            subscribe(event, (e) => { 
                setShowDetail(true);
                setDetailType(e.detail.type);
                setDetailData(e.detail);
            });
        })
        subscribe("endCreation", (e) => {
            publish("newTimelineAdded", e.detail);
            setCreating(false);
        });
        subscribe("endPresentation", (e) => { setShowDetail(false) });
        return () => {
            detailEvents.map(event => {
                unsubscribe(event, (e) => { 
                    setShowDetail(true);
                });
            })
            unsubscribe("endCreation");
        }
    }, [])
    const ChoseDetail = (t) => {
        // 责任链模式也行，但是可能得用class组件
        switch (t) {
            case type.requirement:
                return <RequirementDetail data={detailData} />
            case type.knowledge:
                return <KnowledgeDetail data={detailData} />
            case type.note:
                return <NoteDetail data={detailData} />
        }
    }
    const ChoseCreateion = (t) => {
        switch (t) {
            case CreationType.requirement:
                return <CreateRequirement />
            case CreationType.knowledge:
                return <CreateKnowledge />
            case CreationType.note:
                return <CreateNote />
        }
    }

    const addRequirement = (e) => {
        setCreating(true);
        setCreationType(CreationType.requirement);
    }

    const addKnowledge = (e) => {
        setCreating(true);
        setCreationType(CreationType.knowledge);
    }

    const addNote = (e) => {
        setCreating(true);
        setCreationType(CreationType.note);
    }

    return (
        <>
        <button onClick={addRequirement}>Add requirement</button>
        <button onClick={addKnowledge}>Add knowldege</button>
        <button onClick={addNote}>Add note</button>
        <div className="root-container">
            <Timeline />
        </div>
        {
        showDetail
        ?<>
        <div className="overlay">
            <div className="detail">
            { ChoseDetail(detailType) }
            </div>
        </div>
        </> 
        :<></>
        }
        {
        creating
        ?<>
        <div className="overlay">
            <div className="detail">
            { ChoseCreateion(creationType)}
            </div>
        </div>
        </>
        :<></> 
        }
        </>
    )
}

export default RecordMgr;