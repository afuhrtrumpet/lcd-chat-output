var express = require('express');
var app = express();
var port = 3700;
var Lcd = require('lcd'), lcd = new Lcd({rs:25, e:24, data:[23, 17, 27, 22], cols:8, rows:2});

app.set('views', __dirname + '/tpl')
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.get("/", function(req, res) {
	res.render("page");
});

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket) {
	socket.on('send', function(data) {
		lcd.print(data);
	});
});

console.log("Listening on port " + port);
