function handleRegister()
{
    username = document.getElementById("username").value
    password = document.getElementById("password").value
    name = document.getElementById("name").value


    fetch("/api/register",{
        method:'POST',
        body:JSON.stringify({username:username,password:password,name:name}),
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
                alert("Successfully Registered!")
                window.location="/login.html"
            }

        })

      

    })
    

}
function reportError(string)
{
    document.getElementById("error").innerHTML=string;
}