import { AppBar, Toolbar, Button, Box, IconButton, ButtonGroup } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { Link, Outlet, useParams } from 'react-router-dom'

export default function Navbar() {
    return (
        <>
            <AppBar >
                <Toolbar>
                    <IconButton component={Link} to={"/"}>
                        <HomeIcon sx={{ color: "white" }} />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }}></Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </>
    )
}