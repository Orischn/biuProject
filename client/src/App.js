import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminFeed from './adminFeed/AdminFeed';
import LoginPage from './loginPage/LoginPage';
import RegisterPage from './registerPage/RegisterPage';
import StudentFeed from './studentFeed/StudentFeed';

function App() {
    const [userId, setUserId] = useState(null);

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginPage setUserId={setUserId} />} />
                <Route path='/loginPage' element={<LoginPage setUserId={setUserId} />} />
                <Route path='/registerPage' element={<RegisterPage />} />
                <Route path='/studentFeed' element={localStorage.accessToken ?
                    <StudentFeed token={localStorage.accessToken} userId={userId} /> :
                    <LoginPage setUserId={setUserId} />} />
                <Route path='/adminFeed' element={localStorage.accessToken ?
                    <AdminFeed token={localStorage.accessToken} userId={userId} /> :
                    <LoginPage setUserId={setUserId} />} />

            </Routes>
        </BrowserRouter>
    )
}

export default App;
