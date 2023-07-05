import './auth.css';
import { useState } from 'react';
import { Button, TextField, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

export default function Login({ setIsAuth }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const cookies = new Cookies();

    async function login(e) {
        e.preventDefault();
        setIsLoading(true);
        await fetch("https://games-app-backend.onrender.com/auth/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: username, password: password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    setShowError(true);
                    setIsLoading(false);
                    return;
                }
                const { firstName, lastName, username, token, userId } = data;
                cookies.set("token", token, {
                    maxAge: 86400
                });
                cookies.set("userId", userId, {
                    maxAge: 86400
                });
                cookies.set("username", username, {
                    maxAge: 86400
                });
                cookies.set("firstName", firstName, {
                    maxAge: 86400
                });
                cookies.set("lastName", lastName, {
                    maxAge: 86400
                });
                setIsAuth(true);
                navigate("/");
            })
            .catch((error) => console.log(error));
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowError(false);
    };

    return (
        <>

            <div className="login">
                {!isLoading ?
                    <>
                        <h1>Log in to play online multiplayer with other users.</h1>
                        <form method='post' onSubmit={login} className='form'>
                            <label style={{ textAlign: "center", paddingBottom: "4%", paddingTop: "4%", fontSize: "30px" }}> Login</label>
                            <TextField
                                error={showError}
                                required
                                label="Username"
                                sx={{ paddingBottom: "4%" }}
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                }}
                            />
                            <TextField
                                error={showError}
                                required
                                label="Password"
                                type="password"
                                sx={{ paddingBottom: "4%" }}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                }}
                            />
                            <Button type='submit' variant='contained' sx={{ marginBottom: "4%" }}> Login</Button>
                            <a href='https://nolans-games.netlify.app/signup'>Need an account? Sign up here</a>
                        </form>
                    </> :
                    <div className='loader-container'>
                        <div className='spinner' />
                    </div>}
            </div>
            <Snackbar open={showError} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>Incorrect username or password!</Alert>
            </Snackbar>
        </>
    );
}