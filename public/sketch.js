let boxText, inpNick, inpText;
let audio;

window.onload = function() {
  socket = io.connect();
  socket.on('dataSave');
  socket.on('dataSend1', receiveData1);
  socket.on('dataSend2', receiveData2);
  socket.on('id', receiveId);

  audio = new Audio('messenger.mp3');
  
  document.getElementById("foot").innerHTML = 'Andrzej Kasak - Copyright © 2020-'+(new Date().getFullYear()).toString();

  inpNick = document.getElementById("nickInput");
  inpNick.addEventListener("keyup", keyListener2);
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
	boxText.innerHTML = '';
	if(d.length == 0) boxText.innerHTML = 'NO NEW MESSAGES!</br>'
	//console.log(d[0].date)
	
	for(let i=0; i<d.length; i++){
		let convDate = new Date(d[i].date);
		let options = {  
    			weekday: "long", year: "numeric", month: "numeric",  
    			day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" 
		};  
		let s = document.createElement('div');
		s.innerHTML = "<div id='box'><div id='userbar'><span id='nick'>"+d[i].user+
		"</span>"+ convDate.toLocaleTimeString("en-US", options) +
		"</div><div id='text'>"+d[i].text+"</div></div>";
		boxText.appendChild(s);
	}
}

function receiveId(n){
	let b = document.getElementById('online');
	if(n == 1)b.innerHTML = 'ONLINE: '+n.toString()+' USER';
	else b.innerHTML = 'ONLINE: '+n.toString()+' USERS';
}

function keyListener(event) {
	
	if (event.key === "Enter") {
		
		let check2 = false;
		for(let i = inpText.value.length-1; i >= 0; i--){
			if(inpText.value[i] != ' ' && inpText.value[i] != '\n'){
			    check2 = true;
				break;
			}
		}
		let check = false;
		for(let i=0; i < inpNick.value.length; i++ ){
			if(inpNick.value[i] == ' '){
				check = true;
				break;
			}
		}
	  if(inpNick.value == '' || check){
		  ;
	  }else if(inpText.value != '\n' && check2){
		  var user = getCookie("username");
		  if (user != inpNick.value || user == ''){
			user = inpNick.value;
			setCookie("username", user, 365);
		  }
		  
		  
		  let d = [inpNick.value, inpText.value];
		  socket.emit('dataSave', d);
		  socket.emit('dataSend1');
		  socket.emit('dataSend2');
		  
		  let err = document.getElementById('err');
		  err.innerHTML = "";
	  }
		inpText.value = '';
	}
}

function keyListener2(event) {
	let check = false;
		for(let i=0; i < inpNick.value.length; i++ ){
			if(inpNick.value[i] == ' '){
				check = true;
				break;
			}
		}
		
		let err = document.getElementById('err');
	  if(inpNick.value == '' || check){
		  err.innerHTML = "<span style='color:red;'>Enter correct username!</span>";
	  }else{
		  err.innerHTML = "<span style='color:lime;'>Username is correct!</span>";
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
