/*
 * 为什么不用JSON呢？因为JSON不支持注释，以及无法进行变量拼接
 */
class Endpoint {
    static base_url = "http://114.132.88.206:8000/";
    static login = "api/token/";
    static refresh_token = "api/token/refresh";
}

export default Endpoint;