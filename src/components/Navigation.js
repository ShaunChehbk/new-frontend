import { Link, Outlet } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { createContext } from "react";
import { useLayoutEffect } from "react";
import AuthContext from "../context/AuthProvider";
import ContainerHeightContext from "../context/ContainerHeightProvider";
import RefreshToken from "./RefreshToken";
import TimerManager from "./app-scheduler/TimerManager";


import KatakanaManager from "./app-review/Katakana";
import { useNaviTabs } from "../Home";


const Navigation = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const { setContainerHeight} = useContext(ContainerHeightContext)
    const containerRef = useRef()
    const headerContainerRef = useRef()
    const headerRef = useRef()
    const timerRef = useRef()

    const routes = useNaviTabs()


    useLayoutEffect(() => {
        const windowHeight = window.innerHeight
        const headerHeight = headerRef.current.scrollHeight
        const timerHeight = timerRef.current.scrollHeight
        // console.log(`headerHeight: ${headerHeight}`)
        const containerHeight = windowHeight-headerHeight-timerHeight
        headerContainerRef.current.style.height=headerHeight+timerHeight
        
        headerRef.current.style.overflowX="scroll"
        containerRef.current.style.height=`${containerHeight}px`
        containerRef.current.style.overflowY="scroll"
        setContainerHeight(containerHeight)
    }, [])

    return (
        <>
        {/* <RefreshToken /> */}
        <div ref={headerContainerRef} style={{whiteSpace: "nowrap"}}>
            <div ref={headerRef}>
            {routes.map((obj, idx) => {
                return (<Link to={`/${obj.path}`} className={"home-navigation"}>{obj.name}</Link>)
            })}
            {/* <Link to="/Scheduler" className="home-navigation">Create</Link>
            <Link to="/Hiragana" className="home-navigation">Hiragana</Link>
            <Link to="/Katakana" className="home-navigation">Katakana</Link>
            <Link to="/Event" className="home-navigation">Events</Link>
            <Link to="/NoteList" className="home-navigation">NoteList</Link>
            <Link to="/Bookmark" className="home-navigation">Bookmark</Link>
            <Link to="/TagList" className="home-navigation">TagList</Link>
            <Link to="/Draft" className="home-navigation">Draft</Link>
            <Link to="/Distraction" className="home-navigation">Distraction</Link>
            <Link to="/Action" className="home-navigation">Action</Link>
            <Link to="/ProjectMgr" className="home-navigation">Activity</Link>
            <Link to="/Activity" className="home-navigation">Task</Link>
            <Link to="/Thought" className="home-navigation">Thought</Link>
            <Link to="/Contact" className="home-navigation">Contact</Link>
            <Link to="/Record" className="home-navigation">Record</Link>
            <Link to="/ilets" className="home-navigation">ILETS</Link>
            <Link to="/Review" className="home-navigation">Review</Link>
            <Link to="/Dictionary" className="home-navigation">Dictionary</Link>
            <Link to="/GameCfg" className="home-navigation">GameCfg</Link>
            <Link to="/Playground" className="home-navigation">Playground</Link>
            <Link to="/Playground2" className="home-navigation">PlayGround2</Link> */}
            </div>
            <div ref={timerRef}>
            <TimerManager />
            </div>
        </div>
        <div ref={containerRef}>
            <Outlet />
        </div>
        </>
    )
}

export default Navigation;