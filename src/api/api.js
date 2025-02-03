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

    static getILETSRates() {
        return `${this.base_url}/ilets/getAllRate`
    }

    static update(idx) {
        return `${this.base_url}/AppBookmark/update/${idx}`
    }

    static delete(idx) {
        return `${this.base_url}/AppBookmark/delete/${idx}`
    }

    static getAllTags() {
        return `${this.base_url}/AppBookmark/getAllTags`
    }

    static getBookmarksWithTags() {
        return `${this.base_url}/AppBookmark/getBookmarksWithTags`
    }

    static getNoteListOf(bookmarkId) {
        return `${this.base_url}/AppBookmark/getNoteListOf/${bookmarkId}`
    }

    static getAllNotes() {
        return `${this.base_url}/AppRecord/getNotes`
    }

    static getDetailOfNote(id) {
        return `${this.base_url}/AppRecord/getDetailOfNote/${id}`
    }

    static updateNote(id) {
        return `${this.base_url}/AppRecord/updateNote/${id}`
    }

    static Bookmark = class {
        static namespace = "AppBookmark/"
        static getOrCreate() {
            return Endpoint.base_url + this.namespace + "getOrCreate"
        }
    }

    static Record = class {
        static namespace = `${Endpoint.base_url}AppRecord/`
        static getRequirements() {
            return this.namespace + "getRequirements"
        }
        static getTimeline() {
            return this.namespace + "timeline"
        }
        static getReqiurementDetail(id) {
            return this.namespace + `getDetailOfRequirement/${id}`;
        }
        static createRequirement() {
            return this.namespace + "createRequirement"
        }
        static createKnowledge() {
            return this.namespace + "createKnowledge"
        }
        static createNote() {
            return this.namespace + "createNote"
        }
        static setTextOfKnowledge(id) {
            return this.namespace + `setTextOfKnowledge/${id}`
        }
        static createSolution() {
            return this.namespace + 'createSolution'
        }
        static setRequirementForSolution(solution_id, requirement_id) {
            return this.namespace + `solution/${solution_id}/setRequirement/${requirement_id}`
        }

        static addBookmarkForKnowledge(knowledge_id, bookmark_id) {
            return this.namespace + `knowledge/${knowledge_id}/addBookmark/${bookmark_id}`
        }
    }
}

export default Endpoint;