import React from "react";
import { Button } from "@mui/material";
import { ChatAutoComplete, useMessageInputContext } from "stream-chat-react";

function CustomInput() {
    const { handleSubmit } = useMessageInputContext();
    return (
        <div className="str-chat__input-flat str-chat__input-flat--send-button-active">
            <div className="str-chat__input-flat-wrapper">
                <div className="str-chat__input-flat--textarea-wrapper">
                    <ChatAutoComplete />
                </div>
                <Button variant="contained" size="small" onClick={handleSubmit}> Send Message</Button>
            </div>
        </div>
    );
}

export default CustomInput;