const userConnected = (socket) => {
	print.log(`socket connection ${socket.id}`);
	socket.emit('ping', 'pong');
};

module.exports = (socket) => {
	userConnected,
	socket.on('user:connected', userConnected);
};

