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
    static add_task = "AppProjectMgr/addTask";
    static edit_bookmark = "AppBookmark/getDetail/"
    static get_recent_tags = "AppBookmark/getRecentTags"
    static add_tags_for = "AppBookmark/addTags/"
    static get_neighbour = "AppBookmark/getNeighbour/"
    static AppGameCfg = "AppGameCfg/"
    static AppDictionary = "AppDictionary/"

    static editBookmark(id) {
        return this.base_url + this.edit_bookmark + id;
    }

    static getTags() {
        return this.base_url + this.get_recent_tags;
    }

    static addTagFor(id) {
        return this.base_url + this.add_tags_for + id;
    }

    static getNeighbourOf(id) {
        return this.base_url + this.get_neighbour + id;
    }
    static removeTagFor(bookmark_id, tag_id) {
        console.log(bookmark_id)
        console.log(tag_id)
        return this.base_url + "AppBookmark/" + bookmark_id + "/removeTag/" + tag_id
    }

    static createTag(tag_title) {
        return this.base_url + "AppBookmark/createTag/" + tag_title
    }

    static getGames() {
        return this.base_url + this.AppGameCfg + "getAllGame"
    }

    static getCfgsOf(id) {
        return this.base_url + this.AppGameCfg + "getCfgOf/" + id;
    }

    static addCfgFor(id) {
        return this.base_url + this.AppGameCfg + "addCfg/" + id;
    }

    static getAllSentence() {
        return this.base_url + this.AppDictionary + "getAllSentence"
    }

    static addWord() {
        return this.base_url + this.AppDictionary + "addExample"
    }
}

export default Endpoint;