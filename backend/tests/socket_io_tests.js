const express = require('express');
const assert = require('assert');
const io = require('../io');
const Client = require('socket.io-client');

describe('Socket.io Tests', () => {
	let testIO;
	let testServer;
	let testApp;
	let serverSocket;
	let clientSocket;

	before((done) => {
		if (!io.io_server.address()) {
			testApp = express();
			testServer = require('http').createServer(testApp);
			testIO = require('socket.io')(testServer);

			testServer.listen(io.io_port, () => {
				clientSocket = new Client(`http://localhost:${io.io_port}`);
				testIO.on('connection', (socket) => {
					serverSocket = socket;
				})
				clientSocket.on('connect', done);
			});
		} else {
			serverSocket = io.io_server;
		}
	});

	after(() => {
		testIO.close();
		clientSocket.close();
	});

	it('Client should connect.', () => {
		assert.equal(clientSocket.connected, true);
	});

	it('Client should receive message.', (done) => {
		clientSocket.on('ping', (arg) => {
			assert.equal(arg, 'pong');
			done();
		});
		serverSocket.emit('ping', 'pong');
	});
});
