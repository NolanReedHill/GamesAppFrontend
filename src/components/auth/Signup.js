import './auth.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Snackbar, Alert } from '@mui/material';
import Cookies from 'universal-cookie';

export default function Signup({ setIsAuth }) {
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    async function signUp(e) {
        e.preventDefault();
        setIsLoading(true);
        await fetch("https://games-app-backend.onrender.com/auth/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ firstName: user.firstName, lastName: user.lastName, username: user.username, password: user.password })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setShowError(true);
                    setIsLoading(false);
                    return;
                }
                const { token, userId, firstName, lastName, username, hashedPassword } =
                    data;
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
                cookies.set("hashedPassword", hashedPassword, {
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
        <div className="login">
            {!isLoading ?
                <>
                    <h1>Create an account to access online multiplayer with other users.</h1>
                    <form method='post' onSubmit={signUp} className='form'>
                        <label style={{ paddingBottom: "4%", textAlign: "center", fontSize: "30px" }}> Sign Up</label>
                        <TextField
                            sx={{ paddingBottom: "4%" }}
                            label="First Name"
                            required
                            onChange={(event) => {
                                setUser({ ...user, firstName: event.target.value });
                            }}
                        />
                        <TextField
                            sx={{ paddingBottom: "4%" }}
                            label="Last Name"
                            required
                            onChange={(event) => {
                                setUser({ ...user, lastName: event.target.value });
                            }}
                        />
                        <TextField
                            error={showError}
                            sx={{ paddingBottom: "4%" }}
                            label="Username"
                            required
                            onChange={(event) => {
                                setUser({ ...user, username: event.target.value });
                            }}
                        />
                        <TextField
                            sx={{ paddingBottom: "4%" }}
                            label="Password"
                            required
                            type="password"
                            onChange={(event) => {
                                setUser({ ...user, password: event.target.value });
                            }}
                        />
                        <Button type='submit' variant='contained' sx={{ marginBottom: "4%" }}> Sign Up</Button>
                        <a href='https://nolans-games.netlify.app/login'>Already have an account? Login here</a>
                    </form>
                </> :
                <div className='loader-container'>
                    <div className='spinner' />
                </div>}
            <Snackbar open={showError} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>Username Taken</Alert>
            </Snackbar>
        </div>
    );


}