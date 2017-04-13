function Game() {

    this.players = null
    this.obstacles = null
    this.projectiles = null
    this.gamePads = null

    this.deltaTime = 0
    let fpsTimer = new Date().getTime(), fpsInterval

    this.gameLoop = () => {
        this.updateClock()

        // for (var idx = this.players.length - 1; idx >= 0; idx--) {
        //     this.players[idx].update();
        // }
        // // Loop projectiles
        // for (var idx = this.projectiles.length - 1; idx >= 0; idx--) {
        //     this.projectiles[idx].update()
        // }
        // this.bumpCollisions()

        let projectilesUpdated = false, obstaclesvPlayersUpdated = false

        for (let playerIdx = this.players.length - 1; playerIdx >= 0 ; playerIdx--) {

            const player = this.players[playerIdx]
            let obstaclesvThisPlayerUpdated = false

            // Update player movement
            player.update()

            // Player vs Walls Collision
            if (player.isAlive) {
                BUMP.contain(
                    player.sprite, { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight },
                    true,
                    hit => {
                        // console.log(hit)
                    }
                )
            }

            for (let playerIdx2 = this.players.length - 1; playerIdx2 >= 0 ; playerIdx2--) {

                const otherPlayer = this.players[playerIdx2]

                // Player vs Player Collision
                if (player !== otherPlayer && player.isAlive && otherPlayer.isAlive) {
                    this.handlePlayerCollision(
                        BUMP.rectangleCollision(
                            player.sprite,
                            otherPlayer.sprite,
                            true
                        ),
                        player,
                        otherPlayer
                    )
                }

            }

            for (let projectileIdx = this.projectiles.length - 1; projectileIdx >= 0; projectileIdx--) {

                const projectile = this.projectiles[projectileIdx]
                let projectileShouldBeRemoved = false

                // Update projectile movement
                if (!projectilesUpdated) {
                    projectile.update()
                }

                // Projectile vs Player Collision
                if (player.isAlive) {
                    if (BUMP.hitTestRectangle(projectile.sprite, player.sprite)) {
                        if (projectile.source !== player) {
                            projectileShouldBeRemoved = true
                            player.takeDamage(projectile)
                        }
                    }
                }

                // Projectile vs Wall Collision
                BUMP.contain(
                    projectile.sprite, { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight },
                    true,
                    hit => {
                        projectileShouldBeRemoved = true
                    }
                )

                for (let obstacleIdx = this.obstacles.length - 1; obstacleIdx >= 0; obstacleIdx--) {

                    const obstacle = this.obstacles[obstacleIdx]

                    // Obstacle vs Projectile Collision
                    if (BUMP.hitTestRectangle(obstacle.sprite, projectile.sprite)) {
                        projectileShouldBeRemoved = true
                    }

                    // Obstacle vs Player Collision
                    if (!obstaclesvThisPlayerUpdated && player.isAlive) {
                        
                        BUMP.rectangleCollision(
                            player.sprite,
                            obstacle.sprite,
                            true
                        )

                    }
                }
                obstaclesvThisPlayerUpdated = true
                if (projectileShouldBeRemoved) this.removeProjectile(projectileIdx)
            }

            // THIS IS A BODGE
            if (this.projectiles.length <= 0 && player.isAlive) {

                for (let obstacleIdx = this.obstacles.length - 1; obstacleIdx >= 0; obstacleIdx--) {

                    const obstacle = this.obstacles[obstacleIdx]

                    // Obstacle vs Player Collision
                    BUMP.rectangleCollision(
                        player.sprite,
                        obstacle.sprite,
                        true
                    )

                }
            }
            // End bodge

            projectilesUpdated = true
            obstaclesvThisPlayerUpdated = false
        }
        stage.children.sort(sortByZ)
        renderer.render(stage)
        requestAnimationFrame(this.gameLoop)
    }

    this.setup = () => {
        console.log('Textures Loaded')

        this.gamePads = new Gamepad()
        this.gamePads.setup()

        this.obstacles = []
        this.players = []
        this.projectiles = []

        const player = new Player()
        player.setup('fat', stage)
        this.players.push(player)

        for (var idx = 0; idx < 10; idx++) {
            const obstacle = new Obstacle()
            obstacle.setup('obstacle', stage)
            this.obstacles.push(obstacle)    
        }
        
        renderer.render(stage)

        fpsInterval = setInterval(this.displayfps, 200)

        this.gameLoop()
    }

    this.handlePlayerCollision = (collision, p1, p2) => {

        if (!collision) return

        const p1x = Math.abs(p1.vx),
            p1y = Math.abs(p1.vy),
            p2x = Math.abs(p2.vx),
            p2y = Math.abs(p2.vy)
        
        switch (collision) {
            case "top":
                if (p1y > p2y) {
                    p2.vy = p1.vy/2
                } else if (p1y === p2y) {
                    p1.vy = 0
                    p2.vy = 0
                } else {
                    p1.vy = p2.vy/2
                }
                break
            case "right":
                if (p1x > p2x) {
                    p2.vx = p1.vx/2
                } else if (p1x === p2x) {
                    p1.vx = 0
                    p2.vx = 0
                } else {
                    p1.vx = p2.vx/2
                }
                break
            case "bottom":
                if (p1y > p2y) {
                    p2.vy = p1.vy/2
                } else if (p1y === p2y) {
                    p1.vy = 0
                    p2.vy = 0
                } else {
                    p1.vy = p2.vy/2
                }
                break
            case "left":
                if (p1x > p2x) {
                    p2.vx = p1.vx/2
                } else if (p1x === p2x) {
                    p1.vx = 0
                    p2.vx = 0
                } else {
                    p1.vx = p2.vx/2
                }
                break
            default:
                break
        }

    }

    this.addPlayer = gamePadIndex => {
        const player = new Player(gamePadIndex)
        player.setup('fat',stage)
        this.players.push(player)
    }
    this.removeProjectile = idx => {
        const deleted = this.projectiles.splice(idx,1)[0]
        deleted.sprite.destroy(false)
        stage.removeChild(deleted.sprite)
    }

    this.updateClock = () => {
        mspf = new Date().getTime() - fpsTimer
        this.deltaTime = mspf/1000
        fpsTimer = new Date().getTime()
    }

    this.displayfps = () => {
        fpsDisplay.innerHTML = `${(1000/mspf).toFixed(2)}fps`
    }

    // this.bumpCollisions = () => {
    //     for (var idx = this.players.length - 1; idx >= 0;idx--){
    //         BUMP.contain(
    //             this.players[idx].sprite,
    //             {x:0, y:0, width: window.innerWidth, height: window.innerHeight},
    //             true,
    //             hit => {
    //                 // console.log(hit)
    //             }
    //         )
    //     }
    //     for (var q = this.players.length - 1; q >= 0; q--) {
    //         for (var idx = 0; idx < this.obstacles.length; idx++) {
    //             BUMP.rectangleCollision(
    //                 this.players[q].sprite,
    //                 this.obstacles[idx].sprite,
    //                 true
    //             )
    //             for (var k = this.projectiles.length - 1; k >= 0; k--) {
    //                 BUMP.contain(
    //                     this.projectiles[idx].sprite, { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight },
    //                     true,
    //                     hit => {
    //                         this.removeProjectile(idx)
    //                     }
    //                 )
    //                 if (BUMP.hitTestRectangle(this.projectiles[k].sprite, this.obstacles[idx].sprite)) {
    //                     this.removeProjectile(k)
    //                 }
    //                 //Test against players and projectiles
    //             }
    //         }
    //     }
    // }

    this.constants = {
        healthBarTextStyle: new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440
        })
    }


}
