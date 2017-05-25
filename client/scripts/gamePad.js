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
                        for (let k = menu.slots.length - 1; k >= 0; k--) {
                            if(menu.slots[k].player){
                                const playerIdx = menu.slots[k].player.gamePadIndex
                                    // If the player is not using a keyboard, and they are using that controller's slot
                                if ((playerIdx !== undefined) && (gamePad.index === playerIdx)) {
                                    inUse = true
                                    break
                                }
                            }
                        }
                        if (!inUse) {
                            // Add a new player with that controller
                            menu.addPlayer(gamePad.index)
                        }
                    } else {
                    	if (prevState) {
                    		if (prevState[i] !== null) {
                    			// Handle controller disconnect
                    			for (let j = menu.slots.length-1; j >= 0; j--) {
                    				const player = menu.slots[j].player
                    				if (player && player.gamePadIndex === i) {
                    					menu.removePlayer(j)
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
