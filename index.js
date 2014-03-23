var express = require('express');
var app = express();
var port = 3700;
var Lcd = require('lcd'), lcd = new Lcd({rs:25, e:24, data:[23, 17, 27, 22], cols:16, rows:2});

app.set('views', __dirname + '/tpl')
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.get("/", function(req, res) {
	res.render("page");
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket) {
	socket.on('send', function(data) {
		lcd.clear();
		lcd.setCursor(0, 0);
		if (data.message.length > 16) {
			lcd.print(data.message.substring(0, 17));
			var printSecondLine = function() {
				lcd.setCursor(0, 1);
				lcd.print(data.message.substring(17));
			};
			setTimeout(printSecondLine, 500);
		} else {
			lcd.print(data.message);
		}
	});
});

console.log("Listening on port " + port);
