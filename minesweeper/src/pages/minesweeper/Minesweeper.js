import { Box, Button, ButtonGroup, IconButton } from '@mui/material'
import { useState } from 'react'
import Grid from './Grid'
import "./Minesweeper.css"
import Sound from 'react-sound';
import music from './Graze the Roof.mp3'
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export default function Minesweeper() {

    const [size, setSize] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(true);

    function toggleVolume() {
        setVolume(!volume);
    }

    return (
        <>
            <h1>Minesweeper</h1>
            <Sound
                playStatus={(isPlaying && volume) ? Sound.status.PLAYING : Sound.status.PAUSED}
                url={music}
                playFromPosition={0}
                loop={true}
            />
            <IconButton onClick={toggleVolume} sx={{ position: "fixed", left: "0", top: "8%" }}>
                Music
                {volume ?
                    <VolumeUpIcon /> :
                    <VolumeOffIcon />}
            </IconButton>
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
        </>
    )
}