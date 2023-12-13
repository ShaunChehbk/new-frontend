import axios from "axios";
import Endpoint from "./api";

export default axios.create({
    baseURL: Endpoint.base_url
})

export const axiosPrivate = axios.create({
    baseURL: Endpoint.base_url
})