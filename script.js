// -------------------- Global Variables and References of Classes and HTML Tags -----------------------------------
let allFilters=document.querySelectorAll(".filter div");
let navBar=document.querySelector(".navbar");
let filterContainer=document.querySelector(".filter-container");
let actionContainer=document.querySelector(".action-container");
let grid=document.querySelector(".grid");
let modalVisible=false;
let addBtn=document.querySelector(".add");
let body=document.querySelector("body");
body.spellcheck=false;

// let uid = new ShortUniqueId();
let uid = Math.random().toString(36).slice(-6);

let colors={
   pink: "#d595aa",
   blue: "#5ecdde",
   green: "#91e6c7",
   black: "black",
};
let colorClasses=["pink","blue","green","black"];
let isTicketLocked=false;
let ticketLock;
let isDarkModeOn=false;
let sortBtn=document.querySelector(".sort-Btn");
let recycleBinBtn=document.querySelector(".recycle-bin-icon");
let infoBtn=document.querySelector(".info-icon");
let searchInputTag=document.querySelector(".search");
let textHighlighterDiv=document.querySelector(".text-highlighter");
let darkMode=document.querySelector(".dark-mode");
let infoArrow=document.querySelector(".info-arrow");

// location.replace("loginPage.html");

// ---------------------- Initialisation Step of Local Storage ----------------------------------------
if(!localStorage.getItem("tasks"))
{
    localStorage.setItem("tasks",JSON.stringify([]));
}

if(!localStorage.getItem("MaintasksArr"))
{
    localStorage.setItem("MaintasksArr",JSON.stringify([]));
}

if(!localStorage.getItem("recycleBinArr"))
{
    localStorage.setItem("recycleBinArr",JSON.stringify([]));
}

// --------------------- For Viewing Tickets on the basis of Priority Colour selected. -------------------------
for(let i=0;i<allFilters.length;i++)
{
    allFilters[i].addEventListener("click", function(e) {
       if(e.currentTarget.parentElement.classList.contains("selected-filter"))
       {
           e.currentTarget.parentElement.classList.remove("selected-filter");
           loadTasks();
       }
       else
       {
           let color=e.currentTarget.classList[0].split("-")[0];
           for(let j=0;j<allFilters.length;j++)
           {
                if(allFilters[j].parentElement.classList.contains("selected-filter"))
                {
                    allFilters[j].parentElement.classList.remove("selected-filter");
                }
           }
           e.currentTarget.parentElement.classList.add("selected-filter");
           loadTasks(color);
       }
    });
}

