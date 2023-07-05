import './TicTacToe.css';
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import { useState, useEffect } from "react";

export default function Rematch({ reset, setReset }) {

    const [isRematch, setIsRematch] = useState(false);
    const [check, setCheck] = useState(false);

    const { channel } = useChannelStateContext();
    const { client } = useChatContext();

    useEffect(() => {
        channel.sendEvent({
            type: "rematch-accept",
            data: true,
        });
    }, []);

    channel.on((event) => {
        if (event.type === "rematch-accept" && event.user.id !== client.userID) {
            setCheck(true);
            setTimeout(() => {
                setCheck(false);
            }, 500);
        }
        if (event.type === "rematch-return" && event.user.id !== client.userID) {
            setIsRematch(true);
        }
    });

    useEffect(() => {
        if (check) {
            setIsRematch(true);
            channel.sendEvent({
                type: "rematch-return",
                data: true,
            });
        }
    }, [check])

    useEffect(() => {
        if (isRematch)
            setReset(!reset);
    }, [isRematch]);

    return (
        <>
            <h1>Waiting for opponent to accept...</h1>
            <div className='spinner' style={{ margin: "auto", marginBottom: "3%" }} />
        </>
    );

}