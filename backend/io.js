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
const UPDATE_LEFT_SIDE = 'UPDATE_LEFT_SIDE';
io.on('connection', (socket) => {
	print.log(`socket connection #${clients_count + 1} ${socket.id}`);
	socket.emit('ping', 'pong');

	socket.on(UPDATE_LEFT_SIDE, (data, callback) => {
		const res_data = {
			id: data.id,
			right: data.left,
		};
		callback(res_data);
	});
});

module.exports = {
	port,
	server,
};
