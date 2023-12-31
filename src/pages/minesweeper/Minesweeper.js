import {
    Button, ButtonGroup, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, TablePagination, Checkbox, FormControlLabel, FormControl, FormGroup, FormLabel
} from '@mui/material';
import { useState, useEffect } from 'react';
import Grid from './Grid';
import "./Minesweeper.css";
import Sound from 'react-sound';
import grazeTheRoof from './sounds/Graze the Roof.mp3';
import checkerKnights from './sounds/checker knights.mp3';
import raucousRoulette from './sounds/Raucous Roulette .mp3';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Popup from './Popup';
import HelpIcon from '@mui/icons-material/Help';
import useWindowSize from '../../components/navbar/useWindowSize';

export default function Minesweeper() {

    const [size, setSize] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(true);
    const [isLeaderboard, setIsLeaderboard] = useState(false);
    const [leaderBoardData, setLeaderboardData] = useState([]);
    const [whichLeaderboard, setWhichLeaderboard] = useState(0);
    const [music, setMusic] = useState(grazeTheRoof);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showRules, setShowRules] = useState(false);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
    const [toggleSongs, setToggleSongs] = useState(false);

    const windowSize = useWindowSize();

    useEffect(() => {
        if (windowSize.width > 600)
            setToggleSongs(false);
    }, [windowSize])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    async function getLeaderboardData() {
        setLoadingLeaderboard(true);
        const temp = [];
        await fetch('https://games-app-backend.onrender.com/minesweeper/get-leaderboard/minesweeperLeaderboardSmall')
            .then((res) => res.json())
            .then((data) => temp.push(data))
            .catch((error) => console.log("Error:", error));
        await fetch('https://games-app-backend.onrender.com/minesweeper/get-leaderboard/minesweeperLeaderboardMedium')
            .then((res) => res.json())
            .then((data) => temp.push(data))
            .catch((error) => console.log("Error:", error));
        await fetch('https://games-app-backend.onrender.com/minesweeper/get-leaderboard/minesweeperLeaderboardLarge')
            .then((res) => res.json())
            .then((data) => temp.push(data))
            .then(() => setLeaderboardData(temp))
            .then(() => setLoadingLeaderboard(false))
            .catch((error) => console.log("Error:", error));
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

    function changeShowRules() {
        setShowRules(!showRules);
    }

    return (
        <>  <div className='topLeft'
            style={{
                flexDirection: windowSize.width > 600 ? "column-reverse" : "row", position: windowSize.width > 600 ? "fixed" : "relative",
                top: windowSize.width > 600 ? "8%" : "inherit", width: windowSize.width > 600 ? "fit-content" : "100%", justifyContent: "space-between"
            }}>
            <IconButton sx={{ width: "fit-content" }} onClick={changeShowRules}>
                <HelpIcon />
            </IconButton>
            <Button sx={{ color: "black", }} onClick={changeIsLeaderboard}>Leaderboard</Button>
            <Sound
                playStatus={(isPlaying && volume) ? Sound.status.PLAYING : Sound.status.PAUSED}
                volume={30}
                url={music}
                loop={true}
            />
            {windowSize.width > 600 ?
                <details style={{ marginLeft: "7%" }}>
                    <summary style={{
                        marginBottom: "5%", marginTop: "5%"
                    }}
                        className='songSummary'>SONGS</summary>
                    <details-menu>
                        <ButtonGroup orientation='vertical' size='small' >
                            <Button sx={{ color: "black", borderColor: "black" }}
                                disabled={music === grazeTheRoof} onClick={() => setMusic(grazeTheRoof)}>Graze the Roof</Button>
                            <Button sx={{ color: "black", borderColor: "black" }}
                                disabled={music === checkerKnights} onClick={() => setMusic(checkerKnights)}>Checker Knights</Button>
                            <Button sx={{ color: "black", borderColor: "black" }}
                                disabled={music === raucousRoulette} onClick={() => setMusic(raucousRoulette)}>Raucous Roulette</Button>
                        </ButtonGroup>
                    </details-menu>
                </details> :
                <Button sx={{ color: "black" }} onClick={() => setToggleSongs(true)}>Songs</Button>}
            {toggleSongs &&
                <Popup
                    content={<>
                        <FormControl>
                            <FormLabel >Choose Song</FormLabel>
                            <FormGroup >
                                <FormControlLabel control={<Checkbox checked={music === grazeTheRoof} disabled={music === grazeTheRoof}
                                    onClick={() => setMusic(grazeTheRoof)} />} label='Graze the Roof' sx={{ width: "fit-content" }} />
                                <FormControlLabel control={<Checkbox checked={music === checkerKnights} disabled={music === checkerKnights}
                                    onClick={() => setMusic(checkerKnights)} />} label='Checker Knights' sx={{ width: "fit-content" }} />
                                <FormControlLabel control={<Checkbox checked={music === raucousRoulette} disabled={music === raucousRoulette}
                                    onClick={() => setMusic(raucousRoulette)} />} label='Raucous Roulette' sx={{ width: "fit-content" }} />
                            </FormGroup>
                        </FormControl>

                    </>}
                    handleClose={() => setToggleSongs(false)}
                />}
            <IconButton onClick={toggleVolume} >
                Music
                {volume ?
                    <VolumeUpIcon /> :
                    <VolumeOffIcon />}
            </IconButton>
        </div>
            <h1>Minesweeper</h1>

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
                    <Button variant='contained' sx={{ margin: "auto", }} onClick={() => {
                        setSize(0);
                        setIsPlaying(false);
                    }}>Start Over</Button>
                </div>}
            <Grid size={size} setSize={setSize} setIsPlaying={setIsPlaying} />
            {isLeaderboard &&
                <Popup
                    content={!loadingLeaderboard ?
                        <>
                            <ButtonGroup>
                                <Button onClick={() => setWhichLeaderboard(0)} disabled={whichLeaderboard === 0}
                                    sx={{ color: "black", borderColor: "black" }}>Small</Button>
                                <Button onClick={() => setWhichLeaderboard(1)} disabled={whichLeaderboard === 1}
                                    sx={{ color: "black", borderColor: "black" }}>Medium</Button>
                                <Button onClick={() => setWhichLeaderboard(2)} disabled={whichLeaderboard === 2}
                                    sx={{ color: "black", borderColor: "black" }}>Large</Button>
                            </ButtonGroup>
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
                                        {leaderBoardData[whichLeaderboard].sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((element, index) =>
                                            <TableRow key={index}>
                                                <TableCell>{element.place} {element.place === 1 ? "🥇" : ""} {element.place === 2 ? "🥈" : ""} {element.place === 3 ? "🥉" : ""}</TableCell>
                                                <TableCell>{element.name}</TableCell>
                                                <TableCell>{("0" + Math.floor((element.time / 60000) % 60)).slice(-2) +
                                                    ":" + ("0" + Math.floor((element.time / 1000) % 60)).slice(-2) + ":" + ("0" + ((element.time / 10) % 100)).slice(-2)}</TableCell>
                                                <TableCell>{createDate(element.date.seconds)}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={leaderBoardData[whichLeaderboard].sortedData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </> :
                        <>
                            <h1>Loading Leaderboard...</h1>
                            <div className='spinner' style={{ margin: "auto" }} />
                        </>
                    }

                    handleClose={changeIsLeaderboard}
                />}
            {showRules &&
                <Popup
                    handleClose={changeShowRules}
                    content={<>
                        <h2>Rules:</h2>
                        <h3>This is the classic game minesweeper. Click on squares to reveal how many bombs are adjacent. </h3>
                        <h4>Be careful not to click a bomb, or you lose!</h4>
                        <h2>Controls:</h2>
                        <h3>Left Click: reveal a square.</h3>
                        <h3>Right Click: Flag a square.</h3>
                        <h3>Spacebar: Flag a square or reveal adjacent squares. </h3>
                        <h2>Mobile Controls:</h2>
                        <h3>Short tap to reveal a square.</h3>
                        <h3>Long tap to flag a square.</h3>
                    </>}
                />}
        </>
    )
}