// --------------------------- ADD Button ---------------------------------------
addBtn.addEventListener("click", function(e){
    
    if(deleteState==true)
    {
        deleteState=false;  //off
        deleteBtn.classList.remove("delete-state");
    }

    //////// ------------------ (1) Creation of Modal and appending in Body ---------------------------------------------
    if(modalVisible) return;
    let modal=document.createElement("div");
    modal.classList.add("modal-container");
    modal.innerHTML=`<div class="writing-area" contenteditable>Enter Your Task</div>
    <div class="filter-area">
        <div class="modal-filter pink"></div>
        <div class="modal-filter blue"></div>
        <div class="modal-filter green"></div>
        <div class="modal-filter black active-modal-filter"></div>
        <div class="cross-icon">
                <i class="material-icons">highlight_off</i>
        </div>
    </div>`;
    body.append(modal);
    
    let crossBtn=modal.querySelector(".cross-icon");
    crossBtn.addEventListener("click", function(e){
        modal.remove();
        modalVisible=false;
        return;
    });

    modalVisible=true;

    //////// -------------------- (2) Placeholder type Work in Writing Area -----------------------------------
    let wa=modal.querySelector(".writing-area");
    wa.setAttribute("click-first",true);
    wa.addEventListener("click", function(e){
        if(wa.getAttribute("click-first")=="true")
        {
            wa.innerHTML="";
            wa.setAttribute("click-first",false);
        }
    });
    
    //////// -------------------- (3) Creation of Ticket and appending in Grid -----------------------------------
    wa.addEventListener("keypress", function(e) {
        if(e.key=="Enter")
        {
            let task=e.currentTarget.innerText;
            let selectedModalFilter=document.querySelector(".active-modal-filter");
            let color=selectedModalFilter.classList[1];

            // let id=uid();
            let uid = Math.random().toString(36).slice(-6);
            let id=uid;

            modal.remove();
            modalVisible=false;
            let ticket=document.createElement("div");
            ticket.classList.add("ticket");
            ticket.innerHTML=`<div class="ticket-color ${color}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="ticket-box" contenteditable>${task}</div>
            <div class="lock">
                <span class="material-icons">lock_open</span>
            </div>`;
            
            let lockDiv=ticket.querySelector(".lock");
            lockDiv.addEventListener("click",lockHandler);
            darkModeFunction();
            grid.append(ticket);
            ticketLock=isTicketLocked;
            let colorId;
            if(color=="pink")
            {
                colorId=1;
            }
            if(color=="blue")
            {
                colorId=2;
            }
            if(color=="green")
            {
                colorId=3;
            }
            if(color=="black")
            {
                colorId=4;
            }
            saveTicketInLocalStorage(id,color,task,ticketLock,colorId);
    
            let ticketWritingArea=ticket.querySelector(".ticket-box");
            ticketWritingArea.addEventListener("click", function(e){
                let id=e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
                let tasksArr=JSON.parse(localStorage.getItem("tasks"));
                let reqIndex=-1;
                for(let i=0;i<tasksArr.length;i++) 
                {
                    if(tasksArr[i].id==id)
                    {
                        reqIndex=i;
                        break;
                    }
                }

                ticketLock=tasksArr[reqIndex].ticketLock;
                if(ticketLock==true)
                {
                    alert("This Ticket is Locked.");
                    ticketWritingArea.setAttribute("contenteditable","false");
                }
                else
                {
                    ticketWritingArea.setAttribute("contenteditable","true");
                    ticketWritingArea.addEventListener("input",ticketWritingAreaHandler);
                }
            });
            
            // ---------------------- (4) Deletion of Ticket when deleteState is true i.e. on -----------------------------------
            ticket.addEventListener("click", function(e){
                if(deleteState==true) //on
                {
                    let id=e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];
                    let tasksArr=JSON.parse(localStorage.getItem("tasks"));
                    let MaintasksArr=JSON.parse(localStorage.getItem("MaintasksArr"));
                    let recycleBinArr=JSON.parse(localStorage.getItem("recycleBinArr"));

                    let reqIndex=-1;
                    for(let i=0;i<tasksArr.length;i++)
                    {
                        if(tasksArr[i].id==id)
                        {
                            reqIndex=i;
                        }
                    }

                    let ticketLock=tasksArr[reqIndex].ticketLock;
                    if(ticketLock==true)
                    {
                        return;
                    }

                    let tempTasksArr=tasksArr.filter(function (el){
                        return el.id == id;
                    });            
                    recycleBinArr.push(tempTasksArr[0]);            

                    tasksArr=tasksArr.filter(function (el){
                        return el.id != id;
                    });
                    
                    MaintasksArr=tasksArr;

                    localStorage.setItem("tasks",JSON.stringify(tasksArr));
                    localStorage.setItem("MaintasksArr",JSON.stringify(MaintasksArr));
                    localStorage.setItem("recycleBinArr",JSON.stringify(recycleBinArr));

                    ticket.remove();
                }
            });
    
            /////// --------------- (5) Changing of Colour of ticketColorDiv after each click on it ----------------------------
            let ticketColorDiv=ticket.querySelector(".ticket-color");
            ticketColorDiv.addEventListener("click",ticketColorHandler);
        }
    });
    
    ////// --------------------- (6) Highlighting of Selected Filter Colour through Red Border ---------------------------
    let allModalFilters=modal.querySelectorAll(".modal-filter");
    for(let i=0;i<allModalFilters.length;i++)
    {
        allModalFilters[i].addEventListener("click", function(e) {
            for(let j=0;j<allModalFilters.length;j++)
            {
                allModalFilters[j].classList.remove("active-modal-filter");
            }
            allModalFilters[i].classList.add("active-modal-filter");
            let ticketColor=allModalFilters[i].classList[1];
        });
    }
});


