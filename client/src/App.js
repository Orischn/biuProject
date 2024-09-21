import './App.css';
import LoginPage from './loginPage/LoginPage';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

    const [token, setToken] = useState(null);

    return (
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<LoginPage token={token} setToken={setToken}/>} />
              <Route path='/loginPage' element={<LoginPage token={token} setToken={setToken}/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
