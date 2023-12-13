import useRefreshToken from "../hooks/useRefreshToken";

const RefreshToken = () => {
    const refresh = useRefreshToken();

    return (
        <>
        <button onClick={() => refresh()}>
            Refresh Token
        </button>
        </>
    )
}

export default RefreshToken;