import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import Login from "./Login";
import { APIProvider } from "../context/APIProvider"
import { axiosPrivate } from "../api/axios";


const RequireAuth = () => {
    const { auth } = useAuth();
    const refresh = useRefreshToken();

    console.log('RequireAuth()')
    console.log(auth)

    const doIntercept = () => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                // console.log(config)
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );
        // publish("axiosReady", {})
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    // 表示当前请求已经重新处理过一次
                    // 如果refresh()后请求还是失败，就直接返回，避免死循环
                    prevRequest.sent = true;
                    console.log("interceptor refresh token")
                    const newAccessToken = await refresh();
                    console.log(newAccessToken)
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    console.log("interceptor redo request")
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );
    }

    useEffect(() => {
        doIntercept()
    }, [auth]);

    if (!auth.accessToken) {
        // 每次进入页面，auth都是{}，如果刷新token成功，则不显示登录页面
        return <Login />
    }

    return (
        <APIProvider>
            <Outlet />
        </APIProvider>
    )
}

export default RequireAuth;