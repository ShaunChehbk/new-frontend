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

const Home = () => {
    return (
        <Routes>
            <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
                <Route path="/" element={<Navigation />} >
                    <Route path="ilets" element={<RatePanel />} />
                    <Route path="Bookmark" element={<BookmarkList />} />
                    <Route path="TagList" element={<TagList />} />
                    <Route path="NoteList" element={<NoteManager/>} />
                    <Route path="EditBookmark/:id" element={<EditBookmark />} />
                    <Route path="ProjectMgr" element={<ProjectMgr />} />
                    <Route path="Playground" element={<PlayGround />} />
                    <Route path="Playground2" element={<PlayGround2 />} />
                    <Route path="Dictionary" element={<SentencePanel />} />
                    <Route path="Review" element={<WordPanel />} />
                    <Route path="GameCfg" element={<CfgMgr />} />
                    <Route path="Record" element={<RecordMgr />} />
                </Route>
            </Route>
            </Route>
            <Route path="*" element={<Notfound />} />
        </Routes>
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

export default Home;