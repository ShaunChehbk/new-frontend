import { createContext, useEffect, useState } from "react";

const ContainerHeightContext = createContext({})

export const ContainerHeightProvider = ({ children }) => {
    const [containerHeight, setContainerHeight] = useState(null);

    useEffect(() => {
        console.log('containerHeight: ', containerHeight)
    }, [containerHeight])

    return (
        <ContainerHeightContext.Provider value={{ containerHeight, setContainerHeight }}>
            { children }
        </ContainerHeightContext.Provider>
    )
}

export default ContainerHeightContext;