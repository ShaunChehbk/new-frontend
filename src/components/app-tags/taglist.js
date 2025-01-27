import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import Endpoint from "../../api/api";
import { subscribe } from "../../events/eventTools";
import '../app-bookmark/bookmark.css'

const TagList = () => {
    const [selectedTags, setSelectedTags] = useState([])
    const [tags, setTags] = useState([])
    const axiosPrivate  = useAxiosPrivate()

    const [bookmarks, setBookmarks] = useState([])

    const getAllTags = async () => {
        const response = await axiosPrivate.get(Endpoint.getAllTags())
        console.log(response.data)
        setTags(response.data)
    }

    const clickTag = (id) => {
        if (selectedTags.includes(id)) {
            setSelectedTags(prev => prev.filter(idx => idx !== id))
        } else {
            setSelectedTags(prev => [...prev, id])
        }
        console.log(selectedTags)
    }

    const getBookmarksWithTags = async () => {
        
        const data = {
            tags: selectedTags
        }
        const response = await axiosPrivate.post(Endpoint.getBookmarksWithTags(), data)
        // console.log(response.data)
        setBookmarks(response.data.sort((bookmark1, bookmark2) => (bookmark2.id - bookmark1.id)))
    }

    useEffect(() => {
        getAllTags()
    }, [])

    useEffect(() => {
        console.log('bookmarks changed')
        getBookmarksWithTags()
    }, [selectedTags])

    return (
        <div>
            <div className="tag-group">
            {
                tags.map((tag, idx) => {
                    return <a className={selectedTags.includes(tag.id) ? "selected-tag" : "tag"} key={idx} onClick={ (e) => clickTag(tag.id)}>{tag.title}</a>
                })
            }
            </div>
            <div>
                {bookmarks.map((bookmark) => {
                    return <Bookmark
                        bookmark={bookmark}
                    />
                })}
            </div>
        </div>
    )
}

const Bookmark = ({ bookmark, idx, clickEdit, clickDelete }) => {
    const navigate = useNavigate();
    const [visited, setVisited] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const getTitle = async () => {
        const url = bookmark.url;
        fetch(url, {mode: 'cors'})
        .then(data => {return data.json()})
        .then(res => console.log(res))
    }
    const selfDelete = async (idx) => {
        try {
            const response = await axiosPrivate.delete(Endpoint.delete(idx))
        } catch (err) {
            console.log(err)
        }

    }
    return (
        <div className={visited ? "bookmark-title-visited" : "bookmark-title"} key={idx} bookmark-id={bookmark.id}>
            <a href={bookmark.url} target="_blank">
                {bookmark.title}
            </a>
        </div>
    )
}

export default TagList;