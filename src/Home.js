import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";

const Home = () => {
    return (
        <Routes>
            <Route element={ <RequireAuth /> }>
                <Route path="/" element={ <LoggedIn /> } />
            </Route>
            <Route path="*" element={ <Notfound /> } />
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