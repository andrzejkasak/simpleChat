let express = require('express'); //załączanie express do serwera
let Datastore = require('nedb'); //baza danych
let dateFormat = require('dateformat');

let app = express(); //wywołanie fukcji tworzącej apliakcję
let server = app.listen(process.env.PORT); //nasłuchiwanie na porcie
app.use(express.static('public')); //hostowanie plików w folderze "public"

console.log("Server is running!");

let socket = require('socket.io'); //załączenie socket.io
let io = socket(server);  //połączenie socketa z serverem
io.sockets.on('connection', newConnection); //połączenie event

let database = new Datastore('database.db');
database.ensureIndex({ fieldName: 'index', unique: true });
database.loadDatabase();

serverStart();

let ids = [];
let nb = 100;
let ind = 0;

function newConnection(socket){
	console.log('New connection:' + socket.id);
	ids[ids.length] = socket.id;
	console.log('Online: ' + ids.length);
	io.sockets.emit('id', ids.length);

	socket.on('dataSave', saveData);
	function saveData(d) {
		let i;
		database.find({}).sort({index:1}).exec(function(err, messages) {
			if(messages.length > 0) i = messages[messages.length-1].index;
			//console.log('to ->>', messages, i, messages.length);
			let now = new Date();
			let message = {
				user: d[0],
				text: d[1],
				date: dateFormat(now, "dd/mm/yyyy HH:MM:ss"),
				index: 0
			}
			if(i != null) message.index = i+1;
			database.insert(message);
			console.log('saving message');
		});
	
		
	}

	socket.on('dataSend1', sendData1);
	function sendData1() {
		database.find({}).sort({index:1}).exec(function(err, messages) {
			let data = [];
			messages.forEach(function(message) {
				let mess = {
					user: message.user,
					text: message.text,
					date: message.date
				}
				data.unshift(mess);
			});
			socket.broadcast.emit('dataSend1', data.slice(0, nb));
			console.log('sending messages1');
		});
	}
	
	socket.on('dataSend2', sendData2);
	function sendData2() {
		database.find({}).sort({index:1}).exec(function(err, messages) {
			let data = [];
			messages.forEach(function(message) {
				let mess = {
					user: message.user,
					text: message.text,
					date: message.date
				}
				data.unshift(mess);
			});
			socket.emit('dataSend2', data.slice(0, nb));
			console.log('sending messages2');
		});
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

function serverStart(){
	let i;
		database.find({}).sort({index:1}).exec(function(err, messages) {
			if(messages.length > 0) i = messages[messages.length-1].index;
			//console.log('to ->>', messages, i, messages.length);
			let now = new Date();
			let message = {
				user: 'server started:',
				text: '',
				date: dateFormat(now, "dd/mm/yyyy HH:MM:ss"),
				index: 0
			}
			if(i != null) message.index = i+1;
			database.insert(message);
		});
}

