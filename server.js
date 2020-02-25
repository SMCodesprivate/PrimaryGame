import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import createGame from './public/game.js';

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);

app.use(express.static('public'));

const game = createGame();

game.subscribe((command) => {
	sockets.emit(command.type, command);
});

game.startGenerateFruit(1000);

sockets.on('connection', (socket) => {
	const playerId = socket.id;

	game.addPlayer({ playerId });

	socket.emit('action', game.state);

	socket.on('disconnect', () => {
		game.removePlayer({ playerId });
	});

	socket.on('move-player', (command) => {
		command.playerId = playerId;
		command.type = 'move-player';

		game.movePlayer(command);
	});
});


server.listen(3333);