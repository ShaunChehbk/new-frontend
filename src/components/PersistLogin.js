import  { Outlet } from "react-router-dom"
import { useState, useEffect, useLayoutEffect } from "react"
import useRefreshToken from "../hooks/useRefreshToken"
import useAuth from "../hooks/useAuth"
import { APIProvider } from "../context/APIProvider"
import { subscribe } from "../events/eventTools"
import { axiosPrivate } from "../api/axios"

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasAuth, setHasAuth] = useState(false)
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const [resp, setResp] = useState("no response")

    useEffect(() => {
    // useLayoutEffect(() => {
        const verifyRefreshToken = async () => {
            console.log('refresh login')
            try {
                const response = await refresh();
                setResp(JSON.stringify(response))
            }
            catch (err) {
                console.error('PersistLogin err: ', err);
            }
            finally {
                setIsLoading(false);
            }
        };

        // subscribe("axiosReady", (e) => {
        //     console.log('auth updated')
        // setHasAuth(auth ? true : false)

        // })

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, []);

    // useEffect(() => {
    //     // console.log(`isLoading ${isLoading}`)
    //     console.log(`aT ${JSON.stringify(auth?.accessToken)}`)

    // }, [isLoading]);

    // useEffect(() => {
    //     // console.log(auth)
    //     if (auth.accessToken) {
    //         setHasAuth(true)
    //         doIntercept()
    //     }
    //     // setIsLoading(auth ? false : true)
    // }, [auth])

    // if (!hasAuth) {
    //     return <div>no auth</div>
    // }
    if (isLoading) { return <>Loading</>}

    return (
        <div id="persist-login">
            <Outlet />
        </div>
    )
}

export default PersistLogin;