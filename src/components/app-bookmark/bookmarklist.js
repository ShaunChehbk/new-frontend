import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import Endpoint from "../../api/api";
const BookmarkList = () => {
    const { auth } = useAuth();
    const [success, setSuccess] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    useEffect(() => {
        const getBookmarks = async () => {
            try {
                const response = await axiosPrivate.get(Endpoint.get_bookmarks);
                setBookmarks(response.data.reverse());
                setSuccess(true);
            } catch (err) {
                console.log(err);
            }
        }
        if (auth?.accessToken) {
            getBookmarks();
        }
    }, [auth]);
    
    useEffect(() => {
        console.log(bookmarks);
    }, [bookmarks]);

    return (
        <>
        <div>
            BookmarkList
        </div>
        <div>
            {bookmarks.map((bookmark, pos) => {
                // 在{}记得return 
                return (
                    <div key={pos}>
                        {bookmark.title}
                    </div>
                )
            })}
        </div>
        </>
    )
};

export default BookmarkList;