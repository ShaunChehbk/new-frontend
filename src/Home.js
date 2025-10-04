import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import BookmarkList from "./components/app-bookmark/bookmarklist";
import Navigation from "./components/Navigation";
import ProjectMgr from "./components/app-projectmgr/projectmgr";
import PlayGround from "./components/playground/draw-box";
import "./Home.css"
import PlayGround2 from "./components/playground/2";
import EditBookmark from "./components/app-bookmark/editbookmark";
import CfgMgr from "./components/app-gamecfg/GameCfg";
import SentencePanel from "./components/app-dictionary/SentencePanel";
import WordPanel from "./components/app-dictionary/WordPanel";
import RecordMgr from "./components/app-record/RecordMgr";
import RatePanel from "./components/app-ilets/RateList";
import TagList from "./components/app-tags/taglist";
import NoteManager from "./components/app-note/note-manager";
import ActivityManager from "./components/app-activity/ActivityManager";
import ThoughtManager from "./components/app-tought/ThoughtManager";
import TaskManager from "./components/app-projectmgr/TaskManager";
// import ThreadManager from "./components/app-activity/ThreadManager";
import Container from "./components/app-activity/Container";
import DistractionManager from "./components/app-activity/Distraction";
import ContactManager from "./components/app-activity/ContactManager";
import ActionManager from "./components/app-activity/ActionManager";
import SchedulerManager from "./components/app-scheduler/create";
import EventManager from "./components/app-scheduler/EventManager";
import DraftManager from "./components/app-draft/draft";
import HiraganaManager from "./components/app-review/Hiragana";
import KatakanaManager from "./components/app-review/Katakana";
import { createContext, useContext, useEffect, useState } from "react";
import ThreadManager from "./components/app-scheduler/ThreadManager";
import CourseManager from "./components/app-courses/CourseManager";
import UserAgent from "./Test";

const NaviContext = createContext({})

const Home = () => {
    const [done, setDone] = useState(false)
    // const routes = new Map()
    const routes = []
    const register = (path, comp, name) => {
        routes.push({ path, comp, name })
    }

    // const [routes, setRoutes] = useState([])

    // const maps = new Map()

    // const maps = new Map()
    // const register = (name, component) => {
    //     maps.set(name, component)
    // }
    register('Courses', <CourseManager />, 'Courses');
    register('Scheduler', <SchedulerManager />, 'Scheduler');
    register('Katakana', <KatakanaManager />, 'Katakana');
    register('Hiragana', <HiraganaManager />, 'Hiragana');
    register('Event', <EventManager />, 'Event');
    register('Thread', <ThreadManager />, 'Thread');
    register('NoteList', <NoteManager />, 'Notes');
    register('Bookmark', <BookmarkList />, 'Bookmarks');
    register('TagList', <TagList />, 'TagList');




    useEffect(() => {
        // register('Draft', DraftManager);
        // register('Katakana', <KatakanaManager />);
        // register('Hiragana', <HiraganaManager />);
        // routes.forEach((value, key) => {
        //     console.log('routes', key)
        //     return <Route path={key} element={value} />
        // })
        // const maps = new Map()
        // const register = (name, component) => {
        //     maps.set(name, component)
        // }
        // register('Katakana', <KatakanaManager />);
        // register('Hiragana', <HiraganaManager />);
        // setRoutes(maps)
        setDone(true)
    }, [])

    if (!done) { 
        console.log('route not ready')
        return <>Route not ready</>
    }



    return (
        <NaviContext.Provider value={{ routes }}>
            <Routes>
                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth />}>
                        <Route path="/" element={<Navigation />} >
                            {/* <Route path="Draft" element={<DraftManager />} />
                    <Route path="Scheduler" element={<SchedulerManager />} />
                    <Route path="Event" element={<EventManager />} />
                    <Route path="Contact" element={<ContactManager />} />
                    <Route path="Action" element={<ActionManager />} />
                    <Route path="Distraction" element={<DistractionManager />} />
                    <Route path="Thought" element={<ThoughtManager />} />
                    <Route path="Bookmark" element={<BookmarkList />} />
                    <Route path="TagList" element={<TagList />} />
                    <Route path="Activity" element={<ActivityManager />} />
                    <Route path="ProjectMgr" element={<ThreadManager />} />
                    <Route path="NoteList" element={<NoteManager/>} />
                    <Route path="ilets" element={<RatePanel />} />
                    <Route path="EditBookmark/:id" element={<EditBookmark />} />
                    <Route path="Playground" element={<PlayGround />} />
                    <Route path="Playground2" element={<PlayGround2 />} />
                    <Route path="Dictionary" element={<SentencePanel />} />
                    <Route path="Review" element={<WordPanel />} />
                    <Route path="GameCfg" element={<CfgMgr />} />
                    <Route path="Record" element={<RecordMgr />} />
                    <Route path="Hiragana" element={<HiraganaManager />} />
                    <Route path="Katakana" element={<KatakanaManager />} /> */}
                    {/* {console.log(maps)} */}
                            {/* {maps.forEach((value, key) => (
                                <Route path="Katakana" element={value} />
                            ))} */}
                            {/* {maps.keys().map(key => {
                                console.log(key)
                                console.log(maps.get(key))
                                return <Route path={`${key}`} element={maps.get(key)} />
                            })} */}
                            {/* {routes.forEach((obj) => {
                                console.log(obj)
                                return <Route path={obj.path} element={obj.comp} />
                            })} */}
                            {routes.map(({ path, comp}) => (
                            // {routes.map(({ path, comp}) => (
                                <Route path={path} element={comp} />
                            ))}


                            {/* <Route path="ProjectMgr" element={<Container pComponent={ThreadManager}/>} /> */}
                        </Route>
                    </Route>
                </Route>
                <Route path="*" element={<Notfound />} />
            </Routes>
        </NaviContext.Provider>
    )
}

const LoggedIn = () => {
    return (
        <div>
            Logged
        </div>
    )
}

const Notfound = () => {
    return (
        <div>
            Not Found.
        </div>
    )
}

const useNaviTabs = () => {
    return useContext(NaviContext).routes
}
export { useNaviTabs }
export default Home;