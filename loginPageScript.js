let login=document.querySelector(".login");
let loginBox=document.querySelector(".login-box");
let body=document.querySelector("body");
body.spellcheck=false;
let link=document.querySelector(".link");

let loginUsername=document.querySelector("#login-username");
let loginPassword=document.querySelector("#login-password");
let signInBtn=document.querySelector("#signIn-btn");
let hr=document.querySelector(".hr");
let forgotPassword=document.querySelector(".foot");
let isForgotOn=false;
let forgotPasswordEmail="";

let signUpUsername=document.querySelector("#signUp-username");
let signUpPassword=document.querySelector("#signUp-password");
let signUpRepeatPassword=document.querySelector("#signUp-Repeatpassword");
let signUpEmailID=document.querySelector("#signUp-emailID");
let signUpBtn=document.querySelector("#signUp-btn");

let oldUsername="";
let oldPassword="";

let newUsername="";
let newPassword="";
let newRepeatPassword="";
let newEmailID="";

// ---------------------- Initialisation Step of Local Storage for saving Email Id and Password ----------------------------------------
if(!localStorage.getItem("loginArr"))
{
    localStorage.setItem("loginArr",JSON.stringify([]));
}

// --------------------------- LOGIN Interface Functionality ------------------------------------------------------
loginUsername.addEventListener("input", function(e){
    oldUsername=e.currentTarget.value;
});

loginPassword.addEventListener("input", function(e){
    oldPassword=e.currentTarget.value;
});

signInBtn.addEventListener("click", function(e){
    if(oldUsername=="")
    {
        alert("Enter your Username.");
        return;
    }
    if(oldPassword=="")
    {
        alert("Enter your Password.");
        return;
    }

    let loginArr=JSON.parse(localStorage.getItem("loginArr"));
    for(let i=0;i<loginArr.length;i++)
    {
        if(loginArr[i].Username!=oldUsername)
        {
            continue;
        }
        else
        {
            if(loginArr[i].Password!=oldPassword)
            {
                continue;
            }
            else
            {
                loginUsername.value="";
                loginPassword.value="";
                oldUsername="";
                oldPassword="";
                // alert("Username and Password matched.");
                link.href="index.html";
                return;
            }
        }
    }
    alert("Entered Username or Password is Invalid.");
    loginUsername.value="";
    loginPassword.value="";
    oldUsername="";
    oldPassword="";
});

forgotPassword.addEventListener("click", function(e){
    if(isForgotOn==false)
    {
        isForgotOn=true;
        let div=document.createElement("div");
        div.classList.add("group");
        div.classList.add("forgotPasswordDiv");
        div.innerHTML=`<label for="pass" class="label">Email Address</label> <input id="forgotPassword-emailID" type="email" class="input" placeholder="Enter your Email Address">`;
        login.append(div);

        let getPasswordDiv=document.createElement("div");
        getPasswordDiv.classList.add("group");
        getPasswordDiv.innerHTML=`<input id="getPassword-btn" type="submit" class="button" value="Get Password" style="margin-top: 1rem;">`;
        login.append(getPasswordDiv);

        hr.style.marginTop="20px";
        forgotPassword.style.marginTop="-25px";
        loginBox.style.minHeight="565px";

        let forgotPasswordEmailID=document.querySelector("#forgotPassword-emailID");
        forgotPasswordEmailID.addEventListener("input", function(e){
            forgotPasswordEmail=e.currentTarget.value;
        });

        let getPasswordBtn=document.querySelector("#getPassword-btn");
        getPasswordBtn.addEventListener("click", function(e){
            let forgotPasswordEmailID=document.querySelector("#forgotPassword-emailID");
            if(forgotPasswordEmailID.value=="")
            {
                alert("Enter your Email Address to Get Password.");
                return;
            }
            let loginArr=JSON.parse(localStorage.getItem("loginArr"));
            for(let i=0;i<loginArr.length;i++)
            {
                if(loginArr[i].EmailId==forgotPasswordEmail)
                {
                    alert("Password: "+loginArr[i].Password);
                     
                    isForgotOn=false;
                    let forgotPasswordDiv=document.querySelector(".forgotPasswordDiv");
                    forgotPasswordEmailID.value="";
                    forgotPasswordDiv.remove();
                    let getPassworddiv=document.querySelector("#getPassword-btn");
                    getPassworddiv.remove();
                    forgotPasswordEmail="";
                    hr.style.marginTop="37px";
                    forgotPassword.style.marginTop="-20px";
                    loginBox.style.minHeight="528px";
                    return;
                }
            }
            alert("Password not found.");
            forgotPasswordEmailID.value="";
            forgotPasswordEmail="";
            return;
        });
    }
    else
    {
        isForgotOn=false;
        let forgotPasswordDiv=document.querySelector(".forgotPasswordDiv");
        forgotPasswordDiv.remove();
        let getPassworddiv=document.querySelector("#getPassword-btn");
        getPassworddiv.remove();

        hr.style.marginTop="37px";
        forgotPassword.style.marginTop="-20px";
        loginBox.style.minHeight="528px";
    }
});

// ------------------------------------------- SIGN UP Interface Functionality ------------------------------------------------------
signUpUsername.addEventListener("input", function(e){
    newUsername=e.currentTarget.value;
});

signUpPassword.addEventListener("input", function(e){
    newPassword=e.currentTarget.value;
});

signUpRepeatPassword.addEventListener("input", function(e){
    newRepeatPassword=e.currentTarget.value;
});

signUpEmailID.addEventListener("input", function(e){
    newEmailID=e.currentTarget.value;
});

signUpBtn.addEventListener("click", function(e){
    if(newUsername=="")
    {
        alert("Enter your Username.");
        return;
    }
    if(newPassword=="")
    {
        alert("Enter your Password.");
        return;
    }
    if(newRepeatPassword=="")
    {
        alert("Enter your Password again in REPEAT PASSWORD.");
        return;
    }
    if(newEmailID=="")
    {
        alert("Enter your Email ID.");
        return;
    }

    if(newPassword!=newRepeatPassword)
    {
        alert("REPEAT PASSWORD doesn't match with PASSWORD.");
        return;
    }

    let requiredObj={
        Username:newUsername,
        Password:newPassword,
        EmailId:newEmailID,
    };
    let loginArr=JSON.parse(localStorage.getItem("loginArr"));
    loginArr.push(requiredObj);
    localStorage.setItem("loginArr",JSON.stringify(loginArr));

    alert("SIGN UP Completed!! Now you can LOGIN.");

    signUpUsername.value="";
    signUpPassword.value="";
    signUpRepeatPassword.value="";
    signUpEmailID.value="";
});