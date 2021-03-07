const mongoose = require("mongoose")
const models = require("./models")
const express = require("express")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

mongoose.connect('mongodb://localhost:27017/letschat', {useNewUrlParser: true, useUnifiedTopology: true});

let errors = [
    "Successful",
    "Invalid username/password",
   "Operation not allowed",
    "Username already exists",
    "Data missing",
    "Unknown Error"
];

function apiMessage(errorCode,data)
{
    return {status:errorCode,message:errors[errorCode],data:data}



}


let router = express.Router()



router.post('/login',(req,res)=>{
        
        let username = req.body.username;
        let password = req.body.password;
        const hash = crypto.createHash('sha256').update(password).digest('base64');

        console.log(req.body)
        models.User.findOne({username:username,password:hash}).then((user)=>{
         
                if(user)
                {
                    token = jwt.sign({username:username},"shaastra",{expiresIn: "2 days"}) // Synchronous Event (i.e it blocks the control until process is complete)
                    console.log(user)
                    return res.json(apiMessage(0,{name:user.name,token:token}))
                }
                else
                {
                    return res.json(apiMessage(1,{}))
                }

            



        })
     
        
})


router.get('/search/:query',(req,res)=>{
    query = req.params.query+".*"
    models.User.find({username:{$regex:new RegExp(query)}}).then((users)=>{
        searchResult = []
        users.forEach((user)=>{
            searchResult.push({username:user.username,name:user.name})
        })
        return res.json(searchResult)

    })
});


router.post('/register',(req,res)=>{
        let username = req.body.username;
        let password = req.body.password;

        const hash = crypto.createHash('sha256').update(password).digest('base64');
        let name = req.body.name;
        if(!username || !password || !name)
        {
            return res.json(apiMessage(4,{}))
        }

        if(username.trim()=="" || password.trim()=="" || name.trim()=="")
        {
            return res.json(apiMessage(4,{}))
        }
         // Check if username already exists
         
        models.User.find({username:username}).then((users)=>{
            console.log(users)
            if(users.length>0)
            {
                return res.json(apiMessage(3,{}));
            }
              // Store inside database
        let newUser = new models.User({username:username,password:hash,name:name})
        
        newUser.save((err,user)=>{
            if(err)
            {
                console.log(err)
                return res.json(apiMessage(5,{trace:err}))
            }
           
           return res.json(apiMessage(0,{}))

        })

       });
      
    
});


module.exports = router;