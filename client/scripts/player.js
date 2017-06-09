function Player(gamePadIndex) {
    
    this.sprite = null
    this.textureName = 'fat'
    this.badge = null
    this.sword = null
    this.score = 0
    this.gamePadIndex = gamePadIndex
    this.keys = {}
    this.respawnTime = null

    // THE DREAM LIVES ON
    // #ONEDAY
    this.socket = {
        id:1
    }

    //Movement
    this.vx = 0
    this.vy = 0
    this.speed = 270
    this.easing = 0.75

    //Shooting
    this.rateOfFire = 300
    this.canFire = true
    this.shootTimer = null

    this.maxHealth = 100
    this.health = this.maxHealth
    this.isAlive = true
    this.respawnTime = 5000

    this.gameState = 'menu'

    this.controllerLayout = {
        axes: {
            x: 0,
            y: 1
        },
        buttons: {
            up: 3,
            right: 1,
            down: 0,
            left: 2
        }
    }

}

Player.prototype.takeDamage = function(weapon) {
    game.soundManager.play.playerHit()
    this.health -= weapon.damage
    if (this.health <= 0) {
        if (weapon.carrier) {
            weapon.carrier.badge.updateScore()
        } else if (weapon.source) {
            weapon.source.badge.updateScore()
        }
        this.die()
    }
    this.badge.updateHealth()
}

Player.prototype.die = function() {

    if (this.sword) {
        this.sword.carrier = null
        this.sword = null
    }

    this.isAlive = false
    this.sprite.x = 100000
    this.sprite.y = 100000
    this.respawnTimer = setTimeout(function() {
        this.reset()
        clearTimeout(this.respawnTimer)
    }.bind(this), this.respawnTime)

}

Player.prototype.reset = function(scoreReset) {
    clearTimeout(this.respawnTimer)
    const spawnPoint = game.getSpawnPoint()
    this.sprite.x = spawnPoint.x
    this.sprite.y = spawnPoint.y
    this.isAlive = true
    this.health = this.maxHealth
    this.gameState = 'game'
    if (scoreReset) this.score = 0
    this.badge.updateHealth()
    this.badge.updateScore(true)
}

Player.prototype.fire = function(direction) {
    if(this.sword){
        if (this.canFire) {
            this.sword.throw(direction)
            this.coolDown()
        }
    } else {
        // Checks if player can fire
        if (this.canFire) {
            game.soundManager.play.pew()
            // Creates a projectile from the desired direction and texture
            const projectile = new Projectile()
            projectile.setup(direction, 1, stage, this)
            game.projectiles.push(projectile)
            // Sets a delay on the rate projectiles are fired
            this.coolDown()
        }
    }
        // Clears any existing timer
        clearInterval(this.shootTimer)
            // Repeated fire interval
        this.shootTimer = setInterval(function() {
            this.fire(direction)
        }.bind(this), this.rateOfFire)
}

Player.prototype.ceaseFire = function() {
    clearInterval(this.shootTimer)
}

Player.prototype.setupKeyboard = function() {
    const keys = this.keys
    keys.walkUp = keyboard(87)
    keys.walkRight = keyboard(68)
    keys.walkDown = keyboard(83)
    keys.walkLeft = keyboard(65)
    keys.fireUp = keyboard(38)
    keys.fireRight = keyboard(39)
    keys.fireDown = keyboard(40)
    keys.fireLeft = keyboard(37)
}

Player.prototype.coolDown = function() {
    this.canFire = false
    setTimeout(function() {
        this.canFire = true
    }.bind(this), this.rateOfFire)
}

Player.prototype.setup = function() {
    this.gameState = 'game'
    this.sprite = new PIXI.Sprite(
        PIXI.loader.resources[this.textureName].texture
    )

    this.sprite.height = 100
    this.sprite.width = 100
    this.sprite.anchor.set(.5, .5)
    const spawnPoint = game.getSpawnPoint()
    this.sprite.x = spawnPoint.x
    this.sprite.y = spawnPoint.y
    this.sprite.zIndex = 0

    if (this.gamePadIndex === undefined) {
        this.setupKeyboard()
    }

    this.badge = new Badge()
    this.badge.setup(this, stage)

    stage.addChild(this.sprite)
}