// --------------------------- Delete Button -------------------------------------
let deleteState=false;  //off
let deleteBtn=document.querySelector(".delete");

deleteBtn.addEventListener("click", function(e){
    if(deleteState) //on
    {
        deleteState=false; //off
        e.currentTarget.classList.remove("delete-state");
    }
    else
    {
        deleteState=true; //on
        e.currentTarget.classList.add("delete-state");
    }
});

function saveTicketInLocalStorage(id,color,task,ticketLock,colorId) {
    let requiredObj={id,color,task,ticketLock,colorId};
    let tasksArr=JSON.parse(localStorage.getItem("tasks"));
    tasksArr.push(requiredObj);
    localStorage.setItem("tasks",JSON.stringify(tasksArr));

    let MaintasksArr=JSON.parse(localStorage.getItem("tasks"));
    localStorage.setItem("MaintasksArr",JSON.stringify(MaintasksArr));
}

function loadTasks(passedColor) {
    let allTickets=document.querySelectorAll(".ticket");
    for(let t=0;t<allTickets.length;t++)
    {
        allTickets[t].remove();
    }
    let tasks=JSON.parse(localStorage.getItem("tasks"));
    for(let i=0;i<tasks.length;i++)
    {
        let id=tasks[i].id;
        let color=tasks[i].color;
        let taskValue=tasks[i].task;
        let ticketLock=tasks[i].ticketLock;

        if(passedColor)
        {
            if(passedColor!=color)
               continue;
        }

        let ticket=document.createElement("div");
            ticket.classList.add("ticket");
            ticket.innerHTML=`<div class="ticket-color ${color}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="ticket-box" contenteditable>${taskValue}</div>
            <div class="lock"></div>`;
            let lockDiv=ticket.querySelector(".lock");
            if(ticketLock==false)
            {
                lockDiv.innerHTML=`<span class="material-icons">lock_open</span>`;
            }
            else
            {
                lockDiv.innerHTML=`<span class="material-icons">lock</span>`;
            }
            grid.append(ticket);

            let ticketWritingArea=ticket.querySelector(".ticket-box");
            ticketWritingArea.addEventListener("click", function(e){
                let id=e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];  //.parentElement
                let tasksArr=JSON.parse(localStorage.getItem("tasks"));
                let reqIndex=-1;
                for(let i=0;i<tasksArr.length;i++)
                {
                    if(tasksArr[i].id==id)
                    {
                        reqIndex=i;
                    }
                }
    
                ticketLock=tasksArr[reqIndex].ticketLock;
                if(ticketLock==true)
                {
                    alert("This Ticket is Locked.");
                    ticketWritingArea.setAttribute("contenteditable","false");
                }
                else
                {
                    ticketWritingArea.setAttribute("contenteditable","true");
                    ticketWritingArea.addEventListener("input",ticketWritingAreaHandler);
                }
            });
            // ticketWritingArea.addEventListener("input",ticketWritingAreaHandler);

            ticket.addEventListener("click", function(e){
                if(deleteState==true) //on
                {
                    let id=e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];
                    let tasksArr=JSON.parse(localStorage.getItem("tasks"));
                    let MaintasksArr=JSON.parse(localStorage.getItem("MaintasksArr"));
                    let recycleBinArr=JSON.parse(localStorage.getItem("recycleBinArr"));

                    let reqIndex=-1;
                    for(let i=0;i<tasksArr.length;i++)
                    {
                        if(tasksArr[i].id==id)
                        {
                            reqIndex=i;
                        }
                    }

                    let ticketLock=tasksArr[reqIndex].ticketLock;
                    if(ticketLock==true)
                    {
                        return;
                    }

                    let tempTasksArr=tasksArr.filter(function (el){
                        return el.id == id;
                    });            
                    recycleBinArr.push(tempTasksArr[0]);            

                    tasksArr=tasksArr.filter(function (el){
                        return el.id != id;
                    });
                    
                    MaintasksArr=tasksArr;

                    localStorage.setItem("tasks",JSON.stringify(tasksArr));
                    localStorage.setItem("MaintasksArr",JSON.stringify(MaintasksArr));
                    localStorage.setItem("recycleBinArr",JSON.stringify(recycleBinArr));

                    ticket.remove();
                }
            });

            let ticketColorDiv=ticket.querySelector(".ticket-color");
            ticketColorDiv.addEventListener("click",ticketColorHandler);

            lockDiv.addEventListener("click",lockHandler);
    }
}

