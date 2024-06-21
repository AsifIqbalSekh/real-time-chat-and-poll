const jwt = require('jsonwebtoken');
const users = [];
const SECRET_KEY = 'your-secret-key';



function registerUser(username, password) {
    const user = { username, password };
    const check = users.find(u => u.username === username);
    if(check){
        return { username, status: 400, message:"User Already Exists!" };
    }
    users.push(user);
    return { username, status: 201 };
}

function authenticateUser(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ username }, SECRET_KEY);
        return { token };
    }
    return null;
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (err) {
        return null;
    }
}

module.exports = { registerUser, authenticateUser, verifyToken };