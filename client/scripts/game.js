function Game() {

    this.players = null
    this.obstacles = null
    this.projectiles = null

    this.gameLoop = () => {
        
        requestAnimationFrame(this.gameLoop)
        for (var idx = this.players.length - 1; idx >= 0; idx--) {
            this.players[idx].update();
        }
        // Loop projectiles
        for (var idx = this.projectiles.length - 1; idx >= 0; idx--) {
            this.projectiles[idx].update()
            
        }
        this.bumpCollisions()
        renderer.render(stage)
    }

    this.setup = () => {
        console.log('Textures Loaded')
        const player = new Player()
        player.setup('demon', stage)
        this.players = []
        this.players.push(player)
        this.obstacles = []
        this.projectiles = []
        for (var idx = 0; idx < 30; idx++) {
            const obstacle = new Obstacle()
            obstacle.setup('obstacle', stage)
            this.obstacles.push(obstacle)    
        }
        
        renderer.render(stage)
        this.gameLoop()
    }
    this.addPlayer = gamePad => {
        const player = new Player()
        player.gamePad = gamePad
        player.setup('demon',stage)
        this.players.push(player)
    }
    this.removeProjectile = idx => {
        stage.removeChild(this.projectiles[idx].sprite)
        this.projectiles.splice(idx,1)
    }
    this.bumpCollisions = () => {
        for (var idx = this.players.length - 1; idx >= 0;idx--){
            BUMP.contain(
                this.players[idx].sprite,
                {x:0, y:0, width: window.innerWidth, height: window.innerHeight},
                true,
                hit => {
                    // console.log(hit)
                }
            )
        }
       for (var q = this.players.length - 1; q >= 0;q--){     
            for (var idx = 0; idx < this.obstacles.length; idx++) {
                BUMP.rectangleCollision(
                    this.players[q].sprite,
                    this.obstacles[idx].sprite,
                    true
                )
                for(var k = this.projectiles.length - 1; k >= 0; k--){
                    if(BUMP.hitTestRectangle(this.projectiles[k].sprite, this.obstacles[idx].sprite)){
                        this.removeProjectile(k)                        
                    }
                    //Test against players and projectiles
                }   
            }
        }
        for (var idx = this.projectiles.length -1; idx >= 0; idx--) {
            BUMP.contain(
                this.projectiles[idx].sprite,
                {x:0, y:0, width: window.innerWidth, height: window.innerHeight},
                true,
                hit => {
                    this.removeProjectile(idx)
                }
            )
        }
    }

}
