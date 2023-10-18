import './Checkers.css';
import LandingPage from '../../components/game/LandingPage';
import Checkers from './Checkers';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import Popup from "../minesweeper/Popup";

export default function CheckersLandingPage(isAuth) {

    const [showRules, setShowRules] = useState(false);

    return (
        <>
            <IconButton style={{ position: "fixed" }} onClick={() => setShowRules(true)}>
                <HelpIcon />
            </IconButton>

            <h1>Checkers</h1>

            <LandingPage isAuth={isAuth} game={<Checkers />} gameName="checkers" />
            {showRules &&
                <Popup
                    content={
                        <>
                            <h1>How to Connect</h1>
                            <h3>Type in the username of the player you wish to play against. When both players are connected, the game begins!</h3>
                            <h3>If you disconnect for any reason, as long as your opponent remains in the game you will be able to rejoin the game. </h3>
                            <h1>Rules</h1>
                            <h3>Be the first player to get three in a row of your symbol, either an X or an O.</h3>
                            <h3>If your opponent is taking too long you can start the move timer which ends the game after 15 seconds of inactivity.
                                If the timer runs out, whoever started the timer wins the game.</h3>
                        </>}
                    handleClose={() => setShowRules(false)}
                />}
        </>
    )
}