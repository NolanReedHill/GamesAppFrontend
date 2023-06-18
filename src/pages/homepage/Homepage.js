import './Homepage.css'
import background from './images/board games.jpg';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IconButton, ButtonGroup } from '@mui/material';

export default function Homepage() {



    return (
        <>
            <img src={background} className='background' />
            <div className='homepageDivision' style={{ background: background }}>
                <h1 style={{
                    fontSize: "calc(5vw)", background: "rgba(128, 235, 52, .5)", width: "fit-content",
                    margin: "auto", marginTop: "3%", position: "fixed", left: "15%", right: "15%"
                }}>Welcome to My Games Page!</h1>
            </div>
            <div className='homeText'>
                <h2>I made this page to create some games with React. Feel free to check them out and post to the leaderboard!</h2>
                <ButtonGroup sx={{ width: "10%", margin: "auto", justifyContent: "center" }}>
                    <a href='https://www.linkedin.com/in/nolan-hill-b980981b1/' target='_blank'>
                        <IconButton>
                            <LinkedInIcon sx={{ fontSize: "50px", color: "black" }} />
                        </IconButton>
                    </a>
                    <FiberManualRecordIcon sx={{ margin: "auto", width: "50%", fontSize: "10px" }} />
                    <a href='https://github.com/NolanReedHill' target='_blank'>
                        <IconButton>
                            <GitHubIcon sx={{ fontSize: "50px", color: "black" }} />
                        </IconButton>
                    </a>
                </ButtonGroup>
            </div>
        </>
    )
}