let express = require('express'); //załączanie express do serwera
let mysql = require('mysql'); //baza danych
let dateFormat = require('dateformat');

let app = express(); //wywołanie fukcji tworzącej aplikację
let server = app.listen(process.env.PORT); //nasłuchiwanie na portie o nr 3000
app.use(express.static('public')); //hostowanie plików w folderze "public"

console.log("Server is running!");

let socket = require('socket.io'); //załączenie socket.io
let io = socket(server);  //połączenie socketa z serverem
io.sockets.on('connection', newConnection); //połączenie event

let config = {
    host: 'remotemysql.com',
    user: 'q4JaF0dHZ1',
    password: 'CkY69lll0d',
    database: 'q4JaF0dHZ1'
}
let connection = mysql.createConnection(config);
connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Connected to the MySQL server.');
});

let ids = [];
let nb = 50;

function newConnection(socket){
	console.log('New connection:' + socket.id);
	ids[ids.length] = socket.id;
	console.log('Online: ' + ids.length);
	io.sockets.emit('id', ids.length);

	socket.on('dataSave', saveData);
	function saveData(d) {
		let sql = 'insert into message (user, text) values ("' + d[0] + '","' + d[1] + '");';
		connection.query(sql, (error, results, fields) => {
			if (error) {
				return console.error(error.message);
			}
			console.log('message saved');
		});
	}

	socket.on('dataSend1', sendData1);
	function sendData1() {
		let sql = 'select * from message order by date desc limit ' + nb + ';';
		connection.query(sql, (error, results, fields) => {
			if (error) {
				return console.error(error.message);
			}
			console.log('message sent | ', results);
			socket.broadcast.emit('dataSend1', results);
		});
	}
	
	socket.on('dataSend2', sendData2);
	function sendData2() {
		let sql = 'select * from message order by date desc limit ' + nb + ';';
		connection.query(sql, (error, results, fields) => {
			if (error) {
				return console.error(error.message);
			}
			console.log('message sent');
			socket.emit('dataSend2', results);
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
