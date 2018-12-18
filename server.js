var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

var users = [];
var connections = [];
var UserOnline = 0;


// run the server
server.listen(process.env.PORT || 2100);
console.log("Server connected!");


app.get("/",function(request,response){
	response.sendFile(__dirname + "/index.html");
})

//All the events that we need to emit will going here...
io.sockets.on("connection", function(socket){
		connections.push(socket);
		console.log("connected: %s socket connected", connections.length);

		//diconnect
		socket.on("disconnect",function(){
			
				users.splice(users.indexOf(socket.users),1)
				updateUsernames();


			connections.splice(connections.indexOf(socket),1);
			console.log("disconnected: %s sockets connected", connections.length);
		})

		//Send Message
		socket.on("send message",function(data){

			io.sockets.emit("new message",{msg: data, user: socket.username});
		})

		socket.on("new user",function(data, callback){
			callback(true);
			socket.username = data;
			users.push(socket.username);
			updateUsernames();

		
		})

		function updateUsernames(){
			io.sockets.emit("get users",users)
		}

});

