import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./styles.css";

const PlayGround2 = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [height, setHeight] = useState(50);
  const [width, setWidth] = useState(50);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState([]);
  const [isMovable, setIsMovable] = useState(false);
  const [containerX, setContainerX] = useState(0);
  const [containerY, setContainerY] = useState(0);
  const [conatinerRect, setContainerRect] = useState([]);
  const [relativeCord, setRelativeCord] = useState([]);

  const [popUpStyle, setPopUp] = useState({
    position: "relative",
    border: "1px solid",
    height: "50px",
    width: "50px",
  });
  //TODO:如何获取到container 和 当前rect 的坐标？
  //     深入学习useRef

  // const popUp = useRef(0)
  const rect = useRef(0);

  // 在滚动的时候，更新container位置
  const calculateRel = () => {
    setContainerX(mousePosition[0] - conatinerRect.left);
    setContainerY(mousePosition[1] - conatinerRect.top);
    // console.log(
    //   `relx: ${mousePosition[0] - conatinerRect.left}, rely: ${
    //     mousePosition[1] - conatinerRect.top
    //   }`
    // );
  };

  useEffect(() => {
    const updateRect = () => {
      setContainerRect({
        left: rect.current.getBoundingClientRect().left,
        top: rect.current.getBoundingClientRect().top,
      });
      //   console.log(`x: ${x - conatinerRect.left} y: ${y - conatinerRect.top}`);
    };
    const updateCord = () => {
      console.log("mouseMove");
      //   console.log(`x: ${x - conatinerRect.left} y: ${y - conatinerRect.top}`);
    };
    window.addEventListener("scroll", updateRect);
    // window.addEventListener("mousemove", updateCord);
    setContainerRect({
      left: rect.current.getBoundingClientRect().left,
      top: rect.current.getBoundingClientRect().top,
    });
    return () => {
      window.removeEventListener("scroll", updateRect);
      //   window.removeEventListener("mousemove", updateCord);
    };
  }, []);

  useEffect(() => {
    console.log("container scroll");
    calculateRel();
  }, [conatinerRect]);

  const calculateRelativeCord = (x, y) => {
    console.log(`x: ${x - conatinerRect.left} y: ${y - conatinerRect.top}`);
  };

  useLayoutEffect(() => {
    setContainerX(rect.current.getBoundingClientRect());
  }, []);

  const calculatePosition = () => {
    return {
      top: `${y + height} px`,
      left: `${x + width} px`,
    };
  };

  const updatePosition = () => {
    setX(containerX - 26);
    setY(containerY - 26);
  };

  return (
    <>
      <div
        id="container"
        onMouseMove={(e) => {
          //   console.log("mouse move in container");
          setMousePosition([e.clientX, e.clientY]);
          calculateRel();
        }}
        onClick={(e) => {
          console.log("click in container");
          console.log(e.target.id);
        }}
        onMouseDown={(e) => {
          //   console.log("mouse down in container");
          setIsMovable(true);
        }}
        onMouseUp={(e) => {
          setIsMovable(false);
        }}
        onMouseMoveCapture={(e) => {
          if (isMovable) {
            updatePosition();
          }
        }}
        onScroll={(e) => {
          console.log("scroll in container");
          //   calculateRelativeCord(e.clientX, e.clientY);
        }}
        className="container"
        ref={rect}
      >
        <div
          id="child"
          className="child"
          //   onClick={(e) => setIsVisible(!isVisible)}
          //   onMouseDown={(e) => {
          //     console.log("mouse Down");
          //     setIsMovable(true);
          //   }}
          //   onMouseUp={(e) => {
          //     setIsMovable(false);
          //   }}
          //   onMouseMove={(e) => {
          //     setX(containerX - 25);
          //   }}
          style={{
            height: `${height}px`,
            width: `${width}px`,
            left: `${x}px`,
            top: `${y}px`,
          }}
        ></div>
        {isVisible && (
          <div
            style={{
              border: "1px solid",
              height: "50px",
              width: "50px",
              position: "relative",
              left: `${x + width + 1}px`,
              top: `${y}px`,
            }}
          ></div>
        )}
        {/* <div
                    className="popup"
                    ref={popUp}
                    style={popUpStyle}
                >
                </div> */}
      </div>
      <button onClick={(e) => setX(x - 1)}>⬅</button>
      <button onClick={(e) => setX(x + 1)}>⮕</button>
      <button onClick={(e) => setY(y - 1)}>⬆</button>
      <button onClick={(e) => setY(y + 1)}>⬇</button>
      <button onClick={(e) => setWidth(width + 1)}>长</button>
      <button onClick={(e) => setWidth(width - 1)}>短</button>
      <button
      // onClick={e => showPopUp()}
      // onClick={e => setPopUp({ ...popUpStyle, left: "100px" })}
      // onClick={e => setIsVisible(!isVisible)}
      >
        Popup
      </button>
      <div className="status">
        mouseposition:{JSON.stringify(mousePosition)}
        relative:{JSON.stringify([containerX, containerY])}
        Rect:{JSON.stringify(conatinerRect)}
      </div>
    </>
  );
};

export default PlayGround2;

// 当光标在div内移的时候，计算其相对坐标
// 当页面整体滚动的时候，重新计算container的原点，在文档中的坐标值，并更新
// 当container的原点值更新的时候，重新计算相对坐标 useEffect