loadTasks();

function ticketColorHandler(e) {
    let id=e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
    let tasksArr=JSON.parse(localStorage.getItem("tasks"));
    let MaintasksArr=JSON.parse(localStorage.getItem("MaintasksArr"));

    let reqIndex=-1;
    for(let i=0;i<tasksArr.length;i++)
    {
        if(tasksArr[i].id==id)
        {
            reqIndex=i;
        }
    }

    ticketLock=tasksArr[reqIndex].ticketLock;
    if(ticketLock==true)
    {
        alert("This Ticket is Locked.");
        return;
    }

    let currColor=e.currentTarget.classList[1];
    let index=colorClasses.indexOf(currColor);
    e.currentTarget.classList.remove(currColor);
    e.currentTarget.classList.add(colorClasses[(index+1)%4]);
    
    let colorId;
    if(colorClasses[(index+1)%4]=="pink")
    {
        colorId=1;
    }
    if(colorClasses[(index+1)%4]=="blue")
    {
        colorId=2;
    }
    if(colorClasses[(index+1)%4]=="green")
    {
        colorId=3;
    }
    if(colorClasses[(index+1)%4]=="black")
    {
        colorId=4;
    }

    tasksArr[reqIndex].color=colorClasses[(index+1)%4];
    tasksArr[reqIndex].colorId=colorId;
    localStorage.setItem("tasks",JSON.stringify(tasksArr));

    MaintasksArr[reqIndex].color=colorClasses[(index+1)%4];
    MaintasksArr[reqIndex].colorId=colorId;
    localStorage.setItem("MaintasksArr",JSON.stringify(MaintasksArr));
}

function ticketWritingAreaHandler(e) {
    let id=e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
    let tasksArr=JSON.parse(localStorage.getItem("tasks"));
    let MaintasksArr=JSON.parse(localStorage.getItem("MaintasksArr"));
    let reqIndex=-1;
    for(let i=0;i<tasksArr.length;i++) 
    {
        if(tasksArr[i].id==id)
        {
            reqIndex=i;
            break;
        }
    }

    tasksArr[reqIndex].task=e.currentTarget.innerText;
    localStorage.setItem("tasks",JSON.stringify(tasksArr));

    MaintasksArr[reqIndex].task=e.currentTarget.innerText;
    localStorage.setItem("MaintasksArr",JSON.stringify(MaintasksArr));
}

function lockHandler(e) {
    let lockDiv=e.currentTarget.parentElement.querySelector(".lock");
    if(ticketLock==false)
    {
        lockDiv.removeChild(lockDiv.firstChild);
        lockDiv.innerHTML=`<span class="material-icons">lock</span>`;
        ticketLock=true;
    }
    else
    {
        lockDiv.removeChild(lockDiv.firstChild);
        lockDiv.innerHTML=`<span class="material-icons">lock_open</span>`;
        ticketLock=false;
    }
    let id=e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];  //.parentElement
    let tasksArr=JSON.parse(localStorage.getItem("tasks"));
    let MaintasksArr=JSON.parse(localStorage.getItem("MaintasksArr"));
    let reqIndex=-1;
    for(let i=0;i<tasksArr.length;i++)
    {
        if(tasksArr[i].id==id)
        {
            reqIndex=i;
        }
    }
    
    tasksArr[reqIndex].ticketLock=ticketLock;
    localStorage.setItem("tasks",JSON.stringify(tasksArr));

    MaintasksArr[reqIndex].ticketLock=ticketLock;
    localStorage.setItem("MaintasksArr",JSON.stringify(MaintasksArr));
}

