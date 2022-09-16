function myClock() {         
    setTimeout(function() {   
      const d = new Date();
      const n = d.toLocaleTimeString([], { timeStyle: 'short' });;
      document.getElementById("time-info").innerHTML = n; 
      myClock();             
    }, 1000)
  }
  myClock();