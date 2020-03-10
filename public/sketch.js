
let boxText, inpNick, inpText;

window.onload = function() {
  socket = io.connect('localhost:3000');
  socket.on('dataSave');
  socket.on('dataSend', receiveData);

  inpNick = document.getElementById("nickInput");
  inpText = document.getElementById("textInput");
  inpText.addEventListener("keyup", keyListener);
  boxText = document.getElementById("textbox");
  //console.log(inpText, inpNick, boxText);
  socket.emit('dataSend');
}

function receiveData(d){
	//console.log(d);
	boxText.innerHTML = '';
	for(let i = d.length-1; i>=0 ; i--){
		boxText.innerHTML += d[i][0]+': '+d[i][1] +'&#10';
	}
}

function keyListener(event) {
	
	if (event.key === "Enter") {
	  if(inpNick.value == ''){
		boxText.innerHTML = 'Enter your nickname! &#10' + boxText.innerHTML;
	  }else if(inpText.value != ''){
		  //temp 
		  //boxText.innerHTML = inpNick.value+': '+inpText.value +'&#10' + boxText.innerHTML;
		  
		  let d = [inpNick.value, inpText.value];
		  socket.emit('dataSave', d);
		  socket.emit('dataSend');
		  inpText.value = '';
	  }
	
	
	}
}
