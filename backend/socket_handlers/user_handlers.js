module.exports = (io, socket) => {
	const userConnected = () => {
		print.log(`socket connection ${socket.id}`);
		socket.emit('ping', 'pong');
	};

	socket.on('user:connected', userConnected);
};

