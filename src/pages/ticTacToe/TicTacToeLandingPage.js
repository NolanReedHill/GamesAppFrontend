import "./TicTacToe.css";
import { Channel } from "stream-chat-react";
import { useState } from "react";
import TicTacToe from "./TicTacToe";
import CustomInput from "./CustomInput";

export default function TicTacToeLandingPage({ isAuth, client }) {

    const [rivalUsername, setRivalUsername] = useState("");
    const [channel, setChannel] = useState(null);
    async function createChannel() {
        const response = await client.queryUsers({ name: { $eq: rivalUsername } });

        if (response.users.length === 0) {
            alert("User not found");
            return;
        }
        const newChannel = await client.channel("messaging", {
            members: [client.userID, response.users[0].id],
        });
        await newChannel.watch();
        setChannel(newChannel);
    };

    return (
        <>
            {isAuth ?
                <>
                    {channel ? (
                        <Channel channel={channel} Input={CustomInput}>
                            <TicTacToe />
                        </Channel>
                    ) : (
                        <div className="joinGame">
                            <h4>Create Game</h4>
                            <input
                                placeholder="Username of rival..."
                                onChange={(event) => {
                                    setRivalUsername(event.target.value);
                                }}
                            />
                            <button onClick={createChannel}> Join/Start Game</button>
                        </div>
                    )}
                </> :
                <div className="landingPageNoAuth">
                    <h1>An account is needed to play this game. </h1>
                    <a href="http://localhost:3000/login" style={{ textAlign: "center", marginBottom: "1%", fontSize: "30px" }}>Log in here.</a>
                    <a href="http://localhost:3000/signup" style={{ textAlign: "center", fontSize: "30px" }}>Need an account? Sign up here. </a>
                </div>
            }
        </>
    )
}