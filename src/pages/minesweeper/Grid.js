import FlagIcon from '@mui/icons-material/Flag';
import { useState, useEffect } from 'react'
import { Grid, Button, TextField } from '@mui/material';
import StopWatch from './StopWatch';
import DigitDisplay from './DigitDisplay';
import Popup from './Popup';

export default function MineGrid({ size, setSize, setIsPlaying }) {

    const [numBombs, setNumBombs] = useState();
    const [numBoxes, setNumBoxes] = useState([]);
    const [numFlags, setNumFlags] = useState(numBombs);
    const [update, setUpdate] = useState(false);
    const [bombsVisible, setBombsVisible] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const [finalTime, setFinalTime] = useState();
    const [isForm, setIsForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [firstClick, setFirstClick] = useState(false);
    const [whichSquareHover, setWhichSquareHover] = useState(-1);

    window.addEventListener('keydown', function (e) {
        if (e.key == " " && e.target == document.body) {
            e.preventDefault();
        }
    });

    useEffect(() => {
        if (numBoxes.length > 0) {
            let temp = numBoxes.every((box) => {
                return (box.isClicked || box.hasBomb) ? true
                    : false;
            })
            setIsWin(temp);
        }
    }, [update])

    useEffect(() => {
        if (bombsVisible === true || isWin === true)
            setIsPlaying(false);
    }, [bombsVisible, isWin])

    useEffect(() => {
        if (size === 0) {
            setNumBombs();
            setNumBoxes([]);
            setNumFlags();
            setBombsVisible(false);
            setIsWin(false);
            setFirstClick(false);
            setIsForm(false);
        }
        switch (size) {
            case 64:
                setNumBombs(10);
                setNumFlags(10);
                break;
            case 196:
                setNumBombs(40);
                setNumFlags(40);
                break;
            case 400:
                setNumBombs(99);
                setNumFlags(99);
                break;
            default:
                setNumBombs();
        }
        let temp = []
        for (let i = 0; i < size; i++) {
            temp.push({ key: i, hasFlag: false, isClicked: false, isExploded: false });
        }
        setNumBoxes(temp);

    }, [size])

    useEffect(() => {
        setNumBoxes(numBoxes);
    }, [update])

    function assignBombs(index) {
        let exclude = []
        exclude = getExclusions(index);
        const bombIndexes = [];
        for (let i = 0; i < numBombs; i++) {
            let temp = Math.floor(Math.random() * size)
            while (bombIndexes.includes(temp) || exclude.includes(temp)) {
                temp = Math.floor(Math.random() * size);
            }
            bombIndexes.push(temp);
        }
        numBoxes.forEach((box, index) => {
            let isBomb = bombIndexes.includes(index);
            box.hasBomb = isBomb;
        })
        for (let i = 0; i < size; i++) {
            setDigit(i, numBoxes);
        }
    }

    function getExclusions(index) {
        let rowLength = Math.sqrt(size);
        let temp = [];
        temp.push(index);
        if (index >= rowLength && index % rowLength !== 0)
            temp.push(index - (rowLength + 1));
        if (index >= rowLength)
            temp.push(index - rowLength);
        if (index >= rowLength && (index + 1) % rowLength !== 0)
            temp.push(index - (rowLength - 1));
        if (index % rowLength !== 0)
            temp.push(index - 1);
        if ((index + 1) % rowLength !== 0)
            temp.push(index + 1);
        if (index + rowLength < size && index % rowLength !== 0)
            temp.push(index + (rowLength - 1));
        if (index + rowLength < size)
            temp.push(index + rowLength);
        if (index + rowLength < size && (index + 1) % rowLength !== 0)
            temp.push(index + (rowLength + 1));
        return temp;

    }

    function handleClick(e, index) {
        e.preventDefault();
        if (!firstClick) {
            setFirstClick(true);
            assignBombs(index);
        }
        if (numBoxes[index].isClicked)
            return;
        if (e.type === 'contextmenu') {
            if (numBoxes[index].hasFlag) {
                numBoxes[index].hasFlag = false;
                setNumFlags(numFlags + 1);
                setUpdate(!update);
                return;
            }
            else {
                if (numFlags) {
                    setNumFlags(numFlags - 1)
                    numBoxes[index].hasFlag = true;
                    setUpdate(!update);
                    return;
                }

            }
        }
        if (e.type === 'click') {
            if (numBoxes[index].isClicked || numBoxes[index].hasFlag)
                return;
            if (numBoxes[index].hasBomb) {
                numBoxes[index].isExploded = true;
                numBoxes[index].isClicked = true;
                setBombsVisible(true);
                setUpdate(!update)
                return;
            }
            let addFlags = changeClicked(index);
            setNumFlags(numFlags + addFlags);
            setUpdate(!update);
        }
    }

    function changeClicked(index) {
        let addFlags = 0;
        if (!numBoxes[index] || numBoxes[index].hasBomb || numBoxes[index].isClicked) {
            return 0;
        }
        const rowLength = Math.sqrt(size);
        addFlags += clickBox(index);
        if (numBoxes[index].digit === 0) {
            if (numBoxes[index - (rowLength + 1)] && index % rowLength !== 0) {
                if (numBoxes[index - (rowLength + 1)].digit === 0) {
                    addFlags += changeClicked(index - (rowLength + 1));

                } else {
                    addFlags += clickBox(index - (rowLength + 1));
                }
            }
            addFlags += changeClicked(index - rowLength);
            if (numBoxes[index - (rowLength - 1)] && (index + 1) % rowLength !== 0) {
                if (numBoxes[index - (rowLength - 1)].digit === 0) {
                    addFlags += changeClicked(index - (rowLength - 1));
                } else {
                    addFlags += clickBox(index - (rowLength - 1));
                }
            }
            if (numBoxes[index - 1] && index % rowLength !== 0) {
                if (numBoxes[index - 1].digit === 0) {
                    addFlags += changeClicked(index - 1);
                } else {
                    addFlags += clickBox(index - 1);
                }
            }
            if (numBoxes[index + 1] && (index + 1) % rowLength !== 0) {
                if (numBoxes[index + 1].digit === 0) {
                    addFlags += changeClicked(index + 1);
                } else {
                    addFlags += clickBox(index + 1);
                }
            }
            if (numBoxes[index + (rowLength - 1)] && index % rowLength !== 0) {
                if (numBoxes[index + (rowLength - 1)].digit === 0) {
                    addFlags += changeClicked(index + (rowLength - 1));
                } else {
                    addFlags += clickBox(index + (rowLength - 1));
                }
            }
            addFlags += changeClicked(index + rowLength);
            if (numBoxes[index + (rowLength + 1)] && (index + 1) % rowLength !== 0) {
                if (numBoxes[index + (rowLength + 1)].digit === 0) {
                    addFlags += changeClicked(index + (rowLength + 1));
                } else {
                    addFlags += clickBox(index + (rowLength + 1));
                }
            }
        }
        return addFlags;
    }

    function clickBox(index) {
        numBoxes[index].isClicked = true;
        if (numBoxes[index].hasFlag) {
            numBoxes[index].hasFlag = false;
            return 1;
        }
        return 0;

    }

    function handleSpace(e) {
        if (e.key !== " ")
            return;
        if (whichSquareHover === -1)
            return;
        if (!numBoxes[whichSquareHover].isClicked) {
            if (!numBoxes[whichSquareHover].hasFlag && numFlags) {
                numBoxes[whichSquareHover].hasFlag = true;
                setNumFlags(numFlags - 1);
                setUpdate(!update);
            }
            else if (numBoxes[whichSquareHover].hasFlag) {
                numBoxes[whichSquareHover].hasFlag = false;
                setNumFlags(numFlags + 1);
                setUpdate(!update);
            }
            return;
        }
        else {
            let temp = 0;
            let unclickedBoxes = [];
            const rowLength = Math.sqrt(size);
            if (whichSquareHover % rowLength !== 0 && numBoxes[whichSquareHover - (rowLength + 1)]) {
                if (numBoxes[whichSquareHover - (rowLength + 1)].hasFlag) {
                    temp++;
                }
                else if (!numBoxes[whichSquareHover - (rowLength + 1)].isClicked)
                    unclickedBoxes.push(whichSquareHover - (rowLength + 1));
            }
            if (numBoxes[whichSquareHover - rowLength]) {
                if (numBoxes[whichSquareHover - rowLength].hasFlag) {
                    temp++;
                }
                else if (!numBoxes[whichSquareHover - rowLength].isClicked)
                    unclickedBoxes.push(whichSquareHover - rowLength);
            }
            if ((whichSquareHover + 1) % rowLength !== 0 && numBoxes[whichSquareHover - (rowLength - 1)]) {
                if (numBoxes[whichSquareHover - (rowLength - 1)].hasFlag) {
                    temp++;
                }
                else if (!numBoxes[whichSquareHover - (rowLength - 1)].isClicked)
                    unclickedBoxes.push(whichSquareHover - (rowLength - 1));
            }
            if (whichSquareHover % rowLength !== 0 && numBoxes[whichSquareHover - 1]) {
                if (numBoxes[whichSquareHover - 1].hasFlag) {
                    temp++;
                }
                else if (!numBoxes[whichSquareHover - 1].isClicked)
                    unclickedBoxes.push(whichSquareHover - 1);
            }
            if ((whichSquareHover + 1) % rowLength !== 0 && numBoxes[whichSquareHover + 1]) {
                if (numBoxes[whichSquareHover + 1].hasFlag) {
                    temp++;
                }
                else if (!numBoxes[whichSquareHover + 1].isClicked)
                    unclickedBoxes.push(whichSquareHover + 1);
            }
            if (whichSquareHover % rowLength !== 0 && numBoxes[whichSquareHover + (rowLength - 1)]) {
                if (numBoxes[whichSquareHover + (rowLength - 1)].hasFlag) {
                    temp++;
                }
                else if (!numBoxes[whichSquareHover + (rowLength - 1)].isClicked)
                    unclickedBoxes.push(whichSquareHover + (rowLength - 1));
            }
            if (numBoxes[whichSquareHover + rowLength]) {
                if (numBoxes[whichSquareHover + rowLength].hasFlag) {
                    temp++;
                }
                else if (!numBoxes[whichSquareHover + rowLength].isClicked)
                    unclickedBoxes.push(whichSquareHover + rowLength);
            }
            if ((whichSquareHover + 1) % rowLength !== 0 && numBoxes[whichSquareHover + (rowLength + 1)]) {
                if (numBoxes[whichSquareHover + (rowLength + 1)].hasFlag) {
                    temp++;
                }
                else if (!numBoxes[whichSquareHover + (rowLength + 1)].isClicked)
                    unclickedBoxes.push(whichSquareHover + (rowLength + 1));
            }
            if (temp >= numBoxes[whichSquareHover].digit) {
                unclickedBoxes.forEach((index) => {
                    changeClickedSpace(index);
                })
            }
            setUpdate(!update);
        }
    }
    function changeClickedSpace(index) {
        if (numBoxes[index].hasBomb) {
            numBoxes[index].isExploded = true;
            numBoxes[index].isClicked = true;
            setBombsVisible(true);
            setUpdate(!update)
            return;
        }
        changeClicked(index);

    }

    function setDigit(index, array) {
        if (array[index].hasBomb)
            return;
        const rowLength = Math.sqrt(size);
        let temp = 0;
        if (index % rowLength !== 0 && array[index - (rowLength + 1)] && array[index - (rowLength + 1)].hasBomb) {
            temp++;
        }
        if (array[index - rowLength] && array[index - rowLength].hasBomb) {
            temp++;
        }
        if ((index + 1) % rowLength !== 0 && array[index - (rowLength - 1)] && array[index - (rowLength - 1)].hasBomb) {
            temp++;
        }
        if (index % rowLength !== 0 && array[index - 1] && array[index - 1].hasBomb) {
            temp++;
        }
        if ((index + 1) % rowLength !== 0 && array[index + 1] && array[index + 1].hasBomb) {
            temp++;
        }
        if (index % rowLength !== 0 && array[index + (rowLength - 1)] && array[index + (rowLength - 1)].hasBomb) {
            temp++;
        }
        if (array[index + rowLength] && array[index + rowLength].hasBomb) {
            temp++;
        }
        if ((index + 1) % rowLength !== 0 && array[index + (rowLength + 1)] && array[index + (rowLength + 1)].hasBomb) {
            temp++;
        }
        array[index].digit = temp;
    }

    function handleClose() {
        setIsWin(false);
        setSize(0);
    }

    async function postToLeaderBoard(e) {
        e.preventDefault();
        setUploading(true);
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        let collection;
        switch (size) {
            case 64:
                collection = "minesweeperLeaderboardSmall";
                break;
            case 196:
                collection = "minesweeperLeaderboardMedium";
                break;
            case 400:
                collection = "minesweeperLeaderboardLarge";
                break;
            default:
                collection = null;
        }
        let auth = process.env.REACT_APP_privateKeyId;
        let content = { name: data.name, time: finalTime, date: data.date, collection: collection, auth: auth }
        await fetch('https://games-app-backend.onrender.com/minesweeper/post-to-leaderboard', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(content)
        })
            .then(() => window.location.reload(true))
            .catch((error) => console.log("Error:", error));
    }

    return (
        <>
            {!size ?
                <div style={{ height: "58vh" }}>
                    <h2 style={{ marginTop: "5%" }}>Choose Size...</h2>
                </div>
                :
                <div tabIndex="0" className='gridBox' onMouseLeave={() => setWhichSquareHover(-1)}
                    onKeyDown={(e) => {
                        if (e.key === " ")
                            e.preventDefault()
                        handleSpace(e);
                    }}>
                    <div className='flagBox'>
                        <FlagIcon color='secondary' />
                        <h3 style={{ textAlign: "left", marginTop: "0" }}>{numFlags}</h3>
                        <h3 style={{ textAlign: "left", marginTop: "0", marginLeft: "5%" }}>Time:</h3>
                        <StopWatch numBoxes={numBoxes} bombsVisible={bombsVisible} isWin={isWin} setFinalTime={setFinalTime} />
                    </div>
                    <Grid container columns={Math.sqrt(size)} width={"100%"} sx={{ margin: "auto", aspectRatio: "1", marginBottom: "5%" }}>
                        {numBoxes.map((element) =>
                            <Grid item xs={1} key={element.key} sx={{ aspectRatio: "1" }}>
                                <div
                                    className='mineSquare'
                                    key={"msq" + element.key}
                                    onClick={(e) => handleClick(e, element.key)}
                                    onContextMenu={(e) => handleClick(e, element.key)}
                                    onMouseOver={() => setWhichSquareHover(element.key)}
                                    style={{
                                        backgroundColor: element.isClicked ? "#bfbfbf" : "auto", cursor: element.isClicked ? "default" : "pointer",
                                        opacity: element.isClicked ? "100%" : "auto"
                                    }}
                                >
                                    {!(element.hasBomb && bombsVisible) &&
                                        <FlagIcon sx={{ display: element.hasFlag ? "block" : "none", margin: "auto", fontSize: "100%", width: "100%", height: "100%" }}
                                            color='secondary' />}
                                    {(bombsVisible && element.hasBomb && !element.isExploded) &&
                                        <p className="emoji">💣</p>}
                                    {element.isExploded &&
                                        <p className="emoji">💥</p>}
                                    {(element.digit !== 0 && element.isClicked) &&
                                        <DigitDisplay digit={element.digit} />}
                                </div>
                            </Grid>
                        )}
                    </Grid>
                    {bombsVisible &&
                        <>
                            <div className='winBlocker'></div>
                            <Popup
                                content={<>
                                    <h1>You Lose! Try Again?</h1>
                                    <Button variant='contained' onClick={handleClose} sx={{ width: "fit-content", margin: "auto" }}>Go Back</Button>
                                </>}
                                handleClose={handleClose}
                            />
                        </>}
                    {isWin &&
                        <>
                            <div className='winBlocker'></div>
                            <Popup
                                content={<>
                                    <h1>You Win!</h1>
                                    <h2>It Took You : {("0" + Math.floor((finalTime / 60000) % 60)).slice(-2) +
                                        ":" + ("0" + Math.floor((finalTime / 1000) % 60)).slice(-2) + ":" + ("0" + ((finalTime / 10) % 100)).slice(-2)}</h2>
                                    {!isForm &&
                                        <Button variant='contained' onClick={() => setIsForm(true)} sx={{ width: "fit-content", margin: "auto" }}>Post to Leaderboard</Button>}
                                    {(isForm && !uploading) &&
                                        <form method='post' onSubmit={postToLeaderBoard} style={{ display: "flex", flexDirection: "column" }}>
                                            <TextField required name='name' label='Your Name' sx={{ width: "fit-content", margin: "auto" }} />
                                            <TextField placeholder={("0" + Math.floor((finalTime / 60000) % 60)).slice(-2) +
                                                ":" + ("0" + Math.floor((finalTime / 1000) % 60)).slice(-2) + ":" + ("0" + ((finalTime / 10) % 100)).slice(-2)}
                                                InputProps={{ readOnly: true }}
                                                name='time'
                                                label='Your Time'
                                                sx={{ width: "fit-content", margin: "auto", marginTop: "3%" }}
                                                value={("0" + Math.floor((finalTime / 60000) % 60)).slice(-2) +
                                                    ":" + ("0" + Math.floor((finalTime / 1000) % 60)).slice(-2) + ":" + ("0" + ((finalTime / 10) % 100)).slice(-2)}
                                            />
                                            <Button type='submit' variant='contained' sx={{ width: "fit-content", margin: "auto", marginTop: "3%" }}>Submit</Button>
                                        </form>}
                                    {uploading &&
                                        <h2>Uploading... (This might take a while)</h2>}
                                    {!uploading &&
                                        <Button variant='contained' onClick={handleClose} sx={{ width: "fit-content", margin: "auto", marginTop: "3%" }} color='error'>Go Back</Button>}
                                </>}
                                handleClose={handleClose}
                            />

                        </>}
                </div>
            }

        </>
    )

}