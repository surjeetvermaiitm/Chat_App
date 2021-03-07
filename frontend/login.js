function handleLogin()
{
    username = document.getElementById("username").value
    password = document.getElementById("password").value


    fetch("/api/login",{
        method:'POST',
        body:JSON.stringify({username:username,password:password}),
        headers: {
            'Content-Type': 'application/json'
          }
    }).then((response)=>{
       
   
         response.json().then((data)=>{
             
            if(data.status != 0)
            {
                reportError(data.message)
    
            }
            else
            {
                token = data.data.token
                document.cookie = "token="+token+";samesite=strict"
                document.cookie = "username="+username+";samesite=strict"
                window.location="/chat.html"
            }

        })

      

    })
    

}
function reportError(string)
{
    document.getElementById("error").innerHTML=string;
}