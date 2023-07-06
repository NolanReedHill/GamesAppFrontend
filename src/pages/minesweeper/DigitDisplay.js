import { Typography } from "@mui/material";

export default function DigitDisplay({ digit }) {

    function whichColor() {
        let color;
        switch (digit) {
            case 1:
                color = "blue";
                break;
            case 2:
                color = "green";
                break;
            case 3:
                color = "goldenrod";
                break;
            case 4:
                color = "purple";
                break;
            case 5:
                color = "red";
                break;
            case 6:
                color = "maroon";
                break;
            case 7:
                color = "navy";
                break;
            case 8:
                color = "crimson";
                break;
            default:
                color = "black";
        }
        return color;
    }

    return (
        <Typography color={whichColor} sx={{ margin: "auto", fontSize: "calc(1.5vw+12px)", }}>{digit}</Typography>
    )
}