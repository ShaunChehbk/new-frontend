import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import Endpoint from "../../api/api";
import "./bookmark.css"

const BookmarkList = () => {
    const { auth } = useAuth();
    const [success, setSuccess] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [response, setResponse] = useState("")

    useEffect(() => {
        const getBookmarks = async () => {
            try {
                const response = await axiosPrivate.get(Endpoint.get_bookmarks);
                setBookmarks(response.data.reverse());
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
                    />
                })}
            </div>
        </>
    )
};

const Bookmark = ({bookmark, idx}) => {
    return (
        <div className="bookmark-title" key={idx}>
            <a href={bookmark.url}>
                {bookmark.title}
                {bookmark.checkins.length}
            </a>
        </div>
    ) 
}

export default BookmarkList;