// --------------------------- Text Highlighter Work -------------------------------------
let openCloseDiv=document.querySelector(".open-close-div");
let colorShowingDiv=document.querySelector(".color-showing-div")
let colorPickerColour="white";
let highlighterMode=false;

openCloseDiv.addEventListener("click", function(e){
    let colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.classList.add("colorPicker");

    colorPicker.addEventListener("change", function (e) {
    colorPickerColour = e.currentTarget.value;
    colorShowingDiv.style.background=colorPickerColour;
  });

  colorPicker.click();
  colorPicker.remove();
});

colorShowingDiv.addEventListener("click", function(e){
    // highlighterMode=true;
    document.removeEventListener("mouseup", function(e){});
    if(highlighterMode==false)
    {
        highlighterMode=true;
        colorShowingDiv.style.border="4px solid red";
        document.addEventListener("mouseup", function(e){
            console.log(1);
            let selection=window.getSelection().getRangeAt(0); //selected text range
            let selectedText=selection.extractContents(); //value not a string
            let span=document.createElement("span"); //create a span
            span.style.backgroundColor=colorPickerColour; //background colour
            span.appendChild(selectedText); //insert text inside span
            selection.insertNode(span);
            // if(colorPickerColour=="white")
            // {
                
            // }
                
            let tickets=document.querySelectorAll(".ticket");
            let tasksArr=JSON.parse(localStorage.getItem("tasks"));
            let MaintasksArr=JSON.parse(localStorage.getItem("MaintasksArr"));

            for(let i=0;i<tickets.length;i++)
            {
                let ticketWritingArea=tickets[i].querySelector(".ticket-box");
                tasksArr[i].task=ticketWritingArea.innerHTML;
                tasksArr[i].dataColor=colorPickerColour;

                MaintasksArr[i].task=ticketWritingArea.innerHTML;
                MaintasksArr[i].dataColor=colorPickerColour;
            }
            localStorage.setItem("tasks",JSON.stringify(tasksArr));
            localStorage.setItem("MaintasksArr",JSON.stringify(MaintasksArr));
        });
        console.log(highlighterMode);
    }
    else
    {
        highlighterMode=false;
        colorShowingDiv.style.border="none";
        document.removeEventListener("mouseup", function(e){});
    }
});

sortBtn.addEventListener("click",sortHandler);

function sortHandler() 
{
    if(!sortBtn.classList.contains("sort-state"))
    {
        sortBtn.classList.add("sort-state");

        let sortArr=[];
        let tasksArr=JSON.parse(localStorage.getItem("tasks"));
        sortArr=tasksArr;
    
        for(let i=0;i<sortArr.length;i++)
        {
            for(let j=i+1;j<sortArr.length;j++)
            {
                if(sortArr[i].colorId>sortArr[j].colorId)
                {
                    let temp=sortArr[i];
                    sortArr[i]=sortArr[j];
                    sortArr[j]=temp;
                }
            }
        }
    
        localStorage.setItem("tasks",JSON.stringify(sortArr));
        loadTasks();
    }
    else
    {
        sortBtn.classList.remove("sort-state");

        let MaintasksArr=JSON.parse(localStorage.getItem("MaintasksArr"));
        localStorage.setItem("tasks",JSON.stringify(MaintasksArr));
        loadTasks();
    }
}

