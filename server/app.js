const express = require('express');
const cors = require('cors')
const app = express();
const http = require('http')

const options = {
    origin: '*',
    allowedHeaders: '*'
}

app.use(cors(options))
app.use(express.json());
app.use(express.static('public'));
app.use(require('./routes/login'));
app.use(require('./routes/chatbot'));
app.use(require('./routes/adminpanel'));

const server = http.createServer(app);

server.listen(5000);