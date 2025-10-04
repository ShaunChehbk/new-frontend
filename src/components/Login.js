import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider"
import axios from "../api/axios";
import Endpoint from "../api/api";

const Login = () => {
    const { setAuth } = useContext(AuthContext);


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errmsg, setErrmsg] = useState("");
    const [success, setSuccess] = useState(false);

    const refresh = localStorage.getItem("refreshToken")

    useEffect(() => {
        setErrmsg("");
    }, [username, password]);

    const loginSubmit = async (e) => {
        e.preventDefault();
        console.log(Endpoint.login);
        try {
            const response = await axios.post(
                Endpoint.login,
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.access;
            const refreshToken = response?.data?.refresh;
            setAuth({ username, password, accessToken });
            setUsername("");
            setPassword("");
            setSuccess(true);
            localStorage.setItem(
                "refreshToken",
                JSON.stringify(refreshToken)
            );
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            {
                success ? (
                    <section>
                        <h1>Logged</h1>
                    </section>
                ) : (
                    <>
                    <section>
                        <form onSubmit={ loginSubmit }>
                            <label htmlFor="username">Username::</label>
                            <input
                                type="text"
                                id="username"
                                style={{fontSize: "16px"}}
                                autoComplete="off"
                                onChange={( e ) => setUsername( e.target.value )}
                                value={ username }
                                required
                            />
                            <br/>
                            <label htmlFor="password">Password::</label>
                            <input
                                type="password"
                                id="password"
                                style={{fontSize: "16px"}}
                                onChange={( e ) => setPassword( e.target.value )}
                                value={ password }
                                required
                            />
                            <br/>
                            <button>Sign In</button>
                        </form>
                    </section>
                    </>
                )
            }
        </>
    )
}

export default Login;