require('dotenv').config();
const express = require('express');
const cors = require('cors')
const path = require('path');
const http = require('http')
const fs = require('fs')
const app = express();


const options = {
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'OPTIONS'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
};

// SSL certificate and private key
// const sslOptions = {
//     key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
// };


app.use(cors(options))
app.use(express.json());
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