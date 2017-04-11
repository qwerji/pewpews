function Game() {

    this.opponents = null
    this.player = null
    this.obstacles = null
    this.projectiles = null

    this.gameLoop = () => {
        requestAnimationFrame(this.gameLoop)

        this.player.update()

        // Loop opponents and update
        // for (var i = 0; i < opponents.length; i++) {
        //     opponents[i].update()
        // }
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
        this.player = player
        console.log(this.player)
        this.opponents = []
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
    this.removeProjectile = idx => {
        stage.removeChild(this.projectiles[idx].sprite)
        this.projectiles.splice(idx,1)
    }
    this.bumpCollisions = () => {
        BUMP.contain(
            this.player.sprite,
            {x:0, y:0, width: window.innerWidth, height: window.innerHeight},
            true,
            hit => {
                // console.log(hit)
            }
        )
        for (var idx = 0; idx < this.obstacles.length; idx++) {
            BUMP.rectangleCollision(
                this.player.sprite,
                this.obstacles[idx].sprite,
                true
            )
            for(var k = this.projectiles.length - 1; k >= 0; k--){
                if(BUMP.hitTestRectangle(this.projectiles[k].sprite, this.obstacles[idx].sprite)){
                    this.removeProjectile(k)
                    console.log()
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
