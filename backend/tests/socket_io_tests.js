const express = require('express');
const http = require('http');
const assert = require('assert');
const socket_io = require('../io');
const Client = require('socket.io-client');

let testIO;
let testServer;
let serverSocket;
let clientSocket;
const testApp = express();

const portInUse = (port, callback) => {
	const testServer = http.createServer(testApp);
	testServer.on('error', () => {
		callback(true);
	});
	testServer.on('listening', () => {
		testServer.close();
		callback(false);
	});

	testServer.listen(port);
};

describe('Socket.io Tests', () => {
	before((done) => {
		portInUse(socket_io.port, async (inUse) => {
			clientSocket = Client(`http://localhost:${socket_io.port}`);
			clientSocket.on('connect', done);

			if (!inUse) {
				testServer = http.createServer(testApp);
				testIO = require('socket.io')(testServer);

				testServer.listen(socket_io.port, () => {
					testIO.on('connection', (socket) => {
						serverSocket = socket;
					});
				});
			}
		});
	});

	after(() => {
		if (testServer) testServer.close();
		if (testIO) testIO.close();
		clientSocket.close();
	});

	it('Client should connect.', () => {
		assert.equal(clientSocket.connected, true);
	});

	it('Client should receive message.', (done) => {
		clientSocket.on('ping', (arg) => {
			assert.equal(arg, 'pong');
		});
		
		if (serverSocket) serverSocket.emit('ping', 'pong');
		done();
	});
});
