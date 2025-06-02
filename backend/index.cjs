const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const crypto = require('crypto')


const mocks = {
    users: [
        {
            name: "Incognito",
            token: "Incognito-token",
        },
        {
            name: "Guest",
            token: "Guest-token",
        },
        {
            name: "Test",
            token: "Test-token",
        },
    ]
}

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
})

app.use(cors())
app.use(bodyParser.json())

let users = mocks.users
let chats = []
let messages = []
// let groups = [{ id: '1', name: 'General' }]
let onlineUsers = {}

const getLastMessageFromChat = (messages, chatId) => {
    const messagesFromChat = messages.filter(message => chatId === message.chatId)
    const sortedMessages = messagesFromChat.sort((a, b) => b.timestamp - a.timestamp)

    return sortedMessages[0] ?? null
}

app.post('/api/login', (req, res) => {
    const { username } = req.body
    const token = `${username}-token`
    if (!users.some(user => user.name === username)) users.push({ name: username, id: token })
    res.json({ token, username })
})

app.get('/api/groups', (req, res) => {
    res.json(groups)
})

app.get('/api/chats', (req, res) => {
    let responseChats = chats

    if (req.query.username) {
        responseChats = chats.filter(chat => chat.users.includes(req.query.username))
    }

    const chatsWithMessages = responseChats.map((chat) => {
        const lastMessage = getLastMessageFromChat(messages, chat.id)

        return {
            ...chat,
            messages: lastMessage ? [lastMessage] : [],
        }
    })
    res.json(chatsWithMessages)
})

app.get('/api/messages/:chatId', (req, res) => {
    let result = messages
    if (req.params.chatId !== undefined) {
        result = messages.filter((message) => message.chatId === req.params.chatId)
    }
    res.json(result)
})

app.get('/api/users', (req, res) => {
    const usersWithStatus = users.map((user) => ({...user, isOnline: Object.values(onlineUsers).includes(user.name)}))
    res.json(usersWithStatus)
})

io.on('connection', (socket) => {
    console.log('New client connected')

    socket.on('join', ({ username }) => {
        onlineUsers[socket.id] = username
        io.emit('onlineUsers', Object.values(onlineUsers))
    })

    socket.on('disconnect', () => {
        delete onlineUsers[socket.id]
        io.emit('onlineUsers', Object.values(onlineUsers))
        console.log('Client disconnected')
    })

    // {username, chatId}
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username)
    })

    socket.on('stopTyping', (username) => {
        socket.broadcast.emit('stopTyping', username)
    })
})

app.post('/api/chats', (req, res) => {
    const { users, sender } = req.body

    if (!users || users.length !== 2) {
        res.status(400).send('Users must not be empty')
        return
    }

    const newChat = {
        users,
        id: crypto.randomUUID(),
        messages: []
    }
    chats.push(newChat)

    if (newChat && sender) {
        const emitToUsers = newChat.users.filter((user) => user !== sender)
        const emitToSockets = emitToUsers.map((username) => Object.keys(onlineUsers).find((socketId) => onlineUsers[socketId] === username))

        emitToSockets.forEach(socket => {
            if (socket) io.to(socket).emit('newChat', newChat)
        })
    }

    res.json(newChat)
})

app.post('/api/messages', (req, res) => {
    const {text, sender, chatId} = req.body

    if (!text || text.trim() === '') {
        res.status(400).send('Text must not be empty')
        return
    }

    if (!sender) {
        res.status(400).send('Sender must not be empty')
        return
    }

    if (!chatId) {
        res.status(400).send('ChatId must not be empty')
        return
    }

    const newMessage = {
        id: crypto.randomUUID(),
        timestamp: new Date().getTime(),
        text,
        sender,
        chatId,
    }
    messages.push(newMessage)

    const currentChat = chats.find((chat) => chat.id === chatId)

    if (currentChat && newMessage) {
        const emitToUsers = currentChat.users.filter((user) => user !== sender)
        const emitToSockets = emitToUsers.map((username) => Object.keys(onlineUsers).find((socketId) => onlineUsers[socketId] === username))

        emitToSockets.forEach(socket => {
            if (socket) io.to(socket).emit('newMessage', newMessage)
        })
    }

    res.json(newMessage)
})

const PORT = 3001
server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
})