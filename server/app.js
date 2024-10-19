const express = require('express');
const cors = require('cors')
const https = require('http')
const fs = require('fs')
const app = express();

const options = {
    origin: '*',
    allowedHeaders: '*'
}

// SSL certificate and private key
const sslOptions = {
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem')
};

app.use(cors(options))
app.use(express.json());
app.use(express.static('public'));
app.use(require('./routes/login'));
app.use(require('./routes/chatbot'));
app.use(require('./routes/adminpanel'));
app.use(require('./routes/user'));

const server = https.createServer(sslOptions, app);

server.listen(5000);