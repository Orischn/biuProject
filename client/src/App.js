import './App.css';
import LoginPage from './loginPage/LoginPage';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StudentFeed from './studentFeed/StudentFeed';

function App() {
    const [username, setUsername] = useState(null);
    const [token, setToken] = useState(null);

    return (
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<LoginPage setUsername={setUsername} setToken={setToken}/>} />
              <Route path='/loginPage' element={<LoginPage setUsername={setUsername} setToken={setToken}/>} />
              <Route path='/studentFeed' element={ token ? 
              <StudentFeed token={token} username={username} /> :
              <LoginPage setUsername={setUsername} setToken={setToken}/> } />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
