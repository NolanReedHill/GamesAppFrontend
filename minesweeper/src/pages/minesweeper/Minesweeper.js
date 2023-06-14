import { Box, Button, ButtonGroup, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { useState, useEffect } from 'react'
import Grid from './Grid'
import "./Minesweeper.css"
import Sound from 'react-sound';
import music from './Graze the Roof.mp3'
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Popup from './Popup';

export default function Minesweeper() {

    const [size, setSize] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(true);
    const [isLeaderboard, setIsLeaderboard] = useState(false);
    const [leaderBoardData, setLeaderboardData] = useState([]);

    async function getLeaderboardData() {
        await fetch('http://localhost:9000/minesweeper/get-leaderboard')
            .then((res) => res.json())
            .then((data) => setLeaderboardData(data))
            .catch((error) => console.log("Error:", error))
    }

    useEffect(() => {
        getLeaderboardData();
    }, []);

    function toggleVolume() {
        setVolume(!volume);
    }

    function changeIsLeaderboard() {
        setIsLeaderboard(!isLeaderboard);
    }

    function createDate(seconds) {
        let newDate = new Date(null);
        newDate.setTime(seconds * 1000)
        return newDate.toDateString();
    }

    return (
        <>
            <h1>Minesweeper</h1>
            <div className='topLeft'>
                <Button sx={{ color: "black" }} onClick={changeIsLeaderboard}>Leaderboard</Button>
                <Sound
                    playStatus={(isPlaying && volume) ? Sound.status.PLAYING : Sound.status.PAUSED}
                    url={music}
                    loop={true}
                />
                <IconButton onClick={toggleVolume} >
                    Music
                    {volume ?
                        <VolumeUpIcon /> :
                        <VolumeOffIcon />}
                </IconButton>
            </div>
            {size === 0 &&
                <div className='buttonBox'>
                    <Button variant='contained' sx={{ margin: "auto" }} onClick={() => {
                        setSize(64);
                        setIsPlaying(true);
                    }}
                    >Small</Button>
                    <Button variant='contained' sx={{ margin: "auto" }} onClick={() => {
                        setSize(196);
                        setIsPlaying(true);
                    }}>Medium</Button>
                    <Button variant='contained' sx={{ margin: "auto" }} onClick={() => {
                        setSize(400);
                        setIsPlaying(true);
                    }}>Large</Button>
                </div>}
            {size !== 0 &&
                <div className='buttonBox'>
                    <Button variant='contained' sx={{ margin: "auto" }} onClick={() => {
                        setSize(0);
                        setIsPlaying(false);
                    }}>Start Over</Button>
                </div>}
            <Grid size={size} setSize={setSize} setIsPlaying={setIsPlaying} />
            {isLeaderboard &&
                <Popup
                    content={leaderBoardData ?
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Place</TableCell>
                                        <TableCell>Player</TableCell>
                                        <TableCell>Time (mins)</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {leaderBoardData.sortedData.map((element, index) =>
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{element.name}</TableCell>
                                            <TableCell>{("0" + Math.floor((element.time / 60000) % 60)).slice(-2) +
                                                ":" + ("0" + Math.floor((element.time / 1000) % 60)).slice(-2) + ":" + ("0" + ((element.time / 10) % 100)).slice(-2)}</TableCell>
                                            <TableCell>{createDate(element.date.seconds)}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer> :
                        <h1>Loading Leaderboard...</h1>
                    }

                    handleClose={changeIsLeaderboard}
                />}
        </>
    )
}