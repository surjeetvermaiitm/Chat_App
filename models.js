const mongoose = require("mongoose")


// Define Database schema here


let usersSchema = mongoose.Schema({

    username:String,
    password:String,
    name:String

});


let chatSchema  = mongoose.Schema({
    sender:String,
    reciever:String,
    content:String,
    datetime:Date
})

const User = mongoose.model("User",usersSchema)
const Chat = mongoose.model("Chat",chatSchema)

module.exports = {User:User,Chat:Chat}
