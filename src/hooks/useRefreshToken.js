import axios, { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";
import Endpoint from "../api/api";
import { publish } from "../events/eventTools";
import { useEffect } from "react";

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();
    
    // var lastCall = new Date().valueOf()
    var lastCall = null
    
    const refresh = async () => {
        console.log("doing refresh()")
        const current = new Date().valueOf()
        // console.log(lastCall, current)
        console.log(current - lastCall)
        if (current - lastCall < 1000) {
            console.log("recently refreshed, directly return")
            console.log(auth)
            return auth.accessToken
        } 
        lastCall = current
        // console.log(`refresh count : ${count}`)
        const refresh = JSON.parse(
            localStorage.getItem("refreshToken")
        );
        // const refresh = "test"
        const body = JSON.stringify({ refresh });
        console.log(`refresh ${refresh}`)
        try {

            const response = await axios.post(
                Endpoint.refresh_token,
                body,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            /*
            localStorage.setItem(
                "refreshToken", 
                JSON.stringify(response.data.refresh)
                );
                */
               console.log('refresh response')
               console.log(response)
               //    if (response.status === 401){
                //     setAuth(null)
                //    }
                console.log(response.data)
                const accessToken = response.data.access;
                const refreshToken = response.data.refresh;
                console.log('set accessToken with: ', accessToken)
                setAuth(prev => ({...prev, accessToken}));
                localStorage.setItem(
                    "refreshToken",
                    JSON.stringify(refreshToken)
                );
                // doIntercept()
                return accessToken
        } catch (err) {
            console.log(err)
            setAuth({})
        }
    }

    // const doIntercept = () => {
    //     const requestIntercept = axiosPrivate.interceptors.request.use(
    //         config => {
    //             // console.log(config)
    //             if (!config.headers['Authorization']) {
    //                 config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
    //             }
    //             return config;
    //         }, (error) => Promise.reject(error)
    //     );
    //     publish("axiosReady", {})
    //     const responseIntercept = axiosPrivate.interceptors.response.use(
    //         response => response,
    //         async (error) => {
    //             const prevRequest = error?.config;
    //             if (error?.response?.status === 401 && !prevRequest?.sent) {
    //                 prevRequest.sent = true;
    //                 const newAccessToken = await refresh();
    //                 prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
    //                 return axiosPrivate(prevRequest);
    //             }
    //             return Promise.reject(error);
    //         }
    //     );
    // }

    return refresh;
}

export default useRefreshToken;