function darkModeFunction()
{
    darkMode.addEventListener("click", function(e){
        if(isDarkModeOn==false)
        {
            isDarkModeOn=true;
            navBar.style.background="black";                                 /*#444444*/
            filterContainer.style.background="#444444";
            actionContainer.style.background="#444444";
            sortBtn.style.background="#444444";
            textHighlighterDiv.style.background="#444444";
            recycleBinBtn.style.color="white";
            infoBtn.style.color="white";
            searchInputTag.style.border="1px solid white";
            searchInputTag.style.background="black"; 
            searchInputTag.style.color="white";
            grid.style.background="#0c2461"; 
            let tickets=document.querySelectorAll(".ticket");
            for(let i=0;i<tickets.length;i++)
            {
                tickets[i].style.background="#444444";
                tickets[i].style.boxShadow="none";
                let lockIcon=tickets[i].querySelector(".lock");
                lockIcon.style.color="white";
                let ticketId=tickets[i].querySelector(".ticket-id");
                ticketId.style.color="#f7b731";
                let ticketBox=tickets[i].querySelector(".ticket-box");
                ticketBox.style.color="#ff7979";
            }
            darkMode.style.color="white";
        }
        else
        {
            isDarkModeOn=false;
            navBar.style.background="linear-gradient(90deg, #3F2B96 0%, #A8C0FF 100%)";           /*#444444*/
            filterContainer.style.background="#d4c472";
            actionContainer.style.background="#d4c472";
            sortBtn.style.background="#d4c472";
            textHighlighterDiv.style.background="#d4c472";
            recycleBinBtn.style.color="black";
            infoBtn.style.color="black";
            searchInputTag.style.border="none";
            searchInputTag.style.background="#9eb5f0"; 
            searchInputTag.style.color="black"; 
            grid.style.background="#f2f2f2"; 
            let tickets=document.querySelectorAll(".ticket");
            for(let i=0;i<tickets.length;i++)
            {
                tickets[i].style.background="white";
                tickets[i].style.boxShadow="0px 0px 19px 5px #aaa";
                let lockIcon=tickets[i].querySelector(".lock");
                lockIcon.style.color="black";
                let ticketId=tickets[i].querySelector(".ticket-id");
                ticketId.style.color="#989393";
                let ticketBox=tickets[i].querySelector(".ticket-box");
                ticketBox.style.color="black";
            }
            darkMode.style.color="black";
        }
    });
}

darkModeFunction();

recycleBinBtn.addEventListener("click", function(e){
    if(e.currentTarget.style.color=="red")
    {
        e.currentTarget.style.color="black";
        let MaintasksArr=JSON.parse(localStorage.getItem("MaintasksArr"));
        localStorage.setItem("tasks",JSON.stringify(MaintasksArr));
        loadTasks();
    }
    else
    {
        let recycleBinArr=JSON.parse(localStorage.getItem("recycleBinArr"));
        if(recycleBinArr=="")
        {
            alert("Recycle Bin is Empty.");
            return;
        }
        e.currentTarget.style.color="red";
        localStorage.setItem("tasks",JSON.stringify(recycleBinArr));
        loadTasks();
    }
});

