
import React, { useState, useEffect } from "react";
import Timer from "./Timer";

function StopWatch({ numBoxes, bombsVisible, isWin, setFinalTime }) {
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        let interval = null;

        if (isActive && isPaused === false) {
            interval = setInterval(() => {
                setTime((time) => time + 10);
            }, 10);
        } else {
            clearInterval(interval);
            setFinalTime(time);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isActive, isPaused]);

    const handleStart = () => {
        setTime(0)
        setIsActive(true);
    };

    useEffect(() => {
        handleStart();
    }, [numBoxes])

    useEffect(() => {
        if (bombsVisible)
            setIsPaused(true);
        if (isWin)
            setIsPaused(true);
    }, [bombsVisible, isWin])

    return (
        <div className="stop-watch">
            <Timer time={time} />
        </div>
    );
}

export default StopWatch;