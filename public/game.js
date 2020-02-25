export default function createGame() {
	const state = {
		players: {},
		fruits: {},
		screen: {
			width: 30,
			height: 30
		}
	};

	const observers = [];

	function subscribe(observerFunction) {
		observers.push(observerFunction);
	}

	function notifyAll(command) {
		for(const observerFunction of observers) {
			observerFunction(command);
		}
	}

	function addPlayer(command) {
		const { playerId } = command;
		const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
		const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);

		state.players[playerId] = {
			x: playerX,
			y: playerY,
			points: 0
		}

		notifyAll({
			type: 'add-player',
			playerId,
			playerX,
			playerY,
			points: 0
		});
	}

	function removePlayer(command) {
		const { playerId } = command;

		delete state.players[playerId];

		notifyAll({
			type: 'remove-player',
			playerId
		});
	}

	function addFruit(command) {
		const { fruitId } = command;
		const fruitX = 'fruitX' in command ? command.fruitX : Math.floor(Math.random() * state.screen.width);
		const fruitY = 'fruitY' in command ? command.fruitY : Math.floor(Math.random() * state.screen.height);

		state.fruits[fruitId] = {
			x: fruitX,
			y: fruitY
		}

		notifyAll({
			type: 'add-fruit',
			fruitId,
			fruitX,
			fruitY
		});

		checkForFruitCollisionAllPlayers();
	}

	function startGenerateFruit(delay) {
		let index = 0;
		setInterval(() => {
			addFruit({ fruitId: index });
			index++;
		}, delay);
	}

	function removeFruit(command) {
		const { fruitId, player } = command;

		delete state.fruits[fruitId];

		notifyAll({
			type: 'remove-fruit',
			fruitId,
			player
		});
	}

	function setState(newState) {
		Object.assign(state, newState)
	}

	function movePlayer(command) {
		notifyAll(command);

		const { keyPressed, playerId } = command;
		const player = state.players[playerId];
		const movingAccepts = {
			ArrowUp(player) {
				player.y = Math.max(player.y-1, 0);
			},
			ArrowLeft(player) {
				player.x = Math.max(player.x-1, 0);
			},
			ArrowDown(player) {
				player.y = Math.min(player.y+1, state.screen.height-1);
			},
			ArrowRight(player) {
				player.x = Math.min(player.x+1, state.screen.width-1);
			}
		};
		
		const moveFunction = movingAccepts[command.keyPressed];

		if(player && moveFunction) {
			moveFunction(player);
			checkForFruitCollision({ playerId });
		}
	}

	function checkForFruitCollisionAllPlayers() {
		for(const playerId in state.players) {
			const player = state.players[playerId];
			for(const fruitId in state.fruits) {
				const fruit = state.fruits[fruitId];
				if(player.x === fruit.x && player.y === fruit.y) {
					removeFruit({ fruitId });
				}
			}
		}
	}
	
	function checkForFruitCollision(command) {
		const { playerId } = command;
		const player = state.players[playerId];

		for(const fruitId in state.fruits) {
			const fruit = state.fruits[fruitId];
			if(player.x === fruit.x && player.y === fruit.y) {
				player.points += 1;
				removeFruit({ fruitId, player });
			}
		}
	}
	
	return {
		addPlayer,
		removePlayer,
		movePlayer,
		addFruit,
		removeFruit,
		setState,
		state,
		subscribe,
		startGenerateFruit
	}
}
