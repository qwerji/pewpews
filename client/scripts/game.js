function Game() {

    this.players = null
    this.obstacles = null
    this.projectiles = null
    this.gamePads = null
    this.sword = null
    this.deltaTime = 0
    let fpsTimer = new Date().getTime(),
        fpsInterval
    this.levelManager = null
    this.soundManager = null
    this.spawnPoints = null
    this.stopLoop = false

    this.gameLoop = () => {
        if (this.stopLoop) return
        this.updateClock()
        let gameShouldEnd = false
        for (let obstacleIdx = this.obstacles.length - 1; obstacleIdx >= 0; obstacleIdx--) {
            const obstacle = this.obstacles[obstacleIdx]

            BUMP.rectangleCollision(
                this.sword.sprite,
                obstacle.sprite,
                function(hit) {
                    if (this.sword.carrier && !this.sword.carrier.sword) {
                        this.sword.drop(hit)
                    }
                }.bind(this)
            )

        }
        if (this.sword.carrier && !this.sword.carrier.sword) {
            BUMP.contain(
                this.sword.sprite, 
                { x: 50, y: 50, width: renderer.width - 50, height: renderer.height - 50 - statusBarOffset },
                false,
                hit => {
                    this.sword.drop(hit)
                }
            )
        }

        this.sword.update()

        // Projectile update Loop
        for (let projectileIdx = this.projectiles.length - 1; projectileIdx >= 0; projectileIdx--) {
            const projectile = this.projectiles[projectileIdx]
            let projectileShouldBeRemoved = false
            projectile.update()

            // Projectile vs Wall Collision
            BUMP.contain(
                projectile.sprite, 
                { x: 50, y: 50, width: renderer.width - 50, height: renderer.height - 50 - statusBarOffset },
                true,
                hit => {
                    projectileShouldBeRemoved = true
                }
            )

            if (!projectileShouldBeRemoved) {

                for (let obstacleIdx = this.obstacles.length - 1; obstacleIdx >= 0; obstacleIdx--) {

                    const obstacle = this.obstacles[obstacleIdx]

                    // Obstacle vs Projectile Collision
                    if (BUMP.hitTestRectangle(obstacle.sprite, projectile.sprite)) {
                        projectileShouldBeRemoved = true
                    }
                }

            }

            if (projectileShouldBeRemoved) this.removeProjectile(projectileIdx)
        }

        let avgX = 0,
            avgY = 0,
            living = 0

        // Loop through players
        for (let idx = this.players.length - 1; idx >= 0; idx--) {
            const player = this.players[idx]
            if (player.score >= 1) {
                gameShouldEnd = true
                break
            }

            if (player.isAlive) {

                avgX += player.sprite.x
                avgY += player.sprite.y
                living++

                // Projectile vs Players Loop
                for (let j = this.projectiles.length - 1; j >= 0; j--) {
                    const projectile = this.projectiles[j]
                    if (BUMP.hitTestRectangle(projectile.sprite, player.sprite)) {
                        if (projectile.source !== player) {
                            player.takeDamage(projectile)
                            this.removeProjectile(j)
                        }
                    }
                }

                player.updateInput()

                // Player vs PLayer Collisions
                for (let k = this.players.length - 1; k >= 0; k--) {
                    const otherPlayer = this.players[k]
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

                player.update()

                // Player v wall 
                BUMP.contain(
                    player.sprite, 
                    { x: 50, y: 50, width: renderer.width - 50, height: renderer.height - 50 - statusBarOffset },
                    true,
                    hit => {
                        // console.log(hit)
                    }
                )

                // Obstacle vs Player Collision
                for (let obstacleIdx = this.obstacles.length - 1; obstacleIdx >= 0; obstacleIdx--) {

                    const obstacle = this.obstacles[obstacleIdx]
                        // Obstacle vs Player Collision

                    BUMP.rectangleCollision(
                        player.sprite,
                        obstacle.sprite,
                        true
                    )
                }
                if (BUMP.hitTestRectangle(this.sword.sprite, player.sprite)) {
                    if (!this.sword.carrier) {
                        this.sword.equippedBy(player)
                        player.getSword(this.sword)
                    } else if (!player.sword && this.sword.carrier !== player && 
                        (Math.abs(this.sword.vy) > 0 || Math.abs(this.sword.vx) > 0)) {
                        player.takeDamage(this.sword)
                    }
                }
            } // end of if alive

        } // end of players loop

        if (gameShouldEnd) {
            this.gameover()
            return
        }

        // Sword Collisions with walls and obstacles
        
        avgX /= living
        avgY /= living

        // Camera Movement
        // stage.pivot.x = avgX
        // stage.pivot.y = avgY
        // stage.position.x = renderer.width/2
        // stage.position.y = renderer.height/2

        renderer.render(stage)
        requestAnimationFrame(this.gameLoop)
    }

    this.start = players => {
        const bounds = new PIXI.Graphics();
        bounds.beginFill(0xA0A0A0);
        bounds.drawRect(0, 0, renderer.width, renderer.height-statusBarOffset);
        bounds.endFill();
        bounds.zIndex = -10000
        stage.addChild(bounds)
        this.levelManager = new LevelManager()
        this.soundManager = new SoundManager()

        this.obstacles = []
        this.players = players
        this.projectiles = []

        this.stopLoop = false

        this.levelManager.getLevel(2, function(level) {
            this.sword = level.sword
            this.obstacles = level.obstacles
            this.spawnPoints = level.spawnPoints

            this.players.forEach(player=> player.setup())

            fpsInterval = setInterval(this.displayfps, 200)

            this.gameLoop()

        }.bind(this))
    }

    this.handlePlayerCollision = (collision, p1, p2) => {
        
        if (!collision) return

        const p1x = Math.abs(p1.vx),
            p1y = Math.abs(p1.vy),
            p2x = Math.abs(p2.vx),
            p2y = Math.abs(p2.vy)

        // console.log('PRE CHANGE')
        // console.log('p1', p1x, p1y)
        // console.log('p2', p2x, p2y)

        switch (collision) {
            case "top":
                if (p1y > p2y) {
                    p2.vy = p1.vy / 2
                    p1.vy = p1.vy / 2
                } else if (p1y === p2y) {
                    p1.vy = 0
                    p2.vy = 0
                } else {
                    p1.vy = p2.vy / 2
                    p2.vy = p2.vy / 2
                }
                break
            case "right":
                if (p1x > p2x) {
                    p2.vx = p1.vx / 2
                    p1.vx = p1.vx / 2
                } else if (p1x === p2x) {
                    p1.vx = 0
                    p2.vx = 0
                } else {
                    p1.vx = p2.vx / 2
                    p2.vx = p2.vx / 2
                }
                break
            case "bottom":
                if (p1y > p2y) {
                    p2.vy = p1.vy / 2
                    p1.vy = p1.vy / 2
                } else if (p1y === p2y) {
                    p1.vy = 0
                    p2.vy = 0
                } else {
                    p1.vy = p2.vy / 2
                    p2.vy = p2.vy / 2
                }
                break
            case "left":
                if (p1x > p2x) {
                    p2.vx = p1.vx / 2
                    p1.vx = p1.vx / 2
                } else if (p1x === p2x) {
                    p1.vx = 0
                    p2.vx = 0
                } else {
                    p1.vx = p2.vx / 2
                    p2.vx = p2.vx / 2
                }
                break
            default:
                break
        }

        // console.log('POST CHANGE')
        // console.log('p1', p1.vx, p1.vy)
        // console.log('p2', p2.vx, p2.vy)
    }

    this.removePlayer = i => {
        const deleted = this.players.splice(i,1)[0]
        deleted.sprite.destroy(false)
        deleted.healthBar.destroy(false)
        stage.removeChild(deleted.sprite)
        stage.removeChild(deleted.healthBar)
    }

    this.getSpawnPoint = () => {
        return this.spawnPoints[randomInt(0,this.spawnPoints.length - 1)]
    }

    this.removeProjectile = idx => {
        const deleted = this.projectiles.splice(idx, 1)[0]
        deleted.sprite.destroy(false)
        stage.removeChild(deleted.sprite)
    }

    this.gameover = () => {
        const gameOverMenu = new GameOver()

        let winner = this.players[0]
        winner.gameState = 'gameover'
        for (let i = 1; i < this.players.length; i++) {
            const player = this.players[i]
            if (player.score > winner.score) {
                winner = player
            }
        }

        gameOverMenu.setup({winner,player:this.players[0]})
    }

    this.restart = () => {
        this.players.forEach(player => player.reset(true))
        this.sword.reset()
        for (let i = 0; i < this.projectiles.length; i++) {
            this.removeProjectile(i)
        }
    }

    this.updateClock = () => {
        mspf = new Date().getTime() - fpsTimer
        this.deltaTime = mspf / 1000
        fpsTimer = new Date().getTime()
    }

    this.displayfps = () => {
        fpsDisplay.innerHTML = `${(1000/mspf).toFixed(2)}fps`
    }

    this.constants = {
        healthBarTextStyle: new PIXI.TextStyle({
            fontFamily: 'Monaco',
            fontSize: 24,
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
