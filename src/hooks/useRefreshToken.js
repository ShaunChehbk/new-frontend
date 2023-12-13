import axios from "../api/axios";
import useAuth from "./useAuth";
import Endpoint from "../api/api";

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        const refreshToken = JSON.parse(
            localStorage.getItem("refreshToken")
        );
        console.log("refreshToken", refreshToken);
        const response = await axios.post(
            Endpoint.refresh_token,
            { refresh: refreshToken }
        );
        localStorage.setItem(
            "refreshToken", 
            JSON.stringify(response.data.refresh)
        );
        const accessToken = response.data.access;
        setAuth(prev => ({...prev, accessToken}));
    }
    
    return refresh;
}

export default useRefreshToken;