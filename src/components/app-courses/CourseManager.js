import { useEffect, useState } from "react";
import { useApiRequest } from "../../context/APIProvider";
import { publish, subscribe, unsubscribe } from "../../events/eventTools";

class Course {
    constructor(name, url) {
        this.name = name;
        this.url = url
    }
}

class CourseMap {
    map = []
    register(name, url) {
        this.map.push(new Course(name, url))
    }

    iterate(process) {
        return this.map.map(process)
    }
}

const CourseManager = () => {
    const getAllPin = useApiRequest('getAllPin')
    const getWeather = useApiRequest('testWeather')
    const [list, setList] = useState(null)

    const handleNewPinCreated = (e) => {
        setList(prev => [...prev, e.detail])
    }

    useEffect(() => {
        getAllPin()
            .then(response => setList(response.data))
            .catch(err => console.log(err))
        // getWeather()
        //     .then(response => console.log(response.data))
        //     .catch(err => console.log(err))
        subscribe('pinCreated', handleNewPinCreated)
        return () => unsubscribe('pinCreated', handleNewPinCreated)
    }, [])

    if (!list) { return (<>Loading list</>)}

    return (
        <>
        <CreatePin />
        <CourseList pList={list}/>
        </>
    )
}

const CreatePin = () => {
    const createPin = useApiRequest('createNewPin')
    const [name, setName] = useState("")
    const [url, setUrl] = useState("")

    const handleRequest = () => {
        if (name == "" && url == "") { return }
        const data = { name, url }
        createPin(data)
            .then(response => {
                setName("")
                setUrl("")
                publish('pinCreated', response.data)
            })
            .catch(err => console.log(err))
    }

    return (
        <>
        <textarea
            rows="2"
            value={name}
            onChange={e => setName(e.target.value)}
        />
        <br/>
        <textarea
            rows="2"
            value={url}
            onChange={e => setUrl(e.target.value)}
        />
        <br/>
        <button onClick={handleRequest}>submit</button>
        </>
    )
}

const CourseList = ({ pList }) => {
    // const coursemap = new CourseMap()

    // coursemap.register('张筱迪音感养成计划', 'https://www.bilibili.com/cheese/play/ss62430?bsource=link_copy')
    // coursemap.register('视唱练耳-音程听辨教程-于宛平', 'https://www.bilibili.com/cheese/play/ss5357?bsource=link_copy')
    // coursemap.register('钢琴奶奶：国家一级演奏员教你弹琴', 'https://www.bilibili.com/cheese/play/ss64487?bsource=link_copy')
    // coursemap.register('bass clef', 'https://www.notationtraining.com/bass-clef-practice')
    // coursemap.register('treble clef', 'https://www.notationtraining.com/treble-clef-practice')
    // coursemap.register('obsidian 笔记', 'obsidian://open?vault=Documents&file=Markdown%20Notes%2Fblender_python')
    // coursemap.register('ios obsidian', 'obsidian://open?vault=Markdown%20Notes&file=blender_python')
    // coursemap.register('pdf note', 'obsidian://open?vault=Markdown%20Notes&file=Obsidian%20Test.pdf')
    
    // return (
    //     <>
    //     {coursemap.iterate((obj) => (<CourseView pCourse={obj}/>))}
    //     </>
    // )

    const [pinList, setPinList] = useState(pList)

    useEffect(() => {
        setPinList(pList)
    }, [pList])

    return (
        <>
        {pinList.map(pin => (<CourseView pCourse={pin} />))}
        </>
    )

}

const CourseView = ({ pCourse }) => {
    return (
        <div>
            <a href={pCourse.url} target="_blank">
                {pCourse.name}
            </a>
        </div>
    )
}

export default CourseManager;