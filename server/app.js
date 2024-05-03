const express = require('express');
const bodyParser=require('body-parser'); 
var cors = require('cors')
const app = express();
const http = require('http')

const { Server } = require('socket.io');
const { post } = require('./routes/token');

app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));
app.use(express.json());
app.use(express.static('public'));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'DELETE']
    }
});

server.listen(5000);