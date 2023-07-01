import './TicTacToe.css'
import { Grid, Button, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react'
import Popup from '../minesweeper/Popup';
export default function TicTacToe() {

    const [grid, setGrid] = useState([]);
    const [whichPlayer, setWhichPlayer] = useState("x");
    const [winningLine, setWinningLine] = useState();
    const [gameOver, setGameOver] = useState(false);
    const [reset, setReset] = useState(false);

    useEffect(() => {
        setWhichPlayer("x");
        setWinningLine();
        setGameOver(false);
        const temp = [];
        for (let i = 0; i < 9; i++) {
            temp.push({ index: i, value: "", isClicked: false })
        }
        setGrid(temp);
    }, [reset])

    function handleClick(index) {
        if (grid[index].isClicked)
            return;
        grid[index].isClicked = true;
        if (whichPlayer === "x") {
            grid[index].value = "x";
            setWhichPlayer("o");
        }
        if (whichPlayer === "o") {
            grid[index].value = "o";
            setWhichPlayer("x");
        }
        setWinningLine(calculateWinner());
    }

    function calculateWinner() {
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
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (grid[a].value && grid[a].value === grid[b].value && grid[a].value === grid[c].value) {
                setGameOver(true);
                return [a, b, c];
            }
        }
        let check = false;
        grid.forEach((box) => {
            if (box.isClicked === false)
                check = true;
        })
        if (check === true)
            return null;
        setGameOver(true);
        return "draw";
    }

    useEffect(() => {
        if (grid.length > 0)
            setGrid(grid);
    }, [])

    return (
        <>
            <h1>Work in progress</h1>
            {grid.length > 0 &&
                <Grid container columns={3} width={"39%"} sx={{ margin: "auto", aspectRatio: "1", marginBottom: "3%" }} height={"39vw"}>
                    {grid.map((element, index) => (
                        <Grid item sx={{
                            borderRight: element.index === 0 || element.index === 1 ||
                                element.index === 3 || element.index === 4 || element.index === 6 || element.index === 7 ? "solid" : "none",
                            borderBottom: element.index === 0 || element.index === 1 ||
                                element.index === 2 || element.index === 3 || element.index === 4 || element.index === 5 ? "solid" : "none",
                            backgroundColor: winningLine && winningLine.includes(element.index) ? "green" : winningLine === "draw" ? "orange" : "none"
                        }} xs={1} key={index} width={"13vw"} height={"13vw"}>
                            <div className={!gameOver && !element.isClicked ? 'ticBox' : 'clickedBox'} onClick={() => {
                                if (!gameOver)
                                    handleClick(element.index)
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

                        {winningLine !== "draw" &&
                            <h1>{grid[winningLine[0]].value.toUpperCase() + " Wins!"}</h1>}
                        <Button variant='contained' sx={{ width: "fit-content", margin: "auto" }} onClick={() => setReset(!reset)}>Go Back</Button>
                    </>}
                    handleClose={() => setReset(!reset)}
                />}

        </>
    )
}