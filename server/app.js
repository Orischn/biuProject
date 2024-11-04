require('dotenv').config();
const express = require('express');
const cors = require('cors')
const path = require('path');
const http = require('http')
const fs = require('fs')
const app = express();


const options = {
    origin: 'http://localhost:3000',
    credentials: true,
};

// SSL certificate and private key
// const sslOptions = {
//     key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
// };


app.use(cors(options))
app.use(express.json({ 'limit': '5mb' }));
app.use(express.static('public'));
app.use(require('./routes/login'));
app.use(require('./routes/chatbot'));
app.use(require('./routes/adminpanel'));
app.use(require('./routes/user'));

// const server = http.createServer(sslOptions, app);
const server = http.createServer(app);

server.listen(5000);

// server.listen(5000, () => {
//     console.log('Server running at http://localhost:5000/');
// });