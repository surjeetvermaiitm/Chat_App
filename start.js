const express = require("express")

const app = express()

const chatServerHTTP = require("http").Server(app)
const io = require("socket.io")(chatServerHTTP)
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")




// Chat functionality


users = {}



io.on('connection',(socket)=>{
    console.log(socket)
    try
    {
        let user = jwt.verify(socket.handshake.query["token"],"shaastra")
        console.log(user)
        if(user)
        {
            users[user.username] = socket
        }

        socket.emit('message',{dataType:"text",data:"Hello",senderType:0})
        socket.on('sendMessage',(data)=>{
            
            if(users.hasOwnProperty(data.sendTo))
            {
                data.sender = user.username
                users[data.sendTo].emit("message",data)
            }
        })
        socket.on('disconnect',()=>{
            delete users[user.username]
            console.log("disconnected")
        })
    }
    catch(err)
    {
        console.log("error")
        socket.emit('wrongtoken',{})
        socket.disconnect()
    }
   


})







// Core App functionality

app.use(bodyParser.json())






const apiRouter = require("./api")

app.use('/api',apiRouter)



// Send frontend web page and static files to user
app.get('/',(req,res)=>{
    res.sendFile(process.cwd() + "/frontend/chat.html")
})

app.get('/:fileName',(req,res)=>{
        res.sendFile(process.cwd() + "/frontend/"+req.params.fileName)
}) 






chatServerHTTP.listen(8080,()=>{
    console.log("Chat App started")
})
