const express = require('express');
const app = express();
const uuid = require('uuid');
const print = require('./_utils/print');

const port = 8080;

let server = require('http').createServer(app);
const io = require('socket.io')(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ["GET", "POST"],
	}
});

io.engine.generateId = () => {
	return uuid.v4();
};

io.engine.on('connection_error', (err) => {
	print.log(err.req);
	print.log(err.code);
	print.log(err.message);
	print.log(err.context);
});

// middlewares
io.use(async (socket, next) => {
	try {
		next();
	} catch (e) {
		print.log(e);
		next(e);
	}
})

const clients_count = io.engine.clientsCount;
io.on('connection', (socket) => {
	print.log(`socket connection #${clients_count + 1} ${socket.id}`);
	socket.emit('ping', 'pong');
});

module.exports = {
	port,
	io,
	server,
};
