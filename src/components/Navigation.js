import { Link, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";
import RefreshToken from "./RefreshToken";

const Navigation = () => {
    const { auth, setAuth } = useContext(AuthContext);

    return (
        <>
        <h1>Home</h1>
        <RefreshToken />
        </>
    )
}