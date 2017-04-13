function Gamepad(){
	
	// Returns the gamepads array
	this.gamePads = () => { 
		return navigator.getGamepads()
	}

	function canGame() {
		return "getGamepads" in navigator;
	}

	this.getGamepadInfo = i => {
		return navigator.getGamepads()[i];
	}
		
	this.setup = () => {
		if(canGame()) {
			// Check for new game pads at interval
			var checkGP = setInterval(function() {
				const gps = this.gamePads()
				// For each gamepad slot
				for(var k = gps.length - 1; k >= 0;k--){
					const gamePad = gps[k]

					// If there is a controller in the slot
					if (gamePad) {
						// Assume it's not in use
						let inUse = false
						// Check against each player
						for (var idx = game.players.length - 1; idx >= 0; idx--) {
							const playerGamePadIndex = game.players[idx].gamePadIndex
							// If the player is not using a keyboard, and they are using that controller's slot
							if((playerGamePadIndex !== undefined) && (gamePad.index === playerGamePadIndex)) {
								inUse = true
								break
							}
						}
						if (!inUse) {
							// Add a new player with that controller
							game.addPlayer(gamePad.index)
						}
					}
				}
				// clearInterval(checkGP)
			}.bind(this), 5000);
		}
		
	};	
}
	
