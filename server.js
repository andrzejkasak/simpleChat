let express = require('express'); //załączanie express do serwera
let app = express(); //wywołanie fukcji tworzącej apliakcję
let server = app.listen(process.env.PORT); //nasłuchiwanie na portie o nr 3000
app.use(express.static('public')); //hostowanie plików w folderze "public"

console.log("Server is running!");

let socket = require('socket.io'); //załączenie socket.io
let io = socket(server);  //połączenie socketa z serverem
io.sockets.on('connection', newConnection); //połączenie event

let ids = [];
let data = [];
let nb = 50;

function newConnection(socket){
	console.log('New connection:' + socket.id);
	ids[ids.length] = socket.id;
	console.log('Online: ' + ids.length);
	io.sockets.emit('id', ids.length);

	socket.on('dataSave', saveData);
	function saveData(d) {
		data.unshift(d);
		console.log('saving message');
	}

	socket.on('dataSend1', sendData1);
	function sendData1() {
		socket.broadcast.emit('dataSend1', data.slice(0, nb));
		console.log('sending messages1');
	}
	
	socket.on('dataSend2', sendData2);
	function sendData2() {
		socket.emit('dataSend2', data.slice(0, nb));
		console.log('sending messages2');
	}
	
	socket.on('disconnect', disconnection);
	function disconnection() {
		console.log('Disconnected:' + socket.id);
		for(let i = ids.length-1; i >= 0; i--){
			if(ids[i] == socket.id){
				ids.splice(i, 1);
				break;
			}
		}
		console.log('Online: ' + ids.length);
		io.sockets.emit('id', ids.length);
	}
}
