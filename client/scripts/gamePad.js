function Gamepad(){
	
	this.gamePads = navigator.getGamepads()
	function canGame() {
		return "getGamepads" in navigator;
	}

	function reportOnGamepad() {
		var gp = navigator.getGamepads()[0];
		console.log(navigator.getGamepads())
	}
		
	this.setup = () => {
		const _this = this
		if(canGame()) {
			console.log("WE CAN GAME is woking")
			//setup an interval for Chrome
			var checkGP = window.setInterval(function() {
				for(var k = _this.gamePads.length - 1; k >= 0;k--){
					for (var idx = 0; idx < game.players.length; idx++) {
						if(_this.gamePads[k] && !(_this.gamePads[k] === game.players[idx].gamePad)){
							game.addPlayer(_this.gamePads[k])
							console.log("Player vs Gamepad check is woking")
						}
					}
				}
				reportOnGamepad()
				console.log("This is woking")
			}, 5000);
		}
		
	};	
}
	