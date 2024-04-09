import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import Endpoint from "../../api/api";
import { EditOverlay } from "./editbookmark";
import "./bookmark.css"

const BookmarkList = () => {
    const { auth } = useAuth();
    const [success, setSuccess] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [response, setResponse] = useState("")
    const [editing, setEditing] = useState(false);
    const [currentBookmark, setCurrentBookmark] = useState();

    const openEdit = (id) => {
        setEditing(true)
        setCurrentBookmark(id);
    }

    const closeEdit = () => {
        setEditing(false)
    }

    useEffect(() => {
        const getBookmarks = async () => {
            try {
                const response = await axiosPrivate.get(Endpoint.get_bookmarks);
                setBookmarks(response.data);
                setSuccess(true);
                setResponse("Success");
            } catch (err) {
                console.log(err);
                setResponse("Fail")
            }
        }
        if (auth?.accessToken) {
            getBookmarks();
        }
    }, [auth]);

    return (
        <>
            <div>
                BookmarkList
            </div>
            <div>
                {response}
                {bookmarks.length}
            </div>
            <div>
                {bookmarks.map((bookmark, idx) => {
                    // 在{}记得return 
                    return <Bookmark
                        bookmark={bookmark}
                        idx={idx}
                        clickEdit={openEdit}
                    />
                })}
            </div>
            {
            editing
            ? <EditOverlay bookmarkId={currentBookmark} closeEdit={closeEdit}/>
            // 如果在currentBookmark没更新的时候，editing就被更新了，如何解决？
            : <></>
            }
        </>
    )
};

const Bookmark = ({ bookmark, idx, clickEdit }) => {
    const navigate = useNavigate();
    const [visited, setVisited] = useState(false);
    return (
        <div className={visited ? "bookmark-title-visited" : "bookmark-title"} key={idx}>
            <a href={bookmark.url} target="_blank">
                {bookmark.title}
                {bookmark.checkins.length}
            </a>
            <TagPanel
                tags={bookmark.tags}
            />
            <button
            // onClick={e => navigate(`/EditBookmark/${bookmark.id}`)}
            onClick={e => {setVisited(true); clickEdit(bookmark.id)}}
            >
            Edit
            </button>
        </div>
    )
}

const TagPanel = ({ tags }) => {
    return (
        <div>
            {tags.length}
        </div>
    )
}

export default BookmarkList;