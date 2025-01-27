import { WorkList } from "./data-structure"
import WorkPanel from "./workpanel"
import { useState } from "react"
const WorkMgr = (props) => {
    const [works, setWorks] = useState(props.works)
    
    return (
        <div className="workmgr-container">
            <div className="banner" style={{height: 0.3 * props.height}}>
                <div className="banner-right">
                    <b>Activities</b>
                </div>
                <div className="banner-left">
                    <button>Add</button>
                </div>
            </div>
            <div style={{height: 0.7 * props.height, overflowY: "scroll"}}>
            {props.works.map((work, pos) => {
                return <WorkPanel work={work}
                addCheckin={props.addCheckin} 
                />
            })}
            </div>
        </div>
    )
}
export default WorkMgr