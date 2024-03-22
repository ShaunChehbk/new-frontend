import { WorkList } from "./data-structure"
import WorkPanel from "./workpanel"
import { useState } from "react"
const WorkMgr = (props) => {
    const [works, setWorks] = useState(props.works)
    return (
        <div className="workmgr-container">
            <div className="banner">
                <div className="banner-right">
                    <b>Activities</b>
                </div>
                <div className="banner-left">
                    <button>Add</button>
                </div>
            </div>
            {props.works.map((work, pos) => {
                return <WorkPanel work={work}
                addCheckin={props.addCheckin} 
                />
            })}
        </div>
    )
}
export default WorkMgr