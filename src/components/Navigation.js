import { Link, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";
import RefreshToken from "./RefreshToken";

const Navigation = () => {
    const { auth, setAuth } = useContext(AuthContext);

    return (
        <>
        <RefreshToken />
        <div
        style={{height:"70px", overflowX: "scroll"}}
        >
            <br />
            <Link to="/Bookmark" className="home-navigation">Bookmark</Link>
            <Link to="/ProjectMgr" className="home-navigation">ProjectMgr</Link>
            <Link to="/GameCfg" className="home-navigation">GameCfg</Link>
            <Link to="/Review" className="home-navigation">Review</Link>
            <Link to="/Dictionary" className="home-navigation">Dictionary</Link>
            <Link to="/Playground" className="home-navigation">Playground</Link>
            <Link to="/Playground2" className="home-navigation">PlayGround2</Link>
        </div>
        <Outlet />
        </>
    )
}

export default Navigation;