let infoCont;
let Arrow;
infoBtn.addEventListener("click", function(e){
    let infoContainer;
    let iArrow;
    if(e.currentTarget.style.color=="red")
    {
        e.currentTarget.style.color="black";
        infoCont.remove();
        Arrow.remove();
    }
    else
    {
        e.currentTarget.style.color="red";
        let div=document.createElement("div");
        div.classList.add("info-container");
        div.innerHTML=`<h1 class="info-container-heading">Features:</h1>
        <ul style="padding-right: 9px;">
            <li style="margin-bottom: 7px;">
                <h3 style="display: inline;">Add Tasks:</h3><p style="display: inline;"> Click on the '+' Button then, type the Task description and select any color from the color displayed on the right hand side of the box. Then, press 'Enter' to create a New task with unique ID.</p>
            </li>
            <li style="margin-bottom: 7px;">
                <h3 style="display: inline;">Delete Tasks:</h3><p style="display: inline;"> Click on the 'X' Button, now click on the Ticket/Tickets you want to delete. The deleted Tickets will be added in the Recycle Bin automatically.</p>
            </li>
            <li style="margin-bottom: 7px;">
                <h3 style="display: inline;">Sort Tasks:</h3><p style="display: inline;"> Click on the Sort Button to view the Tasks on the basis of Highest to Lowest Priority. Again click on the same Sort Button to view the originally ordered Tasks.</p>
            </li>
            <li style="margin-bottom: 7px;">
                <h3 style="display: inline;">Edit Tasks:</h3><p style="display: inline;"> You can edit the Task description and can change the color priority of the task only if the task is unlocked. If it is Locked, you can't change the task description and color priority of that particular task.</p>
            </li>
            <li style="margin-bottom: 7px;">
                <h3 style="display: inline;">View all Tasks:</h3><p style="display: inline;"> When no color is chosen from the Toolbar, then all Tasks will be visible.</p>
            </li>
            <li style="margin-bottom: 7px;">
                <h3 style="display: inline;">Filter Specific Tasks:</h3><p style="display: inline;"> Click on the specific color in the Toolbar to view the Tasks of that priority only. Again click on the same color to view all Tasks.</p>
            </li>
            <li style="margin-bottom: 7px;">
                <h3 style="display: inline;">Search Bar:</h3><p style="display: inline;"> Tickets can be searched on the basis of its Inner Content or unique Ticket ID.</p>
            </li>
            <li style="margin-bottom: 7px;">
                <h3 style="display: inline;">Recycle Bin:</h3><p style="display: inline;"> Click on the Recycle Bin Button to view the deleted Tasks. Again click on the same Recycle Bin Button to view the non-deleted Tasks.</p>
            </li>
            <li style="margin-bottom: 7px;">
                <h3 style="display: inline;">Dark Mode Button:</h3><p style="display: inline;"> Click on the Dark Mode Button to enable Dark Mode View. Again click on the same Dark Mode Button to disable Dark Mode View.</p>
            </li>
            <li style="margin-bottom: 7px;">
                <h3 style="display: inline;">Lock Button:</h3><p style="display: inline;"> By default the Tickets are not locked so, their Task Description and Color Priority can be changed. Click on the Lock button to lock the particular Ticket. Again click on the same Lock button to unlock that particular Ticket. If the Ticket is Locked then, its Task Description and Color Priority can't be changed.</p>
            </li>
            <li style="margin-bottom: 7px;">
                <h3 style="display: inline;">Text Highlighter Button:</h3><p style="display: inline;"> Click on the Text Highlighter Button, a Color Picker will be displayed on the screen. Select the color with which you want to highlight the text, then press 'Enter'. The color which you selected will be displayed in the little box below the Text Highlighter Button. Now, you can select the text which you want to highlight and it will be automatically highlighted with the color you chose.</p>
            </li>
        </ul>`;
        body.append(div);
        infoContainer=body.querySelector(".info-container");
        infoCont=infoContainer;
        let infoDiv=document.createElement("div");
        infoDiv.classList.add("info-arrow");
        infoDiv.innerHTML=`<span class="material-icons"> south_west </span>`;
        grid.append(infoDiv);
        iArrow=grid.querySelector(".info-arrow");
        Arrow=iArrow;
    }
});

searchInputTag.addEventListener("input", function (e) {
    let value=searchInputTag.value;
    value=value.trim();
    let tickets=document.querySelectorAll(".ticket");
    for(let i = 0;i<tickets.length;i++) 
    {
        let text=tickets[i].querySelector(".ticket-box").innerText;
        let id=tickets[i].querySelector(".ticket-id").innerText;
        if(text.includes(value) || id.includes(value)) 
        {
            tickets[i].style.display="block";
        }
        else 
        {
            tickets[i].style.display="none";
        }
    }
});


