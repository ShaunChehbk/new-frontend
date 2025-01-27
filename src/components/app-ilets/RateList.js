import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";

const RatePanel = () => {
    const { auth } = useAuth();
    const [rates, setRates] = useState()
    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        const getRates = async () => {
            try {
                const response = await axiosPrivate.get(Endpoint.getILETSRates())
                console.log(response.data)
            } catch (err) {
                console.log(err)
            }
        }

        if (auth?.accessToken) {
            getRates()
        }
    })
}

const SingleRate = (props) => {
    return (
        <div>
            {props.rate.wordText}
        </div>
    )
}

export default RatePanel