const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');
const { registerUser, authenticateUser, verifyToken } = require('./auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

let polls = {};
let chatMessages = [];
let typingUsers = {};
let userVotes = {}; // Track votes per user

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const user = registerUser(username, password);
    res.status(user.status).send(user);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const token = authenticateUser(username, password);
    if (token) {
        res.status(200).send(token);
    } else {
        res.status(401).send({ error: 'Invalid credentials' });
    }
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const user = verifyToken(token);
    if (user) {
        socket.user = user;
        next();
    } else {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    socket.broadcast.emit('userJoined', socket.user.username);

    socket.emit('initialData', { polls, chatMessages });

    socket.on('createPoll', ({ topic, options }) => {
        polls[topic] = options.reduce((acc, option) => {
            acc[option] = 0;
            return acc;
        }, {});
        io.emit('updatePolls', polls);
    });

    socket.on('vote', ({ topic, option }) => {
        if (polls[topic] && polls[topic][option] !== undefined) {
            // Check if user has already voted
            if (!userVotes[socket.user.username]) {
                userVotes[socket.user.username] = {};
            }
            if (!userVotes[socket.user.username][topic]) {
                polls[topic][option]++;
                userVotes[socket.user.username][topic] = true;
                io.emit('updatePolls', polls);
            } else {
                socket.emit('alreadyVoted', { message: 'You have already voted on this topic.' });
            }
        }
    });

    socket.on('chatMessage', (msg) => {
        const message = { user: socket.user.username, text: msg };
        chatMessages.push(message);
        io.emit('newMessage', message);
    });

    socket.on('typing', () => {
        typingUsers[socket.user.username] = true;
        socket.broadcast.emit("typing", socket.user.username);
    });

    socket.on('stopTyping', () => {
        delete typingUsers[socket.user.username];
        socket.broadcast.emit('stopTyping');
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('userLeft', socket.user.username);
    });
});

app.get("/test",(req,res)=>{
    res.json({"msg":"App is working fine", "Status":True})
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});