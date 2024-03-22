/*
 * 为什么不用JSON呢？因为JSON不支持注释，以及无法进行变量拼接
 */
class Endpoint {
    static base_url = "http://114.132.88.206:8000/";
    static login = "api/token/";
    static refresh_token = "api/token/refresh/";
    static get_bookmarks = "AppBookmark/getBookmarks";
    static get_checkins = "AppProjectMgr/getCheckins";
    static add_checkin = "AppProjectMgr/addCheckin";
    static add_task = "/AppProjectMgr/addTask";
}

export default Endpoint;