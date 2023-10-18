import './Game.css';
import { Channel, useChatContext } from "stream-chat-react";
import { useState } from "react";
import Game from "./Game";
import CustomInput from './CustomInput';
import { Button, TextField, Snackbar, Alert } from '@mui/material';

export default function LandingPage({ isAuth, game, gameName }) {

    const { client } = useChatContext();
    const [rivalUsername, setRivalUsername] = useState("");
    const [channel, setChannel] = useState(null);
    const [showError, setShowError] = useState(false);

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
        let IDs = [client.userID, response.users[0].id];
        IDs.sort();
        let stringIDs = IDs[0] + IDs[1];
        console.log(IDs);
        console.log(stringIDs);
        const newChannel = await client.channel("messaging", (gameName + stringIDs).substring(0, 64), {
            members: [client.userID, response.users[0].id],
        });

        await newChannel.watch();
        setChannel(newChannel);
    };

    async function disconnect() {
        await channel.stopWatching();
        setChannel(null);
    }


    function handleClose() {
        setShowError(false);
    }

    return (
        <>
            {isAuth ?
                <>
                    {channel ? (
                        <Channel channel={channel} Input={CustomInput}>
                            <Game channel={channel} disconnect={disconnect} game={game} />
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
                    <a href="https://nolans-games.netlify.app/login" style={{ textAlign: "center", marginBottom: "1%", fontSize: "30px", width: "fit-content", margin: "auto" }}>
                        Log in here.</a>
                    <a href="https://nolans-games.netlify.app/signup" style={{ textAlign: "center", fontSize: "30px", width: "fit-content", margin: "auto" }}>
                        Need an account? Sign up here. </a>
                </div>
            }
            <Snackbar open={showError} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>{showError}</Alert>
            </Snackbar>
        </>
    )

}