const express = require('express');
const app = express();
const http = require('http')

app.use(express.json());
app.use(express.static('public'));
app.use(require('./routes/token'))
app.use(require('./routes/login'))
app.use(require('./routes/chatbot'))
app.use(require('./routes/adminpanel'))

const server = http.createServer(app);

server.listen(5000);