let timeBox = document.querySelector(".time");

setInterval(()=>{
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let time = "";

    if(hours < 10)
        hours = "0"+hours;
    if(minutes < 10)
        minutes = "0"+minutes;
  
    time = hours+":"+minutes;
    
    timeBox.textContent = time;
}, 1000)