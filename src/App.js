import React, { useMemo } from "react";
import './App.css'
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Homepage from "./pages/homepage/Homepage";
import Minesweeper from "./pages/minesweeper/Minesweeper";

export default function App() {

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

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/minesweeper" element={<Minesweeper />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}