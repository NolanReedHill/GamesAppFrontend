import './auth.css';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

export default function Login({ setIsAuth }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
                const { firstName, lastName, username, token, userId } = data;
                cookies.set("token", token);
                cookies.set("userId", userId);
                cookies.set("username", username);
                cookies.set("firstName", firstName);
                cookies.set("lastName", lastName);
                setIsAuth(true);
                navigate("/");
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="login">
            <h1>Log in to play online multiplayer with other users.</h1>
            {!isLoading ?
                <form method='post' onSubmit={login} className='form'>
                    <label style={{ textAlign: "center", paddingBottom: "4%", paddingTop: "4%", fontSize: "30px" }}> Login</label>
                    <TextField
                        required
                        label="Username"
                        sx={{ paddingBottom: "4%" }}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                    />
                    <TextField
                        required
                        label="Password"
                        type="password"
                        sx={{ paddingBottom: "4%" }}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <Button type='submit' variant='contained' sx={{ marginBottom: "4%" }}> Login</Button>
                    <a href='http://localhost:3000/signup'>Need an account? Sign up here</a>
                </form> :
                <h1>Logging you in... Please wait</h1>}
        </div>
    );
}