/*setTime()
Function to display the time for clock in index.html 
FLAG! NEEDS TO LOOP TO UPDATE TIME!*/
function setTime(){

    var date = new Date();
    var timeString = date.toLocaleTimeString()
    
    document.getElementById("clock").textContent=timeString;
    
    }
    
    /*Update the clock every second*/
    setInterval(setTime, 1000);