
// All chat related code (socket.io events etc.) will go here.


var socket = io({
    query:{
        "token":getCookieValue("token")
    }
})
socket.on('wrongtoken',()=>{
    window.location="/login.html"
})
files = {}
socket.on('message',(data)=>{
    if(data.dataType=="text")
    {
        console.log(data.sendTo)
        if(data.sender == getActiveUser())
        {
            let str = data.data.replaceAll(/</g,"")
             str = str.replaceAll(/>/g,"") // Prevent cross site scripting
           
            addMessageByReciever(str,data.date,"")
        }
    
    }
    else if(data.dataType=="file")
    {
        if(data.sender == getActiveUser())
        {
          if(!files.hasOwnProperty(data.fileId))
          {
           
           
            files[data.fileId] = {chunks:{},chunksRecieved:0,fileName:data.fileName,fileSize:data.fileSize}
            console.log("done")
           
          }
          
         
          files[data.fileId].chunks[data.chunkPosition] = data.data
          files[data.fileId].chunksRecieved = files[data.fileId].chunksRecieved+1
          
          console.log(data.totalChunks)
          
          if(files[data.fileId].chunksRecieved==data.totalChunks)
          {
              // File Recieved. Convert to binary and give link to download
              console.log(files)
        
             let fullFile = []
            for(let pos=0;pos<data.totalChunks;pos++)
            {
                fullFile.push(new Uint8Array(files[data.fileId].chunks[pos]))
            }
            
            if(data.fileType == "" || data.fileType == undefined)
            {
                data.fileType = "application/octet-stream"
            }

             blob =  new Blob(fullFile,{
                type:data.fileType
             })
             
             url = URL.createObjectURL(blob)
             addFileByReciever(url,new Date(),"")
              
              
          }
        }
    }
  
})


async function search()
{
    query = document.getElementById("searchBox").value
    
    
    fetch("/api/search/"+query).then(async (res)=>{
        result = await res.json()
        console.log(result)
        usersList = []
        result.forEach((user)=>{
            usersList.push(new User(user.name,user.username,"",false))

        })
        setUsersList(usersList)
        

    })
}



async function uploadFile()
{
    window.requestAnimationFrame = window.requestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||             
                               window.msRequestAnimationFrame;
    document.getElementById("uploadStatus").innerHTML="Uploading...";
   
   let file = document.getElementById("fileBox").files[0];
   let fileSize= file.size
   let fileName=file.name
   let fileId = fileName+Math.random().toString() // Unique identifier for the file
   let chunkSize = 2000
   let totalChunks = Math.ceil(fileSize/chunkSize);
   let chunks = []
   
   for(let i=0;i<=fileSize;i=i+chunkSize)
   {
   
        chunks.push(file.slice(i,i+chunkSize)) 
   }
   for(let chunkNumber in chunks)
   {
       chunk = chunks[chunkNumber]
      
     
        console.log(chunkNumber)   
        socket.emit("sendMessage",{dataType:"file",fileType:file.type,chunkSize:chunkSize,totalChunks:totalChunks,chunkPosition:chunkNumber,data:chunk,sendTo:getActiveUser(),fileName:fileName,fileSize:fileSize,fileId:fileId});
     }
     document.getElementById("uploadStatus").innerHTML="Upload complete.";
  

   
}

function send()
{
    message = document.getElementById("messageBox").value
    sendTo = document.getElementById("sendTo").value
    date = new Date()
    socket.emit("sendMessage",{sendTo:sendTo,dataType:"text",data:message,date:date})
    let str = message.replaceAll(/</g,"")
     str = str.replaceAll(/>/g,"")
    
    addMessageBySender(str,date,"")
}
