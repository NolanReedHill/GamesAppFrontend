import './auth.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import Cookies from 'universal-cookie';

export default function Signup({ setIsAuth }) {
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
                const { token, userId, firstName, lastName, username, hashedPassword } =
                    data;
                cookies.set("token", token);
                cookies.set("userId", userId);
                cookies.set("username", username);
                cookies.set("firstName", firstName);
                cookies.set("lastName", lastName);
                cookies.set("hashedPassword", hashedPassword);
                setIsAuth(true);
                navigate("/");
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="login">
            <h1>Create an account to access online multiplayer with other users.</h1>
            {!isLoading ?
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
                    <a href='http://localhost:3000/login'>Already have an account? Login here</a>
                </form> :
                <h1>Signing You Up... Please Wait</h1>}
        </div>
    );


}