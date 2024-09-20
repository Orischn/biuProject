import './App.css';
import LoginPage from './loginPage/LoginPage';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/loginPage' element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
