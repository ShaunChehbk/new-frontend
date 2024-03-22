import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import BookmarkList from "./components/app-bookmark/bookmarklist";
import Navigation from "./components/Navigation";
import ProjectMgr from "./components/app-projectmgr/projectmgr";
import PlayGround from "./components/playground/draw-box";
import "./Home.css"
import PlayGround2 from "./components/playground/2";

const Home = () => {
    return (
        <Routes>
            <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
                <Route path="/" element={<Navigation />} >
                    <Route path="Bookmark" element={<BookmarkList />} />
                    <Route path="ProjectMgr" element={<ProjectMgr />} />
                    <Route path="Playground" element={<PlayGround />} />
                    <Route path="Playground2" element={<PlayGround2 />} />
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