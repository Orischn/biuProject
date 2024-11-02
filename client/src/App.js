import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminFeed from './adminFeed/AdminFeed';
import LoginPage from './loginPage/LoginPage';
import RegisterPage from './registerPage/RegisterPage';
import StudentFeed from './studentFeed/StudentFeed';

function App() {
    const  [token, setToken] = useState(localStorage.getItem('accessToken'));
    return (
        <main>          
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<LoginPage setToken={setToken} />} />
                    <Route path='/loginPage' element={<LoginPage setToken={setToken} />} />
                    <Route path='/registerPage' element={<RegisterPage setToken={setToken} />} />
                    <Route path='/studentFeed' element={token ?
                        <StudentFeed token={localStorage.getItem('accessToken')} userId={localStorage.getItem('userId')} /> :
                        <LoginPage setToken={setToken} />} />
                    <Route path='/adminFeed' element={localStorage.getItem('accessToken') ?
                        <AdminFeed token={localStorage.getItem('accessToken')} userId={localStorage.getItem('userId')} /> :
                        <LoginPage setToken={setToken} />} />

                </Routes>
            </BrowserRouter>
        </main>
    )
}

export default App;
