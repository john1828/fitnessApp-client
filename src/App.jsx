import { useEffect, useState } from "react";
import {Container} from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { UserProvider } from "../UserContext";
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Workouts from './pages/Workouts';
import './App.css'

function App() {

  return (
    <>
      <UserProvider>
        <Router>
          <AppNavbar />
          <Container>
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/register" element={<Register />}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/logout" element={<Logout />}/>
              <Route path="/workouts" element={<Workouts />}/>
            </Routes>
          </Container>
        </Router>
      </UserProvider>
    </>
  )
}

export default App
