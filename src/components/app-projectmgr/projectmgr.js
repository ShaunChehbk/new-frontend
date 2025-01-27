import { WorkList } from "./data-structure"
import Endpoint from "../../api/api"
import { useEffect, useRef, useState } from "react"
import useAuth from "../../hooks/useAuth"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import WorkMgr from "./workmgr"
import "./styles.css"
import TaskMgr from "./taskmgr"
import Today from "./today"
import { CheckinForm, TaskForm, ActivitiesForm } from "./Forms"
import Form from "./Forms"

const ProjectList = [
    {
        "name": "iOS share Extension 插件（URL搜集）",
        "tasks": [
            { "name": "Swift HTTP request" },
            { "name": "Share Extension 插件" }
        ]
    },
    {
        "name": "Chrome插件开发",
        "tasks": [
            { "name": "检查当前标签页是否已经在数据库中" },
            { "name": "动态改变icon" }
        ]
    },
    { "name": "刷题" },
    {
        "name": "管理系统开发",
        "tasks": [
            { "name": "ProjectMgr组件开发" }
        ]
    },
    {
        "name": "雕塑",
        "tasks": [
            { "name": "五官练习" },
            // 五官练习的粒度？？五官？还是”嘴、鼻子”？
            { "name": "大型练习" }
        ]
    }
]


const ProjectMgr = () => {
    const [checkins, setCheckins] = useState();
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();

    const [newCheckin, setNewCheckin] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const [formType, setFormType] = useState("");

    const rect = useRef(null)

    const addCheckin = (target = {}) => {
        setFormType("checkin")
        setIsAdding(true)
        setNewCheckin(target)
    }

    const addTask = () => {
        setIsAdding(true)
        setFormType("task")
    }

    const submitTask = (data) => {
        // const data = {"title": task}
        const addTask = async (data) => {
            console.log(data)
            try {
                const response = await axiosPrivate.post(Endpoint.add_task, data);
                if (response.status === 201) {
                    const tasks = checkins.tasks
                    tasks.push(response.data)
                    setCheckins({...checkins, "tasks": tasks})
                }
            } catch (err) {
                console.log(err)
            }
        }
        if (auth?.accessToken) {
            addTask(data);
        }
    }

    const submitCheckin = (checkin) => {
        const addCheckin = async (data) => {
            console.log(data)
            try {
                const response = await axiosPrivate.post(Endpoint.add_checkin, data);
                if (response.status === 201) {
                    console.log(response.data)
                    const name = Object.keys(response.data)[0]
                    const value = response.data[name]
                    console.log(name, value)
                    setCheckins({ ...checkins, [name]: response.data[name] })

                }
            } catch (err) {
                console.log(err);
            }

        }
        if (auth?.accessToken) {
            addCheckin(checkin);
        }
    }

    const updateSize = () => {
        setHeight(0.8 * window.innerHeight);
        setWidth(window.innerWidth);
        console.log("update size")
    }

    useEffect(() => {
        const getCheckins = async () => {
            try {
                const response = await axiosPrivate.get(Endpoint.get_checkins);
                setCheckins(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        if (auth?.accessToken) {
            getCheckins();
        }
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [])

    return (
        <>
        {
        checkins
        ? (<>
            <WorkMgr
                height={height * 0.4}
                works={checkins.works}
                addCheckin={addCheckin}
            />
            <div >
                <div className="mgr-left">
                    <TaskMgr
                        height={height * 0.4}
                        tasks={checkins.tasks}
                        addCheckin={addCheckin}
                        addTask={addTask}
                    />
                </div>
                <div className="mgr-right">
                    <Today
                        height={height * 0.4}
                        addCheckin={addCheckin}
                        checkins={checkins.independent}
                    />
                </div>
            </div>
            </>) 
        : <div>"fetching"</div>
        }
        {
            isAdding
                ? (
                        // <CheckinForm setIsAdding={setIsAdding} newCheckin={newCheckin} submitCheckin={submitCheckin} />
                        <Form type={formType} setIsAdding={setIsAdding} newCheckin={newCheckin} submitCheckin={submitCheckin} submitTask={submitTask}/>
                ) : <></>
        }

        </>
    )
}
export default ProjectMgr