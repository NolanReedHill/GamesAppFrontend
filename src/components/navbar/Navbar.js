import { AppBar, Toolbar, Button, Box, IconButton, ButtonGroup, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { Link, Outlet, useParams } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Cookies from "universal-cookie";

export default function Navbar({ setIsAuth, isAuth, client }) {

    const cookies = new Cookies();

    const logOut = () => {
        cookies.remove("token");
        cookies.remove("userId");
        cookies.remove("firstName");
        cookies.remove("lastName");
        cookies.remove("hashedPassword");
        cookies.remove("channelName");
        cookies.remove("username");
        client.disconnectUser();
        setIsAuth(false);
    };

    return (
        <>
            <AppBar >
                <Toolbar>
                    <IconButton component={Link} to={"/"}>
                        <HomeIcon sx={{ color: "white" }} />
                    </IconButton>
                    {cookies.get("username") &&
                        <Typography sx={{ marginRight: "1%", marginTop: ".1%" }}>Hello, {cookies.get("username")}</Typography>}
                    <ButtonGroup disableElevation >
                        <Button sx={{ color: "white" }} className='navButtons' component={Link} to={"/minesweeper"}>Minesweeper</Button>
                        <Button sx={{ color: "white" }} className='navButtons' component={Link} to={"/ticTacToe"}>Tic Tac Toe</Button>
                    </ButtonGroup>
                    {isAuth ?
                        <IconButton onClick={logOut} component={Link} to={"/"}>
                            <label style={{ color: "white", position: "fixed", right: "4%", top: "1.4%" }} className='buttonLabel'>Logout</label>
                            <LogoutIcon sx={{ color: "white", position: "fixed", right: "2%" }} />
                        </IconButton>
                        :
                        <IconButton component={Link} to={"/login"}>
                            <label style={{ color: "white", position: "fixed", right: "4%", top: "1.4%" }} className='buttonLabel'>Login</label>
                            <LoginIcon sx={{ color: "white", position: "fixed", right: "2%" }} />
                        </IconButton>}
                    <Box sx={{ flexGrow: 1 }}></Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </>
    )
}