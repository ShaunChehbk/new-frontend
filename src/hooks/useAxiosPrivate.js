import axios, { axiosPrivate } from "../api/axios";
import { useEffect, useLayoutEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { publish } from "../events/eventTools";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    // useEffect() 会导致刷新后无法加载
    useEffect(() =>{
    // useLayoutEffect(() => {
        // console.log('do intercept with auth: ', auth)
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                // console.log(config)
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                console.log(error)
                const prevRequest = error?.config;
                console.log(prevRequest?.sent)
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    console.log('axios refres token')
                    const newAccessToken = await refresh();
                    console.log(newAccessToken)
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                console.log('return response error')
                return Promise.reject(error);
            }
        );

        // if (auth) {
        //     console.log('axiosPrivate is ready')
        //     publish("axiosReady", {})
        // }

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth]);
    // }, [auth, refresh]);

    return axiosPrivate;
}

export default useAxiosPrivate;