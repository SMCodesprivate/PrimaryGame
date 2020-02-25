export default function renderGame(screen, game, requestAnimationFrame, currentPlayerId) {
	const table = document.getElementById('table');
	let newTable = "";
	const context = screen.getContext('2d');

	context.fillStyle = 'white';
	context.clearRect(0, 0, 30, 30);

	for(const playerId in game.state.players) {
		const player = game.state.players[playerId];

		newTable += `<tr>`;
		newTable += `	<td>${playerId}</td>`;
		newTable += `	<td>${player.points}</td>`;
		newTable += `</tr>`;

		context.fillStyle = 'black';
		context.globalAlpha = 0.1;
		context.fillRect(player.x, player.y, 1, 1);
	}
	table.innerHTML = newTable;
	for(const fruitId in game.state.fruits) {
		const fruit = game.state.fruits[fruitId];
		context.fillStyle = 'green';
		context.globalAlpha = 1;
		context.fillRect(fruit.x, fruit.y, 1, 1);
	}

	const currentPlayer = game.state.players[currentPlayerId];

	if(currentPlayer) {
		context.fillStyle = '#F0DB4F';
		context.globalAlpha = 0.9;
		context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1);
	}

	requestAnimationFrame(() => {
		renderGame(screen, game, requestAnimationFrame, currentPlayerId);
	});
}
