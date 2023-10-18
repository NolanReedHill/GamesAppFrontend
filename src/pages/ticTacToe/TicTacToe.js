import './TicTacToe.css'
import { Grid, Button, Typography, Snackbar, Alert } from '@mui/material';
import { useState, useEffect, useRef } from 'react'
import Popup from '../minesweeper/Popup';
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Rematch from './Rematch';

export default function TicTacToe() {

    const [grid, setGrid] = useState([]);
    const [whichPlayer, setWhichPlayer] = useState("");
    const [winningLine, setWinningLine] = useState();
    const [gameOver, setGameOver] = useState(false);
    const [reset, setReset] = useState(false);
    const [turn, setTurn] = useState("x");
    const [opponentConnected, setOpponnetConnected] = useState(true);
    const [opponentUsername, setOpponnentUsername] = useState("");
    const [check, setCheck] = useState(false);
    const [rematch, setRematch] = useState(false);
    const [showDisconnected, setShowDisconnected] = useState(false);
    const [showReconnected, setShowReconnected] = useState(false);
    const [timer, setTimer] = useState("");
    const [timerCheck, setTimerCheck] = useState(false);
    const [timerReturnCheck, setTimerReturnCheck] = useState(false);
    const [timerAlert, setTimerAlert] = useState(false);

    const { channel } = useChannelStateContext();
    const { client } = useChatContext();
    let intervalRef = useRef();


    useEffect(() => {
        if (whichPlayer === "") {
            if (Object.values(channel.state.members)[0].user.name === client.user.name) {
                setWhichPlayer("x");
                setOpponnentUsername(Object.values(channel.state.members)[1].user.name);
            }
            else {
                setWhichPlayer("o");
                setOpponnentUsername(Object.values(channel.state.members)[0].user.name);
            }
        }
        else {
            whichPlayer === "x" ? setWhichPlayer("o") : setWhichPlayer("x");
        }
        setRematch(false);
        setTurn("x");
        setWinningLine();
        setGameOver(false);
        setTimer("");
        const temp = [];
        for (let i = 0; i < 9; i++) {
            temp.push({ index: i, value: "", isClicked: false })
        }
        setGrid(temp);
    }, [reset])

    channel.on("user.watching.stop", () => {
        if (channel.state.watcher_count === 1) {
            setOpponnetConnected(false);
            setShowDisconnected(true);
        }

    });

    channel.on("user.watching.start", () => {
        if (check === true)
            return;
        setCheck(true);
        setTimeout(() => {
            setCheck(false);
        }, 500)
    });

    useEffect(() => {
        if (channel.state.watcher_count === 2 && check === true) {
            setOpponnetConnected(true);
            setShowReconnected(true);
            channel.sendEvent({
                type: "reconnect",
                data: { turn, grid, timer, whichPlayer },
            });
        }
    }, [check])

    function handleClick(index, array) {
        let temp = array;
        temp[index].isClicked = true;
        if (turn === "x") {
            temp[index].value = "x";
        }
        if (turn === "o") {
            temp[index].value = "o";
        }
        calculateWinner(temp);
        setGrid(temp);
    }

    function calculateWinner(array) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        lines.forEach((line) => {
            const firstValue = array[line[0]].value;
            if (firstValue === "")
                return;
            let tempWinner = true;
            line.forEach((index) => {
                if (array[index].value !== firstValue) {
                    tempWinner = false;
                }
            })
            if (tempWinner) {
                setWinningLine(line);
                setGameOver(true);
            }
        });
        calculateDraw(array);
    }

    function calculateDraw(array) {
        let check = false;
        array.forEach((box) => {
            if (box.isClicked === false)
                check = true;
        })
        if (check === true)
            return;
        setWinningLine("draw");
        setGameOver(true);
    }

    useEffect(() => {
        if (grid.length > 0)
            setGrid(grid);
    }, [])

    async function chooseSquare(index) {
        if (turn === whichPlayer && !grid[index].isClicked) {
            handleClick(index, grid);
            setTurn(whichPlayer === "x" ? "o" : "x");
            setTimer("");
            await channel.sendEvent({
                type: "game-move",
                data: { whichPlayer, grid },
            });

        }
    }

    channel.on((event) => {
        if (event.type === "game-move" && event.user.id !== client.userID) {
            const currentPlayer = event.data.whichPlayer === "x" ? "o" : "x";
            setTurn(currentPlayer);
            setGrid(event.data.grid);
            calculateWinner(event.data.grid);
            setTimer("");
        }
        if (event.type === "reconnect" && event.user.id !== client.userID) {
            setTurn(event.data.turn);
            setGrid(event.data.grid);
            setTimer(event.data.timer);
            setWhichPlayer(event.data.whichPlayer === "x" ? "o" : "x");
            calculateWinner(event.data.grid);
        }
        if (event.type === "timer" && event.user.id !== client.userID) {
            setTimer(15);
            if (timerReturnCheck)
                return;
            setTimerReturnCheck(true);
            setTimeout(() => {
                setTimerReturnCheck(false);
            }, 500)
        }
        if (event.type === "timer-return" && event.user.id !== client.userID) {
            setTimer(15);
        }
    });

    function startTimer() {
        if (channel.state.watcher_count === 1 && !timer)
            setTimer(15);
        if (timer)
            setTimer((prev) => prev - 1);
        else {
            if (timerCheck)
                return;
            setTimerCheck(true)
            setTimeout(() => {
                setTimerCheck(false);
            }, 500)
        }
    }

    useEffect(() => {
        if (timerCheck && !timer)
            channel.sendEvent({
                type: "timer"
            })
    }, [timerCheck]);

    useEffect(() => {
        if (timerReturnCheck && timer) {
            setTimerAlert(true);
            channel.sendEvent({
                type: "timer-return"
            });
        }

    }, [timerReturnCheck])

    useEffect(() => {
        if (timer) {
            intervalRef.current = setInterval(startTimer, 1000);
            return () => clearInterval(intervalRef.current);
        }
        if (timer === 0) {
            setGameOver(true);
        }
    }, [timer])

    return (
        <>
            <div className='opponentInfo'>
                <p style={{ marginLeft: "10px" }}>Opponent: {Object.values(channel.state.members)[0].user.name === client.user.name ? Object.values(channel.state.members)[1].user.name :
                    Object.values(channel.state.members)[0].user.name}</p>
                <span className='dot' style={{ backgroundColor: opponentConnected ? "green" : "red" }} />
                <p style={{ marginLeft: "10px", verticalAlign: "middle" }}>{opponentConnected ? "Active" : "Disconnected"}</p>
                <Button sx={{ color: "black", marginLeft: "3%", display: timer || timer === 0 ? "none" : "inherit" }}
                    disabled={turn === whichPlayer ? true : timer ? true : false} onClick={startTimer}>
                    Start Timer
                </Button>
                {(timer || timer === 0) &&
                    <p style={{ marginLeft: "5%", color: turn === whichPlayer ? "red" : "black" }}>{timer}</p>}
            </div>
            {!gameOver ? (turn && turn) === whichPlayer ?
                <h1>Your Turn</h1> :
                <h1>Opponent's Turn</h1> :
                <h1>Game Over</h1>}
            {grid.length > 0 &&
                <Grid container columns={3} width={"39%"} sx={{ margin: "auto", aspectRatio: "1", marginBottom: "3%", minWidth: "300px", minHeight: "300px" }} height={"39vw"}>
                    {grid.map((element, index) => (
                        <Grid item sx={{
                            borderRight: element.index === 0 || element.index === 1 ||
                                element.index === 3 || element.index === 4 || element.index === 6 || element.index === 7 ? "solid" : "none",
                            borderBottom: element.index === 0 || element.index === 1 ||
                                element.index === 2 || element.index === 3 || element.index === 4 || element.index === 5 ? "solid" : "none",
                            backgroundColor: winningLine && winningLine.includes(element.index) ? "green" : winningLine === "draw" ? "orange" : "none"
                        }} xs={1} key={index} width={"13vw"} height={"13vw"} minWidth={"100px"} minHeight={"100px"}>
                            <div className={!gameOver && !element.isClicked && turn === whichPlayer ? 'ticBox' : 'clickedBox'} onClick={() => {
                                if (!gameOver)
                                    chooseSquare(element.index)
                            }}
                            >
                                {element.value === "x" &&
                                    <Typography sx={{ margin: "auto", width: "fit-content", fontSize: "8vw", color: "blue" }}>X</Typography>}
                                {element.value === "o" &&
                                    <Typography sx={{ margin: "auto", width: "fit-content", fontSize: "8vw", color: "red" }}>O</Typography>}
                            </div>
                        </Grid>
                    ))}
                </Grid>}
            {gameOver &&
                <Popup
                    content={<>
                        {winningLine === "draw" &&
                            <h1>Draw!</h1>}

                        {winningLine !== "draw" && timer !== 0 &&
                            <h1>{whichPlayer === grid[winningLine[0]].value ? "You Win!" : opponentUsername + " Wins!"}</h1>}
                        {timer === 0 &&
                            <h1>{turn === whichPlayer ? opponentUsername + "Wins!" : "You Win!"}</h1>}
                        {!rematch ?
                            <Button variant='contained' sx={{ width: "fit-content", margin: "auto", marginBottom: "2%" }} onClick={(() => setRematch(true))}>Rematch</Button> :
                            <Rematch reset={reset} setReset={setReset} />}
                        <Button variant='contained' color='error' sx={{ width: "fit-content", margin: "auto" }} onClick={() => window.location.reload(true)}>Exit</Button>
                    </>}
                    handleClose={() => window.location.reload(true)}
                />}
            <Snackbar open={showDisconnected} autoHideDuration={4000} onClose={() => setShowDisconnected(false)}>
                <Alert severity="info" sx={{ width: '100%' }} onClose={() => setShowDisconnected(false)}>Opponent Disconnected</Alert>
            </Snackbar>
            <Snackbar open={showReconnected} autoHideDuration={4000} onClose={() => setShowReconnected(false)}>
                <Alert severity="info" sx={{ width: '100%' }} onClose={() => setShowReconnected(false)}>Opponent Reconnected</Alert>
            </Snackbar>
            <Snackbar open={timerAlert} autoHideDuration={4000} onClose={() => setTimerAlert(false)}>
                <Alert severity="warning" sx={{ width: '100%' }} onClose={() => setTimerAlert(false)}>Opponent Started the Timer</Alert>
            </Snackbar>
        </>
    )
}