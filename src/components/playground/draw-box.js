import { useEffect, useLayoutEffect, useRef, useState } from "react";
import './style.css'

const PlayGround = () => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [height, setHeight] = useState(50);
    const [width, setWidth] = useState(50);
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState([]);
    const [isMovable, setIsMovable] = useState(false);
    const [containerX, setContainerX] = useState(0);
    const [containerY, setContainerY] = useState(0);
    const [conatinerRect, setContainerRect] = useState([])

    const [popUpStyle, setPopUp] = useState({
        position: "relative",
        border: "1px solid",
        height: "50px",
        width: "50px",
    })
    //TODO:如何获取到container 和 当前rect 的坐标？
    //     深入学习useRef

    // const popUp = useRef(0)
    const rect = useRef(0)

    useEffect(() => {
        const updateRect = () => {
            setContainerRect(rect.current.getBoundingClientRect())
            console.log(rect.current.getBoundingClientRect())
        }
        window.addEventListener("scroll", updateRect)
        return () => window.removeEventListener("scroll", updateRect)
    }, [])


    // 这种方式改变的是element.style
    // const showPopUp = (e) => {
    //     popUp.current.style.backgroundColor = "blue";
    //     popUp.current.style.top = `${y + height + 1}px`;
    //     popUp.current.style.left = `${x + width + 1}px`;
    // 不能留有空格
    // popUp.current.style.left = `500 px`;
    // }

    useLayoutEffect(() => {
        setContainerX(rect.current.getBoundingClientRect())
    }, [])

    const calculatePosition = () => {
        return {
            top: `${y + height} px`,
            left: `${x + width} px`
        }
    }

    return (
        <>
            <div className="container">
                <div
                    onScroll={e => console.log("scrolling")}
                    ref={rect}
                    className="child"
                    onClick={e => setIsVisible(!isVisible)}
                    onMouseDown={e => setIsMovable(true)}
                    onMouseMove={e => {
                        setMousePosition([e.clientX, e.clientY])
                        if (isMovable) {
                            // setX(e.clientX)
                            // setY(e.clientY-120)
                        }
                    }}
                    onMouseUp={e => setIsMovable(false)}
                    style={{
                        height: `${height}px`,
                        width: `${width}px`,
                        left: `${x}px`,
                        top: `${y}px`
                    }}
                >
                </div>
                {
                    isVisible && (
                        <div
                            style={{
                                border: "1px solid",
                                height: "50px",
                                width: "50px",
                                position: "relative",
                                left: `${x + width + 1}px`,
                                top: `${y}px`
                            }}
                        >
                        </div>
                    )
                }
                {/* <div
                    className="popup"
                    ref={popUp}
                    style={popUpStyle}
                >
                </div> */}
            </div>
            <button
                onClick={e => setX(x - 1)}
            >⬅</button>
            <button
                onClick={e => setX(x + 1)}
            >⮕</button>
            <button
                onClick={e => setY(y - 1)}
            >⬆</button>
            <button
                onClick={e => setY(y + 1)}
            >⬇</button>
            <button
                onClick={e => setWidth(width + 1)}
            >长</button>
            <button
                onClick={e => setWidth(width - 1)}
            >短</button>
            <button
            // onClick={e => showPopUp()}
            // onClick={e => setPopUp({ ...popUpStyle, left: "100px" })}
            // onClick={e => setIsVisible(!isVisible)}
            >Popup</button>
            <div>
                {JSON.stringify(mousePosition)}
                {JSON.stringify(containerX)}
            </div>
        </>
    )
}

export default PlayGround;