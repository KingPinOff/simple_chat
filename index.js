const express = require('express');
const path = require('path')


const http = require('http')
const { Server } = require('socket.io')

const app= express();
const server = http.createServer(app)

const io = new Server(server,{
    cors : {
        origin: "*",
        methods : ["GET","POST"]
    }
})
app.use(express.static("public"))

app.get('/',(req,res)=>{
    

    res.sendFile(path.join(__dirname,"public","index.html"))
})
server.listen(5500,()=>{
    console.log("hello")
})

const users = {}

io.on('connection',(socket)=>{
    console.log("A user connected");
    

    socket.on('new-entry',(name)=>{
        console.log(name+" joined the chat");
        users[socket.id] = name
        socket.broadcast.emit('user-joined',name);
    
    })
    socket.on('send',(message)=>
    {
        socket.broadcast.emit('recieve',{message:message,name :users[socket.id]})
    })

    socket.on('disconnect',()=>
    {   
        if (users[socket.id]){

            io.emit('leave',users[socket.id])
            delete users[socket.id]
        }   
    }
    )

})
