import './App.css'
import { useState } from 'react';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Homepage from "./pages/homepage/Homepage";
import Minesweeper from "./pages/minesweeper/Minesweeper";
import TicTacToeLandingPage from "./pages/ticTacToe/TicTacToeLandingPage";
import CheckersLandingPage from './pages/checkers/CheckersLandingPage';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import { StreamChat } from 'stream-chat';
import Cookies from 'universal-cookie';
import { Chat } from 'stream-chat-react';
import Placeholder from './pages/checkers/Placeholder';

export default function App() {
  const cookies = new Cookies();
  const [isAuth, setIsAuth] = useState(false);
  const client = StreamChat.getInstance(process.env.REACT_APP_api_key);
  const token = cookies.get("token");


  const theme =
    createTheme({
      palette: {
        primary: {
          main: "#036627"
        },
        secondary: {
          main: "#02ad40"
        },
      }
    });

  if (token) {
    client
      .connectUser(
        {
          id: cookies.get("userId"),
          name: cookies.get("username"),
          firstName: cookies.get("firstName"),
          lastName: cookies.get("lastName"),
          hashedPassword: cookies.get("hashedPassword"),
        },
        token
      )
      .then((user) => {
        setIsAuth(true);
      });
  }

  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <Chat client={client}>
          <BrowserRouter>
            <Navbar setIsAuth={setIsAuth} isAuth={isAuth} client={client} />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/minesweeper" element={<Minesweeper />} />
              <Route path="/checkers" element={<Placeholder />} />
              <Route path="/tic-tac-toe" element={<TicTacToeLandingPage isAuth={isAuth} />} />
              <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
              <Route path="/signup" element={<Signup setIsAuth={setIsAuth} />} />
            </Routes>
          </BrowserRouter>
        </Chat>
      </ThemeProvider>
    </div>
  )
}