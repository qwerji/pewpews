function Game() {

    this.players = null
    this.obstacles = null
    this.projectiles = null
    this.gamePads = null
    this.sword = null
    this.deltaTime = 0
    let fpsTimer = new Date().getTime(),
        fpsInterval

    this.gameLoop = () => {
        this.updateClock()

        for (let obstacleIdx = this.obstacles.length - 1; obstacleIdx >= 0; obstacleIdx--) {
            const obstacle = this.obstacles[obstacleIdx]
            if (BUMP.hitTestRectangle(this.sword.sprite, obstacle.sprite) && (this.sword.carrier && !this.sword.carrier.sword)) {
                this.sword.drop()
            }
        }
        if (this.sword.carrier && !this.sword.carrier.sword) {
            BUMP.contain(
                this.sword.sprite, { x: 50, y: 50, width: renderer.width - 50, height: renderer.height - 50 },
                false,
                hit => {
                    this.sword.drop()
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
                projectile.sprite, { x: 50, y: 50, width: renderer.width - 50, height: renderer.height - 50 },
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
            if (player.isAlive) {

                player.update()

                avgX += player.sprite.x
                avgY += player.sprite.y
                living++

                // Player v wall 
                BUMP.contain(
                        player.sprite, { x: 50, y: 50, width: renderer.width - 50, height: renderer.height - 50 },
                        true,
                        hit => {
                            // console.log(hit)
                        }
                    )
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
                    } else if (!player.sword && !(this.sword.carrier === player) && (Math.abs(this.sword.vy) > 0 || Math.abs(this.sword.vx) > 0)) {
                        player.takeDamage(this.sword)
                    }
                }
            } // end of if alive

        } // end of players loop

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

    this.setup = () => {

        this.gamePads = new Gamepad()
        this.gamePads.setup()

        this.obstacles = []
        this.players = []
        this.projectiles = []

        const player = new Player()
        player.setup('fat', stage)
        this.players.push(player)
        generateLevelFromImage('../images/levels/cornelius.png', this.generateLevel)
        this.sword = new Sword()
        this.sword.setup({ x: renderer.width / 2, y: renderer.height / 2 }, "6", stage);
        (new Wall()).setup('wall', 'top', stage);
        (new Wall()).setup('wall', 'right', stage);
        (new Wall()).setup('wall', 'bottom', stage);
        (new Wall()).setup('wall', 'left', stage)

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
                    p2.vy = p1.vy / 2
                } else if (p1y === p2y) {
                    p1.vy = 0
                    p2.vy = 0
                } else {
                    p1.vy = p2.vy / 2
                }
                break
            case "right":
                if (p1x > p2x) {
                    p2.vx = p1.vx / 2
                } else if (p1x === p2x) {
                    p1.vx = 0
                    p2.vx = 0
                } else {
                    p1.vx = p2.vx / 2
                }
                break
            case "bottom":
                if (p1y > p2y) {
                    p2.vy = p1.vy / 2
                } else if (p1y === p2y) {
                    p1.vy = 0
                    p2.vy = 0
                } else {
                    p1.vy = p2.vy / 2
                }
                break
            case "left":
                if (p1x > p2x) {
                    p2.vx = p1.vx / 2
                } else if (p1x === p2x) {
                    p1.vx = 0
                    p2.vx = 0
                } else {
                    p1.vx = p2.vx / 2
                }
                break
            default:
                break
        }

    }

    this.addPlayer = gamePadIndex => {
        const player = new Player(gamePadIndex)
        player.setup('fat', stage)
        this.players.push(player)
    }
    this.removeProjectile = idx => {
        const deleted = this.projectiles.splice(idx, 1)[0]
        deleted.sprite.destroy(false)
        stage.removeChild(deleted.sprite)
    }

    this.updateClock = () => {
        mspf = new Date().getTime() - fpsTimer
        this.deltaTime = mspf / 1000
        fpsTimer = new Date().getTime()
    }

    this.displayfps = () => {
        fpsDisplay.innerHTML = `${(1000/mspf).toFixed(2)}fps`
    }

    this.generateLevel = level => {
        for (let i = 0; i < level.length; i++) {
            const row = level[i]
            for (let j = 0; j < row.length; j++) {
                if (row[j].a === 255) {
                    const obstacle = new Obstacle()
                    obstacle.setup(
                        'obstacle', { x: (j + 1) * 50, y: (i + 1) * 50 },
                        stage
                    )
                    this.obstacles.push(obstacle)
                }
            }
        }
    }

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
