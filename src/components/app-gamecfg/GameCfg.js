import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Endpoint from "../../api/api";
import axios, { axiosPrivate } from "../../api/axios";

const CfgMgr = () => {
    const [games, setGames] = useState([1, 2]);
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate()

    const getAllGame = async () => {
        try {
            const response = await axiosPrivate.get(Endpoint.getGames());
            console.log(response.data);
            setGames(response.data);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getAllGame();
    }, [auth])

    return (
        <div>
        CfgMgr
        {
        games
        ? <>{
            games.map((game, idx) => {
                return (<GameCfg key={idx} id={game.id} name={game.name}/>)
            })
        }</>
        : <>Loading</>
        }
        </div>
    )
}

const GameCfg = ({ name, id }) => {
    const [game, setGame] = useState();
    const [records, setRecords] = useState([])
    const [adding, setAdding] = useState(false);
    const [newRecord, setNewRecord] = useState("")
    const axiosPrivate = useAxiosPrivate()


    const getConfigs = async (id) => {
        try {
            const response = await axiosPrivate.get(Endpoint.getCfgsOf(id));
            console.log(response.data);
            setRecords(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const postNewRecord = async () => {
        try {
            const response = await axiosPrivate.post(Endpoint.addCfgFor(id), {"text": newRecord});
            console.log(response.data);
            setRecords(oldArray => [...oldArray, response.data]);
            setNewRecord("");
            setAdding(false);
        } catch (err) {
            console.log(err);
        }
    }

    const handleAdd = async () => {
        setAdding(!adding)
    }

    useEffect(() => {
        if (id) getConfigs(id);
    }, [id])

    return (
        <div>
        <h3>{name}</h3> <button onClick={handleAdd}> add </button><br/>
        {
        adding
        ? <>
        <textarea value={newRecord} onChange={e => setNewRecord(e.target.value)} />
        <br/>
        <button onClick={postNewRecord}>Submit</button>
        </>
        : <></>
        }
        {
        records
        ? <>{
            records.map((record, idx) => {
                return <CfgRecord id={record.id} text={record.text}/>
            })
        }</>
        : <></>
        }
        </div>
    )
}

const CfgRecord = ({ id, text }) => {
    return (
        <div>
            {text}
        </div>
    )
}

export default CfgMgr;