import "./TicTacToe.css";
import { Channel, useChatContext } from "stream-chat-react";
import { useState } from "react";
import Game from "./Game";
import CustomInput from "./CustomInput";
import { Button, TextField, Snackbar, Alert, IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import Popup from "../minesweeper/Popup";

export default function TicTacToeLandingPage({ isAuth }) {

    const { client } = useChatContext();
    const [rivalUsername, setRivalUsername] = useState("");
    const [channel, setChannel] = useState(null);
    const [showError, setShowError] = useState(false);
    const [showRules, setShowRules] = useState(false);
    async function createChannel() {
        if (rivalUsername === client.user.name) {
            setShowError("You can't pick yourself");
            return;
        }
        const response = await client.queryUsers({ name: { $eq: rivalUsername } });

        if (response.users.length === 0) {
            setShowError("User not found");
            return;
        }
        const newChannel = await client.channel("messaging", {
            members: [client.userID, response.users[0].id],
        });
        await newChannel.watch();
        setChannel(newChannel);
    };

    function handleClose() {
        setShowError(false);
    }

    return (
        <>
            <IconButton style={{ position: "fixed" }} onClick={() => setShowRules(true)}>
                <HelpIcon />
            </IconButton>
            {isAuth ?
                <>
                    {channel ? (
                        <Channel channel={channel} Input={CustomInput}>
                            <Game channel={channel} setChannel={setChannel} />
                        </Channel>
                    ) : (
                        <div className="joinGame">
                            <h1>Create Game</h1>
                            <h2>Enter the username of the player you want to play against.</h2>
                            <TextField
                                helperText={showError}
                                error={showError}
                                sx={{ margin: "auto" }}
                                size="small"
                                placeholder="Username of rival..."
                                onChange={(event) => {
                                    setRivalUsername(event.target.value);
                                }}
                            />
                            <Button variant="contained" onClick={createChannel} sx={{ width: "fit-content", margin: "auto", marginTop: "10px" }}> Join/Start Game</Button>
                        </div>
                    )}
                </> :
                <div className="landingPageNoAuth">
                    <h1>An account is needed to play this game. </h1>
                    <a href="https://nolans-games.netlify.app/login" style={{ textAlign: "center", marginBottom: "1%", fontSize: "30px" }}>Log in here.</a>
                    <a href="https://nolans-games.netlify.app/signup" style={{ textAlign: "center", fontSize: "30px" }}>Need an account? Sign up here. </a>
                </div>
            }
            <Snackbar open={showError} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>{showError}</Alert>
            </Snackbar>
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