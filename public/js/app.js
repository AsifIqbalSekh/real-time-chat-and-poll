let socket;
let token;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('messageInput').addEventListener('blur', stopTyping);
    document.getElementById('messageInput').addEventListener('input', typing);
});

async function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.status == 201) {
            document.getElementById('registrationForm').style.display = 'none';
            document.getElementById('registrationSuccess').style.display = 'block';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token;

            document.getElementById('auth').style.display = 'none';
            document.getElementById('poll').style.display = 'block';
            document.getElementById('chat').style.display = 'block';

            initializeSocket();
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loginError').style.display = 'block';
    }
}

function initializeSocket() {
    socket = io({
        auth: { token }
    });

    socket.on('initialData', ({ polls, chatMessages }) => {
        updatePolls(polls);
        chatMessages.forEach(msg => addMessage(msg));
    });

    socket.on('updatePolls', (polls) => {
        updatePolls(polls);
    });

    socket.on('newMessage', (msg) => {
        addMessage(msg);
    });

    socket.on('userJoined', (username) => {
        const li = document.createElement('li');
        li.innerText = `${username} joined the chat`;
        document.getElementById('messages').appendChild(li);
    });

    socket.on('userLeft', (username) => {
        const li = document.createElement('li');
        li.innerText = `${username} left the chat`;
        document.getElementById('messages').appendChild(li);
    });

    socket.on('typing', (username) => {
        document.getElementById('typingIndicator').innerText = `${username} is typing...`;
    });

    socket.on('stopTyping', () => {
        document.getElementById('typingIndicator').innerText = '';
    });

    socket.on('alreadyVoted', (data) => {
        alert(data.message);
    });
}

function createPoll() {
    const topic = document.getElementById('pollTopic').value;
    const option1 = document.getElementById('pollOption1').value;
    const option2 = document.getElementById('pollOption2').value;
    socket.emit('createPoll', { topic, options: [option1, option2] });
}

function vote(topic, option) {
    socket.emit('vote', { topic, option });
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const msg = input.value;
    socket.emit('chatMessage', msg);
    input.value = '';
    socket.emit('stopTyping');
}

function addMessage(msg) {
    const li = document.createElement('li');
    li.innerText = `${msg.user}: ${msg.text}`;
    document.getElementById('messages').appendChild(li);
}

function updatePolls(polls) {
    const pollsDiv = document.getElementById('polls');
    pollsDiv.innerHTML = '';
    for (const topic in polls) {
        const pollDiv = document.createElement('div');
        const topicHeader = document.createElement('h3');
        topicHeader.innerText = topic;
        pollDiv.appendChild(topicHeader);
        for (const option in polls[topic]) {
            const optionButton = document.createElement('button');
            optionButton.innerText = `${option} (${polls[topic][option]})`;
            optionButton.onclick = () => vote(topic, option);
            pollDiv.appendChild(optionButton);
        }
        pollDiv.style.marginBottom = '20px'; 
        pollsDiv.appendChild(pollDiv);
    }
}

function vote(topic, option) {
    socket.emit('vote', { topic, option });
}

document.getElementById('messageInput').addEventListener('input', () => {
    socket.emit('typing');
});

function typing() {
    socket.emit('typing', document.getElementById('loginUsername').value);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(stopTyping, 3000);
}

function stopTyping() {
    socket.emit('stopTyping');
}