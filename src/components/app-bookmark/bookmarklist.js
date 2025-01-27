import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import Endpoint from "../../api/api";
import { EditOverlay } from "./editbookmark";
import "./bookmark.css"
import { subscribe } from "../../events/eventTools";
import NoteManager from "./note-manager";

const UntaggedBookmarkList = () => {
    const axiosPrivate = useAxiosPrivate()
    const { auth } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);


    const getBookmarks = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.get_bookmarks);
            setBookmarks(response.data);
            console.log('getbookmarks success')
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (auth?.accessToken) {
            getBookmarks();
        }
    }, [])

    console.log(bookmarks.length)

    return (
        <>
        {bookmarks.length === 0 
        ? <div>getting</div>
        : <BookmarkList list={bookmarks}/>
        }
        </>
    )

}

const BookmarkList = ({ list }) => {
    const [renderCount, setRenderCount] = useState(0)
    const [success, setSuccess] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const [bookmarks, setBookmarks] = useState()
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [currentBookmark, setCurrentBookmark] = useState();
    const [shouldShowNoteList, setShouldShowNoteList] = useState(false);


    
    const openEdit = (id) => {
        // 禁止滚动
        document.body.classList.add("remove-scrolling")
        setEditing(true)
        setCurrentBookmark(id);
    }
    
    const closeEdit = () => {
        document.body.classList.remove("remove-scrolling")
        setEditing(false)
    }

    const showNoteList = (id) => {
        setCurrentBookmark(id);
        setShouldShowNoteList(true)
    }

    const closeNoteList = () => {
        setShouldShowNoteList(false)
    }
    
    
    useEffect(() => {
        // 放在外面会导致监听器callback被调用多次
        // document.addEventListener("onBookmarkDeleted", (e) => {
        //     console.log("callback called")
        //     console.log(e)
        // })
        subscribe("onBookmarkDeleted", (e) => {
            console.log('bookmark deleted', e.detail)
            deleteById(e.detail.id)
        })

        subscribe("onBookmarkTitleChanged", (e) => {
            console.log(e.detail)
            updateBookmarkTitle(e.detail.id, e.detail.title)
        })

    }, []);

    const updateBookmarkTitle = (id, title) => {
        // console.log(id, title)

        // 这样写就不行
        // setBookmarks(bookmarks.map(bookmark => {
        setBookmarks(bookmarks => bookmarks.map(bookmark => {
        // setBookmarks(bookmarks => bookmarks.map(bookmark => {
            // return bookmark.id === id ? {...bookmark, title: title} : bookmark
            console.log(bookmark)
            if (bookmark.id === id) {
                return {...bookmark, title: title}
            } else {
                return bookmark
            }
        }))
    }

    const deleteBookmark = (id) => {
        setBookmarks(bookmarks => bookmarks.filter(bookmark => bookmark.id !== id))
    }

    const deleteById = async (idx) => {
        console.log(`delete ${idx}`)
        try {
            const response = await axiosPrivate.delete(Endpoint.delete(idx))
            deleteBookmark(idx)
        } catch (err) {
            console.log(err)
        }

    }
    // 如果不这样写的话，就会导致list更新了，但bookmarks没有更新
    useEffect(() => {
        setBookmarks(list)
        setRenderCount(renderCount+1)
        console.log(renderCount)
    }, [list])

    return (
        <>
            <div>
                Comp BookmarkList
            </div>
            <div>
                {bookmarks ? bookmarks.length : 'null'}
            </div>
            <div>
                {bookmarks ? bookmarks.map((bookmark, idx) => {
                    // 在{}记得return 
                    return <Bookmark
                        bookmark={bookmark}
                        idx={idx}
                        clickEdit={openEdit}
                        clickDelete={deleteById}
                        onShowButtonClicked={showNoteList}
                    />
                }): 'null'}
            </div>
            {
            editing
            ? <EditOverlay 
                bookmarkId={currentBookmark} 
                closeEdit={closeEdit}/>
            // 如果在currentBookmark没更新的时候，editing就被更新了，如何解决？
            : <></>
            }
            {
            shouldShowNoteList
            ? <NoteManager 
                bookmarkId={currentBookmark}
                closeNoteList={closeNoteList}/>
            : <></>
            }
        </>
    )
};

const Bookmark = ({ bookmark, idx, clickEdit, clickDelete, onShowButtonClicked }) => {
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
        <div 
        className={visited ? "bookmark-title-visited" : "bookmark-title"} 
        key={idx} 
        bookmark-id={bookmark.id} 
        // onClick={ e => { setVisited(true); clickEdit(bookmark.id) }}
        >
            <a href={bookmark.url} target="_blank">
                {bookmark.title}
            </a>
            <br/>
            <button
            onClick={e => {onShowButtonClicked(bookmark.id)}}
            >
            notes: {bookmark.checkins}
            </button>
            <br/>
            {/* <TagPanel
                tags={bookmark.tags}
            /> */}
            <button
            // onClick={e => navigate(`/EditBookmark/${bookmark.id}`)}
            onClick={e => {setVisited(true); clickEdit(bookmark.id)}}
            >
            Edit
            </button>
            {/* <button onClick={getTitle}>
                get title
            </button> */}
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

export default UntaggedBookmarkList;
export { Bookmark, BookmarkList }