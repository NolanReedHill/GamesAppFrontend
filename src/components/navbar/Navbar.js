import { AppBar, Toolbar, Button, Box, IconButton, ButtonGroup, Typography, Snackbar, Alert, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { Link } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import Cookies from "universal-cookie";

export default function Navbar({ setIsAuth, isAuth, client }) {

    const [logout, setLogout] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const cookies = new Cookies();

    const logOut = () => {
        setLogout(true);
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
                        <IconButton onClick={() => setIsOpen(true)} component={Link} to={"/"} title='Logout'>
                            <LogoutIcon sx={{ color: "white", position: "fixed", right: "2%" }} />
                        </IconButton>
                        :
                        <IconButton component={Link} to={"/login"} title='Login'>
                            <LoginIcon sx={{ color: "white", position: "fixed", right: "2%" }} />
                        </IconButton>}
                    <Box sx={{ flexGrow: 1 }}></Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Dialog open={isOpen}
                onClose={() => setIsOpen(false)}>
                <DialogTitle>
                    Logout?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => {
                        setIsOpen(false);
                        logOut();
                    }}
                        color="primary">
                        Confirm</Button>
                    <Button onClick={() => setIsOpen(false)} color='error'>Go Back</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={logout} autoHideDuration={4000} onClose={() => setLogout(false)}>
                <Alert onClose={() => setLogout(false)} severity="success" sx={{ width: '100%' }}>Logged out of account</Alert>
            </Snackbar>
        </>
    )
}