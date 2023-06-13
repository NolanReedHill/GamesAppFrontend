import FlagIcon from '@mui/icons-material/Flag';
import { useState, useEffect } from 'react'
import { Grid, Box, Button } from '@mui/material';
import StopWatch from './StopWatch';

export default function MineGrid({ size }) {

    const [numBombs, setNumBombs] = useState();
    const [numBoxes, setNumBoxes] = useState([]);
    const [numFlags, setNumFlags] = useState(numBombs);

    useEffect(() => {
        let bombIndexes = [];
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
                setNumBombs()
        }
        let temp = []
        for (let i = 0; i < size; i++) {
            let isBomb = bombIndexes.includes(i);
            temp.push({ key: i, hasFlag: false, isClicked: false, hasBomb: isBomb });
        }
        setNumBoxes(temp);
    }, [size])

    return (
        <>
            {!size ? <h1>Pick a Size</h1> :
                <>
                    <div className='flagBox'>
                        <FlagIcon color='secondary' />
                        <h3 style={{ textAlign: "left", marginTop: "0" }}>{numFlags}</h3>
                        <h3 style={{ textAlign: "left", marginTop: "0", marginLeft: "5%" }}>Time:</h3>
                        <StopWatch numBoxes={numBoxes} />
                    </div>
                    <Grid container columns={Math.sqrt(size)} width={"35%"} sx={{ margin: "auto", aspectRatio: "1", marginBottom: "5%" }}>
                        {numBoxes.map((element, index) =>
                            <Grid item xs={1} key={element.key}>
                                <div className='mineSquare' key={"msq" + element.key}>
                                </div>
                            </Grid>
                        )}
                    </Grid>
                </>
            }

        </>
    )

}