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
  const [user, setUser] = useState({
      id: null,
    });

  function unsetUser(){
    localStorage.clear();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://fitnessapp-api-ln8u.onrender.com/users/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data._id) {
            setUser({
              id: data._id
            });
          } else {
            setUser({
              id: null
            });
          }
        })
        .catch(() => {
          setUser({
            id: null
          });
        });
    }
  }, []);

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user]);

  return (
    <>
      <UserProvider value={{ user, setUser, unsetUser }}>
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
