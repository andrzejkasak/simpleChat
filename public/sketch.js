
let boxText, inpNick, inpText;
let audio;

window.onload = function() {
  socket = io.connect('localhost:3000');
  socket.on('dataSave');
  socket.on('dataSend1', receiveData1);
  socket.on('dataSend2', receiveData2);
  socket.on('id', receiveId);

  audio = new Audio('messenger.mp3');
  
  document.getElementById("foot").innerHTML = 'Andrzej Kasak - Copyright © 2020-'+(new Date().getYear()+1900).toString();

  inpNick = document.getElementById("nickInput");
  inpText = document.getElementById("textInput");
  inpText.addEventListener("keyup", keyListener);
  boxText = document.getElementById("textbox");
  //console.log(inpText, inpNick, boxText);
  
  var user = getCookie('username');
  if (user != '' && user != null) {
    inpNick.value = user;
	inpText.focus();
  }else{
	inpNick.focus();
  }
  
  socket.emit('dataSend2');
}

function receiveData1(d){
	receiveData2(d);
	audio.load();
	audio.play();
}

function receiveData2(d){
	//console.log(d);
	boxText.innerHTML = '';
	if(d.length == 0) boxText.innerHTML = 'NO NEW MESSAGES!</br>'
	
	for(let i=0; i<d.length; i++){
		let s = document.createElement('span');
		s.innerHTML = d[i][0];
		boxText.appendChild(s);
		boxText.innerHTML += ': '+d[i][1] +'</br>';
	}
}

function receiveId(n){
	let b = document.getElementById('online');
	if(n == 1)b.innerHTML = 'ONLINE: '+n.toString()+' USER';
	else b.innerHTML = 'ONLINE: '+n.toString()+' USERS';
}

function keyListener(event) {
	
	if (event.key === "Enter") {
		let check = false;
		for(let i=0; i < inpNick.value.length; i++ ){
			if(inpNick.value[i] == ' '){
				check = true;
				break;
			}
		}
		let check2 = false;
		for(let i = 0; i < inpText.value.length; i++ ){
			if(inpText.value[i] != ' '){
			    check2 = true;
				break;
			}
		}
		
		//console.log(inpText.value);
		
	  if(inpNick.value == '' || check){
		boxText.innerHTML = "<span id='red'>Enter correct nickname!</span></br>" + boxText.innerHTML;
	  }else if(inpText.value != '' && check2){
		  
		  var user = getCookie("username");
		  if (user != inpNick.value || user == ''){
			user = inpNick.value;
			setCookie("username", user, 365);
		  }
		  
		  let d = [inpNick.value, inpText.value];
		  socket.emit('dataSave', d);
		  socket.emit('dataSend1');
		  socket.emit('dataSend2');
		  inpText.value = '';
	  }
	
	
	}
}





//////////////////////////////
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
