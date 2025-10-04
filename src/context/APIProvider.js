import { createContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect, useLayoutEffect, useContext } from "react";
import Endpoint from "../api/api";
import useAuth from "../hooks/useAuth";
import { resolvePath } from "react-router-dom";

export const handleError = (err) => { console.log(err) }

const APIContext = createContext({})

export const APIProvider = ({ children }) => {
    const axiosPrivate = useAxiosPrivate()
    const {auth} = useAuth()
    const [apiIsReady, setApiIsReady] = useState(false)
    const [endpoint, setEndpoint] = useState({})
    const requestMap = new Map()

    const dumpCall = (data) => {
        return new Promise((handleFulfill, handleError) => {
            handleFulfill(data)
        })
    }

    const processParams = (url, params) => {
        const paths = url.split('#')
        if (paths.length == 1) { return url }
        if (paths.length !== (params.length + 1)) {
            console.log(paths, params)
            throw new Error(`${params}数量与${paths}不符`)
        }
        var i,
        l = Math.min(paths.length, params.length),
        temp = '';
        for( i = 0; i < l; i++) {
            temp += paths[i] + params[i];
        }
        return temp + paths.slice(i) + params.slice(i);
    }

    const useRequest = (name) => {
        if (requestMap.has(name)) {
            return requestMap.get(name)
        } else {
            throw new Error(`${name}尚未被实现`)
        }
    }

    const setRequest = (name, func) => {
        if (requestMap.has(name)) {
            throw new Error(`${name}已经存在`)
        } else {
            requestMap.set(name, func)
        }
    }

    const fetchAllApi = (resolve, reject) => {
        console.log("fetchAllApi")
        axiosPrivate.get(Endpoint.getAllApi())
            .then(resolve)
            .catch(reject)
    }

    const generateAPI = (response) => {
        const list = response.data
        const endpoint = {}
        list.map((api, idx) => {
            endpoint[api.name] = api.url.replace(/(<[a-zA-Z]+\:[a-zA-z]+_*[a-zA-Z]+>)/g, '#')
        })
        console.log(endpoint)
        setEndpoint(endpoint)
        setApiIsReady(true)
    }

    useEffect(() => {
        console.log('auth', auth)
        if (auth) {
            fetchAllApi(generateAPI, handleError)
        }
    }, [auth])

    if (!apiIsReady) {
        return <div>API is not ready</div>
    }

    setRequest('fetchDistraction', (fulfillSender, errorSender) => {
        axiosPrivate.get(Endpoint.getAllDistraction())
        .then(fulfillSender)
        .catch(errorSender)
    })

    setRequest('getAllEvent', (handleFulfill, handleError) => {
        axiosPrivate.get(Endpoint.getAllEvent(), {data: "test"})
            .then(handleFulfill)
            .catch(handleError)
    })

    setRequest('addNewDistraction', (data, handleFulfill, handleError) => {
        axiosPrivate.post(Endpoint.addNewDistraction(), data)
            .then(handleFulfill)
            .catch(handleError)
    })

    setRequest('getAllThread', (handleFulfill, handleError) => {
        axiosPrivate.get(Endpoint.getAllThread())
            .then(handleFulfill)
            .catch(handleError)
    })

    setRequest('addNewContact', (data, handleFulfill, handleError) => {
        axiosPrivate.post(endpoint.addNewContact, data)
        // dumpCall({"id": "114514", "content": "test"})
            .then(handleFulfill)
            .catch(handleError)
        // return new Promise((handleFulfill, handleError) => {
        //     handleFulfill()
        // })
    })

    setRequest('getAllContact', (handleFulfill, handleError) => {
        axiosPrivate.get(endpoint.getAllContact)
            .then(handleFulfill)
            .catch(handleError)
    })

    setRequest('getAllAction', (handleFulfill, handleError) => {
        axiosPrivate.get(endpoint.getAllAction)
            .then(handleFulfill)
            .catch(handleError)
    })

    setRequest('setIsActionOfActivity', (params, data, resolve, reject) => {
        axiosPrivate.post(processParams(endpoint.setIsActionOfActivity, params), data)
            .then(resolve)
            .catch(reject)
    })

    setRequest('createActivity', (params, data, resolve, reject) => {
        axiosPrivate.post(processParams(endpoint.SchedulercCreateActivity, params), data)
            .then(resolve)
            .catch(reject)
    })

    setRequest('createDistraction', (params, data, resolve, reject) => {
        axiosPrivate.post(processParams(endpoint.SchedulerCreateDistraction, params), data)
            .then(resolve)
            .catch(reject)
    })

    setRequest('createContact', (params, data, resolve, reject) => {
        axiosPrivate.post(processParams(endpoint.SchedulerCreateContact, params), data)
            .then(resolve)
            .catch(reject)
    })

    setRequest('createAction', (params, data, resolve, reject) => {
        axiosPrivate.post(processParams(endpoint.SchedulerCreateAction, params), data)
            .then(resolve)
            .catch(reject)
    })

    setRequest('SchedulerGetAllEvent', (resolve, reject) => {
        axiosPrivate.get(endpoint.SchedulerGetAllEvent)
            .then(resolve)
            .catch(reject)
    })

    setRequest('createThought', (params, data, resolve, reject) => {
        axiosPrivate.post(processParams(endpoint.SchedulerCreateThought, params), data)
            .then(resolve)
            .catch(reject)
    })

    setRequest('createIntention', (params, data, resolve, reject) => {
        axiosPrivate.post(processParams(endpoint.SchedulerCreateIntention, params), data)
            .then(resolve)
            .catch(reject)
    })

    setRequest('createNote', (params, data, resolve, reject) => {
        axiosPrivate.post(processParams(endpoint.SchedulerCreateNote, params), data)
            .then(resolve)
            .catch(reject)
    })
    setRequest('getAllDraft', () => {
        return new Promise((resolve, reject) => {
            axiosPrivate.get(endpoint.getAllDraft)
                .then(resolve)
                .catch(reject)
            }
        )
    })

    setRequest('createDraft', (data) => {
        return new Promise((resolve, reject) => {
            axiosPrivate.post(endpoint.createDraft, data)
                .then(resolve)
                .catch(reject)
        })
    })

    setRequest('getAllTimer', () => {
        return new Promise((resolve, reject) => {
            axiosPrivate.get(endpoint.SchedulerGetAllTimer)
                .then(resolve)
                .catch(reject)
        })
    })

    setRequest('createInterval', (params) => {
        return new Promise((resolve, reject) => {
            axiosPrivate.post(processParams(endpoint.SchedulerCreateInterval, params))
                .then(resolve)
                .catch(reject)
        })
    })

    setRequest('stopInterval', (params) => {
        return new Promise((resolve, reject) => {
            axiosPrivate.post(processParams(endpoint.SchedulerStopInterval, params))
                .then(resolve)
                .catch(reject)
        })
    })

    setRequest('getAllThread_', () => {
        return new Promise((resolve, reject) => {
            axiosPrivate.get(endpoint.SchedulerGetAllThread)
                .then(resolve)
                .catch(reject)
        })
    })

    setRequest('setThreadForEvent', (params) => {
        return new Promise((resolve, reject) => {
            axiosPrivate.post(processParams(endpoint.SchedulerSetThreadForEvent, params))
                .then(resolve)
                .catch(reject)
        })
    })

    setRequest('getEventOfThread', (params) => {
        return new Promise((resolve, reject) => {
            axiosPrivate.get(processParams(endpoint.SchedulerGetEventOfThread, params))
                .then(resolve)
                .catch(reject)
        })
    })

    setRequest('getAllPin', () => {
        return axiosPrivate.get(endpoint.GetAllPin)
        // return new Promise((resolve, reject) => {
        //     console.log('resolve:', resolve) 
        //     // resolve: ƒ () { [native code] }
        //     axiosPrivate.get(endpoint.GetAllPin)
        //         .then(resolve)
        //         .catch(reject)
        // })
    })

    setRequest('createNewPin', (data) => {
        return new Promise((resolve, reject) => {
            axiosPrivate.post(endpoint.CreateNewPin, data)
                .then(resolve)
                .catch(reject)
        })
    })

    setRequest('createThread', (data) => {
        return new Promise((resolve, reject) => {
            axiosPrivate.post(endpoint.SchedulerCreateThread, data)
                .then(resolve)
                .catch(reject)
        })
    })

    setRequest('createTimer', (data) => {
        return new Promise((resolve, reject) => {
            axiosPrivate.post(endpoint.SchedulerCreateTimer, data)
                .then(resolve)
                .catch(reject)
        })
    })

    // 天气api测试，随时删掉
    setRequest('testWeather', () => {
        return new Promise((resolve, reject) => {
            axiosPrivate.get('http://114.132.88.206:8001/weather/getWeatherOf/101080501')
                .then(resolve)
                .catch(reject)
        })
    })

    return (
        <APIContext.Provider value={{useRequest}}>
            { children }
        </APIContext.Provider>
    )
}

export const useApiRequest = ( name ) => {
    return useContext(APIContext).useRequest(name)
}

export default APIContext