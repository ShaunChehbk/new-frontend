import { useContext } from "react";

import AuthContext from "../context/AuthProvider";

const useAuth = () => {
    return useAuth(AuthContext);
}

export default useAuth;