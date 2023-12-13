import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Login from "./Login";

const RequireAuth = () => {
    const { auth } = useAuth();

    useEffect(() => {
        console.log(auth);
    }, [auth]);

    return (
        auth?.accessToken
        ? <Outlet />
        : (
            <>
            <h1>Please Login</h1>
            <Login />
            </>
        )
    )
}

export default RequireAuth;