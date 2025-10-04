import { useEffect, useState } from "react";
const UserAgent = () => {
    console.log(navigator.userAgentData)
    return (
        <div>
        <h1>user agent</h1>
        {JSON.stringify(navigator.userAgentData)}
        {JSON.stringify(navigator)}
        </div>
    )
}

export default UserAgent;