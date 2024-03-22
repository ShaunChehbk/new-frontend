import axios from "../api/axios";
import useAuth from "./useAuth";
import Endpoint from "../api/api";

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        const refresh = JSON.parse(
            localStorage.getItem("refreshToken")
        );
        const body = JSON.stringify({ refresh });
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
        console.log("refresh token response", response.data);
        const accessToken = response.data.access;
        setAuth(prev => ({...prev, accessToken}));
    }

    return refresh;
}

export default useRefreshToken;