Player.prototype.getGamePadInfo = function() {
    return gamePad.getGamepadInfo(this.gamePadIndex)
}

Player.prototype.updatePadInput = function(gameover) {
    const gpState = this.getGamePadInfo()
    if (!gpState) return
    // Xbox Controller

    // Movement

    const axes = gpState.axes,
        axesLayout = this.controllerLayout.axes

    // Firing

    const buttons = gpState.buttons,
        buttonsLayout = this.controllerLayout.buttons

    switch (this.gameState) {
        case 'game':
            this.vy = this.speed * axes[axesLayout.y]
            this.vx = this.speed * axes[axesLayout.x]

            // UP
            if (buttons[buttonsLayout.up].pressed) {
                this.fire("up")
            } else {
                this.ceaseFire()
            }

            // RIGHT
            if (buttons[buttonsLayout.right].pressed) {
                this.fire("right")
            } else {
                this.ceaseFire()
            }

            // DOWN
            if (buttons[buttonsLayout.down].pressed) {
                this.fire("down")
            } else {
                this.ceaseFire()
            }

            // LEFT
            if (buttons[buttonsLayout.left].pressed) {
                this.fire("left")
            } else {
                this.ceaseFire()
            }
            break
    case 'gameover':
        // Gameover Controls
        // Back to Menu
        if (buttons[buttonsLayout.right].pressed) {
            gameover.backToMenu()
        }

        // Restart
        if (buttons[buttonsLayout.down].pressed) {
            gameover.restart()
        }
        break
    case 'menu':
        // Menu Controls
        // CANCEL
        if (buttons[buttonsLayout.right].pressed) {
            menu.slots[this.gamePadIndex].cancel()
        }

        // READY
        if (buttons[buttonsLayout.down].pressed) {
            menu.slots[this.gamePadIndex].ready()
        }
        break
    default:
        break
    }
}

Player.prototype.updateKeyInput = function() {

    const keys = this.keys,
        axes = {
            x: 0,
            y: 0
        }

    // Movement

    // UP
    if (keys.walkUp.isDown) {
        axes.y += -1
    }

    // RIGHT
    if (keys.walkRight.isDown) {
        axes.x += 1
    }

    // DOWN
    if (keys.walkDown.isDown) {
        axes.y += 1
    }

    // LEFT
    if (keys.walkLeft.isDown) {
        axes.x += -1
    }
    
    this.vx = this.speed * axes.x
    this.vy = this.speed * axes.y

    // Firing
    
    // UP
    if (keys.fireUp.isDown) {
        this.fire("up")
    } else {
        this.ceaseFire()
    }

    // RIGHT
    if (keys.fireRight.isDown) {
        this.fire("right")
    } else {
        this.ceaseFire()
    }

    // DOWN
    if (keys.fireDown.isDown) {
        this.fire("down")
    } else {
        this.ceaseFire()
    }

    // LEFT
    if (keys.fireLeft.isDown) {
        this.fire("left")
    } else {
        this.ceaseFire()
    }
}
Player.prototype.getSword = function(sword) {
    game.soundManager.play.swordPickup()
    this.sword = sword
    this.sword.setSprite('up')
}

Player.prototype.updateInput = function() {
    if (this.gamePadIndex !== undefined) {
        this.updatePadInput()
    } else {
        this.updateKeyInput()
    }
}

Player.prototype.update = function() {
    if(this.sword){
        this.sword.sprite.x = this.sprite.x + this.sword.xOff
        this.sword.sprite.y = this.sprite.y + this.sword.yOff
    }

    this.sprite.x += this.vx * game.deltaTime
    this.sprite.y += this.vy * game.deltaTime
}
