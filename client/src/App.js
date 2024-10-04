import LoginPage from './loginPage/LoginPage';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StudentFeed from './studentFeed/StudentFeed';
import AdminFeed from './adminFeed/AdminFeed';

function App() {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginPage setUserId={setUserId} setToken={setToken} />} />
                <Route path='/loginPage' element={<LoginPage setUserId={setUserId} setToken={setToken} />} />
                <Route path='/studentFeed' element={token ?
                    <StudentFeed token={token} userId={userId} /> :
                    <LoginPage setUserId={setUserId} setToken={setToken} />} />
                <Route path='/adminFeed' element={token ?
                    <AdminFeed token={token} userId={userId} /> :
                    <LoginPage setUserId={setUserId} setToken={setToken} />} />

            </Routes>
        </BrowserRouter>
    )
}

export default App;
