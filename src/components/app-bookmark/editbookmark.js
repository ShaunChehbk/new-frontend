import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useParams } from "react-router-dom"
import Endpoint from "../../api/api";
import { axiosPrivate } from "../../api/axios";
import { CreateTag } from "./tagmgr";
import { publish } from "../../events/eventTools";

const EditBookmark = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [bookmark, setBookmark] = useState();
    const [tags, setTags] = useState([]);
    const [neighbour, setNeighbour] = useState();
    const [creatingTag, setCreatingTag] = useState(false);

    const removeSelectedTag = async (idx) => {
        try {
            // 这里出现过错误：tags[idx]导致查询删除失败
            const response = await axiosPrivate.post(Endpoint.removeTagFor(bookmark.id, bookmark.tags[idx].id))
        } catch (err) {
            console.log(err)
        }

        getDetail();
    }

    const addSelectedTag = async (idx) => {
        console.log(`${idx} add`)

        const data = [tags[idx]]
        console.log(data)
        try {
            const response = await axiosPrivate.post(Endpoint.addTagFor(bookmark.id), data)
        } catch (err) {
            console.log(err)
        }

        getDetail();
    }

    const getNeightbour = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getNeighbourOf(bookmark.id))
            setNeighbour(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const getTags = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getTags());
            setTags(response.data)
        } catch (err) {
            console.log(err);
        }
    }

    const getDetail = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.editBookmark(id));
            setBookmark(response.data)
        } catch (err) {
            console.log(err);
        }
    }

    const Previous = () => {
        navigate(`/EditBookmark/${neighbour.previous}`)
    }

    const Next = () => {
        navigate(`/EditBookmark/${neighbour.next}`)
    }

    useEffect(() => {
        if (auth?.accessToken) {
            getDetail();
            getTags();
        }
        
    }, [auth, id]);

    useEffect(() => {
        getNeightbour()
        // 键盘导航 buggy
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    Previous();
                    break;
                case 'ArrowRight':
                    Next();
                    break;
            }
        }
        // 如果neighbour被获取到了，就注册，否则会出现undefined
        if (neighbour) {
            document.addEventListener('keydown', handleKeyDown, true);
            return () => {
                document.removeEventListener('keydown', handleKeyDown)
            }
        }
    }, [bookmark]);
    return (
        <>
        {
        bookmark
        ? <div>
            <h3><a href={bookmark.url}>{bookmark.title}</a></h3><br />
            {bookmark.id}<br />
            {
            bookmark.tags.map((tag, idx) => {
                return <a className="tag" key={idx} onClick={e => removeSelectedTag(idx)}>{tag.title}</a>
            })
            }
            <br />

            <hr />
            <div className="tag-group">
            {
                tags.map((tag, idx) => {
                    return <a className="tag" key={idx} onClick={e => addSelectedTag(idx)}>{tag.title}</a>
                })
            }
            </div>
        </div>
        : <div>
            Loading
        </div>
        }
        <button onClick={e => setCreatingTag(!creatingTag)}>New Tag</button>
        {
        creatingTag
        ? <CreateTag afterCreate={getTags}/>
        : <></>
        }
        {
        neighbour
        ? <div className="button-block">
            {neighbour.previous ? <button className="left-btn" onClick={Previous}>previous</button> : <></>}
            {neighbour.next ? <button className="right-btn" onClick={Next}>next</button> : <></>}
        </div>
        : <>Loading neighbour</>
        }
        {/* <iframe src={bookmark.url}></iframe> */}
        </>
    )

}

export const EditOverlay = ({ bookmarkId, closeEdit }) => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [bookmark, setBookmark] = useState();
    const [tags, setTags] = useState([]);
    const [creatingTag, setCreatingTag] = useState(false)

    const updateTags = (tags) => {
        const sortedTags = tags.sort((tag1, tag2) => {
            const dis1 = tag1.title.charCodeAt() - '0'.charCodeAt()
            const dis2 = tag2.title.charCodeAt() - '0'.charCodeAt()
            return dis1 - dis2
        })
        setTags(sortedTags)
    }

    const getTags = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getTags());
            updateTags(response.data)
        } catch (err) {
            console.log(err);
        }
    }

    const getDetail = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.editBookmark(bookmarkId));
            setBookmark(response.data)
        } catch (err) {
            console.log(err);
        }
    }

    const removeSelectedTag = async (idx) => {
        try {
            // 这里出现过错误：tags[idx]导致查询删除失败
            const response = await axiosPrivate.post(Endpoint.removeTagFor(bookmark.id, bookmark.tags[idx].id))
        } catch (err) {
            console.log(err)
        }

        getDetail();
    }

    const addSelectedTag = async (idx) => {
        console.log(`${idx} add`)

        const data = [tags[idx]]
        console.log(data)
        try {
            const response = await axiosPrivate.post(Endpoint.addTagFor(bookmark.id), data)
        } catch (err) {
            console.log(err)
        }

        getDetail();
    }

    const onTitleChange = (e) => {
        setBookmark((prev) => ({...prev, title: e.target.value}))
    }

    const commit = async () => {
        const data = {title: bookmark.title, url: bookmark.url}
        try {
            const response = await axiosPrivate.post(Endpoint.update(bookmarkId), data)
        } catch (err) {
            console.log(err)
        }
        publish("onBookmarkTitleChanged", { id: bookmarkId, title: bookmark.title })
    }

    const deleteClick = (idx) => {
        console.log(idx)
        publish("onBookmarkDeleted", { id: idx })
    }

    useEffect(() => {
        if (auth?.accessToken) {
            getDetail();
            getTags();
        }
    }, [auth, bookmarkId])

    const handleEscapeKey = (e) => {
        console.log(e)
        if (e.code === 'Escape') { closeEdit() }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleEscapeKey)

        // return document.removeEventListener("keydown", handleEscapeKey)
        return () => document.removeEventListener("keydown", handleEscapeKey)
    }, [])

    return (
        <div className="edit-overlay">
            <div className="edit-bookmark-form">
                {/* <button onClick={closeEdit}>close</button> */}
                {
                bookmark
                ? <div>
                    <a href={bookmark.url} target="_blank">{bookmark.title}</a>
                    <br/>
                    <input value={bookmark.title} onChange={onTitleChange} />
                    <div>{bookmark.url}</div>
                    <button onClick={commit}>
                        commit
                    </button>
                    {
                    bookmark.tags.map((tag, idx) => {
                        return <a className="tag" key={idx} onClick={e => removeSelectedTag(idx)}>{tag.title}</a>
                    })
                    }
                    <br />
                    <hr />
                    <div className="tag-group">
                    {
                    tags.map((tag, idx) => {
                        return <a className="tag" key={idx} onClick={e => addSelectedTag(idx)}>{tag.title}</a>
                    })
                    }
                    </div>
                </div>
                : <div>
                    Loading
                </div>
                }
                <button onClick={e => setCreatingTag(!creatingTag)}>New Tag</button>
                {
                creatingTag
                ? <CreateTag afterCreate={getTags} />
                : <></>
                }        
                <br/>
                <div style={{border: "1px solid", height: "150px"}} onClick={closeEdit}></div>
                <br/>
                <button
                    onClick={ (e) => deleteClick(bookmark.id)}
                >
                    delete
                </button>
            </div>
        </div>
    )

}

export default EditBookmark;