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
            console.log(bookmarks);
        }
    }, [auth]);

    return (
        <div>
            BookmarkList
        </div>
    )
};

export default BookmarkList;