window.onload = function() {

	var socket = io.connect('http://localhost:3700');
	var text = document.getElementById("text");
	var sendButton = document.getElementById("send");

	sendButton.onclick = function() {
		var input = text.value;
		socket.emit('send', { message: input });
	};
}
