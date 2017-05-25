function Gamepad() {

	let prevState = null

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
        if (canGame()) {
            // Check for new game pads at interval
            const checkGP = setInterval(function() {
                const gamePads = this.gamePads()
                // For each gamepad slot
                for (let i = gamePads.length - 1; i >= 0; i--) {
                    const gamePad = gamePads[i]

                    // If there is a controller in the slot
                    if (gamePad) {
                        // Assume it's not in use
                        let inUse = false
                            // Check against each player
                        for (let k = game.players.length - 1; k >= 0; k--) {
                            const playerIdx = game.players[k].gamePadIndex
                                // If the player is not using a keyboard, and they are using that controller's slot
                            if ((playerIdx !== undefined) && (gamePad.index === playerIdx)) {
                                inUse = true
                                break
                            }
                        }
                        if (!inUse) {
                            // Add a new player with that controller
                            game.addPlayer(gamePad.index)
                        }
                    } else {
                    	if (prevState) {
                    		if (prevState[i] !== null) {
                    			// Handle controller disconnect
                    			for (let j = game.players.length-1; j >= 0; j--) {
                    				const player = game.players[j]
                    				if (player.gamePadIndex === i) {
                    					game.removePlayer(j)
                    					break
                    				}
                    			}
                    		}
                    	}
                    }
                }
                prevState = JSON.parse(JSON.stringify(gamePads))
                // clearInterval(checkGP)
            }.bind(this), 5000);
        }
    }

}
