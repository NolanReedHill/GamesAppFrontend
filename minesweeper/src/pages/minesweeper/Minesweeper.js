import { Box, Button, ButtonGroup } from '@mui/material'
import { useState } from 'react'
import Grid from './Grid'
import "./Minesweeper.css"
export default function Minesweeper() {

    const [size, setSize] = useState(0);

    return (
        <>
            <h1>Minesweeper</h1>
            <div className='buttonBox'>
                <Button variant='contained' sx={{ margin: "auto" }} onClick={() => setSize(64)}>Small</Button>
                <Button variant='contained' sx={{ margin: "auto" }} onClick={() => setSize(196)}>Medium</Button>
                <Button variant='contained' sx={{ margin: "auto" }} onClick={() => setSize(400)}>Large</Button>
            </div>

            <Grid size={size} />
        </>
    )
}