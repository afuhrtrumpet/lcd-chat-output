var express = require('express');
var app = express();
var port = 3700;
var Lcd = require('lcd'), lcd = new Lcd({rs:25, e:24, data:[23, 17, 27, 22], cols:16, rows:2});
var Gpio = require('onoff').Gpio;

app.set('views', __dirname + '/tpl')
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.get("/", function(req, res) {
	res.render("page");
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));

var upButton = { PIN : 18, GPIO : null };
var downButton = { PIN : 4, GPIO : null };

var messages = new Array();
messages[0] = "";
var index = 0;

var printMessage = function() {
	console.log("Printing message at index " + index);
	message = messages[index]
	lcd.clear();
	lcd.once('clear', function() {
		lcd.setCursor(0, 0);
		if (message.length > 16) {
			lcd.print(message.substring(0, 16));
			var printSecondLine = function() {
				lcd.setCursor(0, 1);
				lcd.print(message.substring(16));
			};
			setTimeout(printSecondLine, 300);
		} else {
			lcd.print(message);
		}
	});
}

io.sockets.on('connection', function(socket) {
	socket.on('send', function(data) {
		messages.push(data.message);
		index = messages.length - 1;
		printMessage();
	});

	upButton.GPIO = new Gpio(upButton.PIN, 'in', 'both');
	downButton.GPIO = new Gpio(downButton.PIN, 'in', 'both');
	upButton.GPIO.watch(function(err, val) {
		console.log("Up button pressed");
		if (err) {
			console.log(err);
			throw err;
		}
		if (index > 0 && !val) {
			console.log("Printing new message");
			index--;
			printMessage();
		}
	});
	downButton.GPIO.watch(function(err, val) {
		console.log("Down button pressed");
		if (err) {
			console.log(err);
			throw err;
		}
		if (index < messages.length - 1 && !val) {
			console.log("Printing new message");
			index++;
			printMessage();
		} 
	});
});

console.log("Listening on port " + port);
